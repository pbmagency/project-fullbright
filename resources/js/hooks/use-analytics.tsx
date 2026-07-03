import { useCallback, useEffect } from 'react';

const LANDING_SOURCE_KEY  = 'landing_source';
const REFERRAL_SOURCE_KEY = 'referral_source';

export function generateEventId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}

interface AnalyticsEvent {
    event_type: 'visit' | 'scroll' | 'engagement' | 'conversion' | 'payment' | 'cta_click';
    event_data?: Record<string, unknown>;
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}

export function getLandingSource(): string {
    if (typeof window === 'undefined') return 'unknown';
    return sessionStorage.getItem(LANDING_SOURCE_KEY) || window.location.pathname;
}

export function useAnalytics() {
    const coursePrice = import.meta.env.VITE_COURSE_PRICE;

    // Store landing source and referral source once on first visit
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!sessionStorage.getItem(LANDING_SOURCE_KEY)) {
            sessionStorage.setItem(LANDING_SOURCE_KEY, window.location.pathname);
        }
        if (!sessionStorage.getItem(REFERRAL_SOURCE_KEY)) {
            const urlParams = new URLSearchParams(window.location.search);
            const getExternalReferrer = () => {
                if (!document.referrer) return '';
                try {
                    return new URL(document.referrer).hostname === window.location.hostname ? '' : document.referrer;
                } catch { return ''; }
            };
            const source = urlParams.get('ref') || getExternalReferrer() || 'direct';
            sessionStorage.setItem(REFERRAL_SOURCE_KEY, source);
        }
    }, []);

    const track = useCallback(async (event: AnalyticsEvent) => {
        try {
            const landingSource  = getLandingSource();
            const referralSource = sessionStorage.getItem(REFERRAL_SOURCE_KEY) || 'direct';
            const urlParams      = new URLSearchParams(window.location.search);

            const payload = {
                ...event,
                event_data: { ...event.event_data, landing_source: landingSource },
                referral_source: event.referral_source || referralSource,
                utm_source:   event.utm_source   || urlParams.get('utm_source'),
                utm_medium:   event.utm_medium   || urlParams.get('utm_medium'),
                utm_campaign: event.utm_campaign || urlParams.get('utm_campaign'),
                utm_content:  event.utm_content  || urlParams.get('utm_content'),
                utm_term:     event.utm_term     || urlParams.get('utm_term'),
            };

            await fetch('/analytics/track', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            // Silent fail — analytics must never break the page
            console.debug('Analytics tracking failed:', error);
        }
    }, []);

    const trackVisit = useCallback(() => {
        const eventId = (window as Record<string, unknown>).__META_PAGE_VIEW_EVENT_ID as string || generateEventId();
        track({
            event_type: 'visit',
            event_data: {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
            },
        });
    }, [track]);

    const trackScroll = useCallback((depth: number) => {
        track({
            event_type: 'scroll',
            event_data: { depth, page: window.location.pathname, timestamp: new Date().toISOString() },
        });
    }, [track]);

    const trackEngagement = useCallback((type: string, data?: Record<string, unknown>) => {
        track({
            event_type: 'engagement',
            event_data: { type, page: window.location.pathname, timestamp: new Date().toISOString(), ...data },
        });
    }, [track]);

    const trackConversion = useCallback((type: string, data?: Record<string, unknown>) => {
        track({
            event_type: 'conversion',
            event_data: { type, page: window.location.pathname, timestamp: new Date().toISOString(), ...data },
        });
    }, [track]);

    const trackPayment = useCallback((status: string, data?: Record<string, unknown>) => {
        track({
            event_type: 'payment',
            event_data: { status, amount: coursePrice, currency: 'IDR', timestamp: new Date().toISOString(), ...data },
        });
    }, [track, coursePrice]);

    const trackCTA = useCallback((
        location: string,
        text: string,
        destination?: string,
        metaEvent?: string,
        eventId?: string,
        extraData?: Record<string, unknown>,
    ) => {
        track({
            event_type: 'cta_click',
            event_data: {
                location,
                text,
                destination: destination || 'unknown',
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                meta_event: metaEvent,
                event_id: eventId,
                ...(metaEvent ? { _fbp: getCookieValue('_fbp'), _fbc: getCookieValue('_fbc') } : {}),
                ...extraData,
            },
        });
    }, [track]);

    return { track, trackVisit, trackScroll, trackEngagement, trackConversion, trackPayment, trackCTA };
}
