import { useCallback, useEffect } from 'react';

const REFERRAL_SOURCE_KEY = 'referral_source';
const ANALYTICS_SESSION_ID_KEY = 'analytics_session_id_v1';
const VISIT_TRACKED_PREFIX = 'analytics_visit_tracked:';
const pendingVisitKeys = new Set<string>();
let inMemoryAnalyticsSessionId: string | null = null;

export type AnalyticsEventType =
    | 'visit'
    | 'scroll'
    | 'engagement'
    | 'cta_click'
    | 'initiate_checkout'
    | 'conversion'
    | 'payment'
    | 'section_view';

interface AnalyticsEvent {
    event_type: AnalyticsEventType;
    event_data?: Record<string, unknown>;
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}

export function generateEventId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function readSessionStorage(key: string): string | null {
    try {
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeSessionStorage(key: string, value: string): void {
    try {
        sessionStorage.setItem(key, value);
    } catch {
        // Analytics must still work when storage is blocked by the browser.
    }
}

function removeSessionStorage(key: string): void {
    try {
        sessionStorage.removeItem(key);
    } catch {
        // Nothing to clean up when storage is unavailable.
    }
}

export function getAnalyticsSessionId(): string {
    if (inMemoryAnalyticsSessionId) {
        return inMemoryAnalyticsSessionId;
    }

    const storedSessionId = readSessionStorage(ANALYTICS_SESSION_ID_KEY);

    if (storedSessionId) {
        inMemoryAnalyticsSessionId = storedSessionId;

        return storedSessionId;
    }

    inMemoryAnalyticsSessionId = generateEventId();
    writeSessionStorage(ANALYTICS_SESSION_ID_KEY, inMemoryAnalyticsSessionId);

    return inMemoryAnalyticsSessionId;
}

function getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    return match ? decodeURIComponent(match[2]) : null;
}

export function getLandingSource(): string {
    if (typeof window === 'undefined') {
        return 'unknown';
    }

    // A/B analytics must describe the page where the event happened. Keeping
    // the first page in sessionStorage misattributes later visits (for example,
    // opening /c10-lp after another variant) and can also suppress its visit.
    return window.location.pathname;
}

export function useAnalytics() {
    const coursePrice = import.meta.env.VITE_COURSE_PRICE;

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (!readSessionStorage(REFERRAL_SOURCE_KEY)) {
            const urlParams = new URLSearchParams(window.location.search);
            let externalReferrer = '';

            if (document.referrer) {
                try {
                    externalReferrer =
                        new URL(document.referrer).hostname ===
                        window.location.hostname
                            ? ''
                            : document.referrer;
                } catch {
                    externalReferrer = '';
                }
            }

            writeSessionStorage(
                REFERRAL_SOURCE_KEY,
                urlParams.get('ref') || externalReferrer || 'direct',
            );
        }
    }, []);

    const track = useCallback(
        async (event: AnalyticsEvent): Promise<boolean> => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const suppliedEventId = event.event_data?.event_id;
                const eventId =
                    typeof suppliedEventId === 'string'
                        ? suppliedEventId
                        : generateEventId();
                const payload = {
                    ...event,
                    event_data: {
                        ...event.event_data,
                        event_id: eventId,
                        analytics_session_id: getAnalyticsSessionId(),
                        landing_source: getLandingSource(),
                    },
                    referral_source:
                        event.referral_source ||
                        readSessionStorage(REFERRAL_SOURCE_KEY) ||
                        'direct',
                    utm_source: event.utm_source || urlParams.get('utm_source'),
                    utm_medium: event.utm_medium || urlParams.get('utm_medium'),
                    utm_campaign:
                        event.utm_campaign || urlParams.get('utm_campaign'),
                    utm_content:
                        event.utm_content || urlParams.get('utm_content'),
                    utm_term: event.utm_term || urlParams.get('utm_term'),
                };

                for (let attempt = 0; attempt < 2; attempt += 1) {
                    try {
                        const response = await fetch('/analytics/track', {
                            method: 'POST',
                            credentials: 'same-origin',
                            keepalive: true,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN':
                                    document
                                        .querySelector('meta[name=csrf-token]')
                                        ?.getAttribute('content') || '',
                            },
                            body: JSON.stringify(payload),
                        });

                        if (response.ok) {
                            return true;
                        }

                        if (response.status < 500 && response.status !== 429) {
                            console.debug(
                                `Analytics tracking rejected (${response.status})`,
                            );

                            return false;
                        }
                    } catch (error) {
                        if (attempt === 1) {
                            throw error;
                        }
                    }
                }

                console.debug('Analytics tracking failed after retry');

                return false;
            } catch (error) {
                console.debug('Analytics tracking failed:', error);

                return false;
            }
        },
        [],
    );

    const trackVisit = useCallback(() => {
        const landingSource = getLandingSource();
        const visitKey = `${VISIT_TRACKED_PREFIX}${getAnalyticsSessionId()}:${landingSource}`;

        if (
            readSessionStorage(visitKey) === 'tracked' ||
            pendingVisitKeys.has(visitKey)
        ) {
            return;
        }

        pendingVisitKeys.add(visitKey);

        const eventId =
            ((window as unknown as Record<string, unknown>)
                .__META_PAGE_VIEW_EVENT_ID as string) || generateEventId();

        void track({
            event_type: 'visit',
            event_data: {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
            },
        }).then((success) => {
            pendingVisitKeys.delete(visitKey);

            if (success) {
                writeSessionStorage(visitKey, 'tracked');

                return;
            }

            removeSessionStorage(visitKey);
        });
    }, [track]);

    const trackScroll = useCallback(
        (depth: number) => {
            void track({
                event_type: 'scroll',
                event_data: {
                    depth,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackEngagement = useCallback(
        (duration: number, isInitial = false) => {
            void track({
                event_type: 'engagement',
                event_data: {
                    type: 'dwell_ping',
                    duration,
                    is_initial: isInitial,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackInteraction = useCallback(
        (location: string, text: string) => {
            void track({
                event_type: 'engagement',
                event_data: {
                    type: 'survey_response',
                    location,
                    text,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackCTA = useCallback(
        (location: string, text: string, destination = 'unknown') => {
            void track({
                event_type: 'cta_click',
                event_data: {
                    location,
                    text,
                    destination,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackInitiateCheckout = useCallback(
        (
            location: string,
            data?: Record<string, unknown>,
            eventId = generateEventId(),
        ) => {
            void track({
                event_type: 'initiate_checkout',
                event_data: {
                    type: 'external_payment_redirect',
                    location,
                    event_id: eventId,
                    _fbp: getCookieValue('_fbp'),
                    _fbc: getCookieValue('_fbc'),
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    const trackConversion = useCallback(
        (type: string, data?: Record<string, unknown>) => {
            void track({
                event_type: 'conversion',
                event_data: {
                    type,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    const trackPayment = useCallback(
        (status: string, data?: Record<string, unknown>) => {
            void track({
                event_type: 'payment',
                event_data: {
                    status,
                    amount: coursePrice,
                    currency: 'IDR',
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track, coursePrice],
    );

    const trackSectionView = useCallback(
        (sectionId: string, data?: Record<string, unknown>) => {
            return track({
                event_type: 'section_view',
                event_data: {
                    section: sectionId,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    return {
        track,
        trackVisit,
        trackScroll,
        trackEngagement,
        trackInteraction,
        trackCTA,
        trackInitiateCheckout,
        trackConversion,
        trackPayment,
        trackSectionView,
    };
}
