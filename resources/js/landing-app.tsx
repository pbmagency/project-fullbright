// Keep the large interactive page bundle out of the critical rendering path.
// The server-rendered header and hero remain in the DOM, so loading React never
// replaces the LCP element. Interaction always wins over the idle delay.
let mountPromise: Promise<void> | null = null;
let activeHashNavigation: AbortController | null = null;

const HASH_TARGET_WAIT_MS = 3000;
const SMOOTH_SCROLL_SETTLE_MS = 800;
const LAYOUT_SHIFT_GUARD_MS = 4000;

function hashTarget(destination: string): HTMLElement | null {
    if (!destination.startsWith('#')) {
        return null;
    }

    try {
        return document.getElementById(
            decodeURIComponent(destination.slice(1)),
        );
    } catch {
        return null;
    }
}

function scrollMarginTop(element: HTMLElement): number {
    const margin = Number.parseFloat(
        window.getComputedStyle(element).scrollMarginTop,
    );

    return Number.isFinite(margin) ? margin : 0;
}

function waitForHashTarget(
    destination: string,
    signal: AbortSignal,
): Promise<HTMLElement | null> {
    const startedAt = performance.now();

    return new Promise((resolve) => {
        const findTarget = (): void => {
            if (signal.aborted) {
                resolve(null);

                return;
            }

            const target = hashTarget(destination);

            if (target) {
                resolve(target);

                return;
            }

            if (performance.now() - startedAt >= HASH_TARGET_WAIT_MS) {
                resolve(null);

                return;
            }

            window.requestAnimationFrame(findTarget);
        };

        findTarget();
    });
}

async function navigateToHash(destination: string): Promise<void> {
    activeHashNavigation?.abort();

    const navigation = new AbortController();
    const { signal } = navigation;
    activeHashNavigation = navigation;
    const target = await waitForHashTarget(destination, signal);

    if (!target || signal.aborted) {
        return;
    }

    history.replaceState(null, '', destination);

    const cancelForUserNavigation = (): void => navigation.abort();
    const cancelForNavigationKey = (event: KeyboardEvent): void => {
        if (
            [
                'ArrowDown',
                'ArrowUp',
                'End',
                'Home',
                'PageDown',
                'PageUp',
                ' ',
            ].includes(event.key)
        ) {
            cancelForUserNavigation();
        }
    };
    const listenerOptions = { passive: true, signal };

    window.addEventListener('wheel', cancelForUserNavigation, listenerOptions);
    window.addEventListener(
        'touchstart',
        cancelForUserNavigation,
        listenerOptions,
    );
    window.addEventListener(
        'pointerdown',
        cancelForUserNavigation,
        listenerOptions,
    );
    window.addEventListener('keydown', cancelForNavigationKey, { signal });

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;
    target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
    });

    // A single smooth scroll preserves the expected interaction. Once it has
    // finished, keep the target pinned briefly while late fonts/media above it
    // finish laying out. User-initiated navigation cancels this guard.
    window.setTimeout(
        () => {
            if (signal.aborted) {
                return;
            }

            const guardStartedAt = performance.now();
            const correctLayoutShift = (): void => {
                if (signal.aborted) {
                    return;
                }

                const currentTarget = hashTarget(destination);

                if (
                    !currentTarget ||
                    performance.now() - guardStartedAt >= LAYOUT_SHIFT_GUARD_MS
                ) {
                    navigation.abort();

                    return;
                }

                const offset =
                    currentTarget.getBoundingClientRect().top -
                    scrollMarginTop(currentTarget);

                if (Math.abs(offset) > 1) {
                    window.scrollBy({ top: offset, behavior: 'auto' });
                }

                window.requestAnimationFrame(correctLayoutShift);
            };

            correctLayoutShift();
        },
        prefersReducedMotion ? 0 : SMOOTH_SCROLL_SETTLE_MS,
    );
}

function mountInteractivePage(): Promise<void> {
    if (!mountPromise) {
        mountPromise = import('./cycle12-app').then(({ mountCycle12App }) => {
            mountCycle12App();
        });
    }

    return mountPromise;
}

const idleWindow = window as Window & {
    requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
    ) => number;
};

// Start loading the rest of the page after the first paint. Delaying this for
// eight seconds leaves only the server-rendered hero in the document, so users
// cannot scroll beyond it until the React bundle finally mounts.
window.requestAnimationFrame(() => {
    if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(() => void mountInteractivePage(), {
            timeout: 1200,
        });
    } else {
        void mountInteractivePage();
    }
});

const interactiveRoot = document.getElementById('app');

if (interactiveRoot && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            void mountInteractivePage();
        }
    });
    observer.observe(interactiveRoot);
}

window.addEventListener('pointerdown', () => void mountInteractivePage(), {
    once: true,
    passive: true,
});
window.addEventListener('wheel', () => void mountInteractivePage(), {
    once: true,
    passive: true,
});
window.addEventListener('touchstart', () => void mountInteractivePage(), {
    once: true,
    passive: true,
});
window.addEventListener('keydown', () => void mountInteractivePage(), {
    once: true,
    passive: true,
});

document
    .querySelectorAll<HTMLAnchorElement>('#c12-critical a[href^="#"]')
    .forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const destination = anchor.getAttribute('href');

            if (!destination || destination === '#') {
                return;
            }

            const location = anchor.dataset.analyticsLocation;

            if (location) {
                const label = (
                    anchor.getAttribute('aria-label') ||
                    anchor.textContent ||
                    'CTA'
                )
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 255);
                const clickedAt = new Date().toISOString();

                // The critical hero deliberately exists outside React. Load the
                // shared tracker on demand so its very first CTA click is recorded
                // without pulling React into the critical page bundle.
                void import('./hooks/use-analytics').then(
                    ({ generateEventId, trackAnalyticsEvent }) =>
                        trackAnalyticsEvent({
                            event_type: 'cta_click',
                            event_data: {
                                event_id: generateEventId(),
                                location,
                                text: label,
                                destination,
                                page: window.location.pathname,
                                timestamp: clickedAt,
                            },
                        }),
                );
            }

            event.preventDefault();
            void mountInteractivePage().then(() => {
                void navigateToHash(destination);
            });
        });
    });

if (window.location.hash) {
    const initialDestination = window.location.hash;

    void mountInteractivePage().then(() => {
        void navigateToHash(initialDestination);
    });
}
