import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const REFRESH_INTERVAL_MS = 15_000;
const FOCUS_REFRESH_DEBOUNCE_MS = 1_000;

/**
 * Keep an analytics report current while it is open in another tab.
 * Returning to the tab refreshes immediately; a visible tab also polls at a
 * conservative interval. Inertia preserves filters, scroll, and local state.
 */
export function useLiveAnalyticsRefresh(only: string[]): void {
    const requestInFlight = useRef(false);
    const lastRefreshAt = useRef(0);

    useEffect(() => {
        const refresh = () => {
            const now = Date.now();

            if (
                document.visibilityState !== 'visible' ||
                requestInFlight.current ||
                now - lastRefreshAt.current < FOCUS_REFRESH_DEBOUNCE_MS
            ) {
                return;
            }

            requestInFlight.current = true;
            lastRefreshAt.current = now;

            router.reload({
                only,
                onFinish: () => {
                    requestInFlight.current = false;
                },
            });
        };

        const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
        window.addEventListener('focus', refresh);
        document.addEventListener('visibilitychange', refresh);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', refresh);
            document.removeEventListener('visibilitychange', refresh);
        };
    }, [only]);
}
