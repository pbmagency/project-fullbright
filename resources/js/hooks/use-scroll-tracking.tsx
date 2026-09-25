import { useEffect, useRef } from 'react';
import { useAnalytics } from './use-analytics';

export function useScrollTracking(throttleMs = 200) {
    const { trackScroll } = useAnalytics();
    const scrollDepths = useRef(new Set<number>());
    const lastScrollTime = useRef(0);

    useEffect(() => {
        let trailingTimer: ReturnType<typeof setTimeout> | null = null;
        const recordDepth = () => {
            lastScrollTime.current = Date.now();

            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) {
                return;
            }

            const scrollPercent = Math.round(
                (window.scrollY / scrollHeight) * 100,
            );

            [25, 50, 75, 90].forEach((milestone) => {
                if (
                    scrollPercent >= milestone &&
                    !scrollDepths.current.has(milestone)
                ) {
                    scrollDepths.current.add(milestone);
                    trackScroll(milestone);
                }
            });
        };

        const handleScroll = () => {
            const remaining = throttleMs - (Date.now() - lastScrollTime.current);

            if (remaining <= 0) {
                if (trailingTimer !== null) {
                    clearTimeout(trailingTimer);
                    trailingTimer = null;
                }

                recordDepth();
            } else if (trailingTimer === null) {
                trailingTimer = setTimeout(() => {
                    trailingTimer = null;
                    recordDepth();
                }, remaining);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);

            if (trailingTimer !== null) {
                clearTimeout(trailingTimer);
            }
        };
    }, [trackScroll, throttleMs]);
}
