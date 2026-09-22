// Keep the large interactive page bundle out of the critical rendering path.
// The server-rendered header and hero remain in the DOM, so loading React never
// replaces the LCP element. Interaction always wins over the idle delay.
let mountPromise: Promise<void> | null = null;

function mountInteractivePage(): Promise<void> {
    if (!mountPromise) {
        mountPromise = import('./cycle12-app').then(({ mountCycle12App }) => {
            mountCycle12App();
        });
    }

    return mountPromise;
}

const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

window.setTimeout(() => {
    if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(() => void mountInteractivePage(), { timeout: 1200 });
    } else {
        void mountInteractivePage();
    }
}, 8000);

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

window.addEventListener('pointerdown', () => void mountInteractivePage(), { once: true, passive: true });
window.addEventListener('keydown', () => void mountInteractivePage(), { once: true, passive: true });

document.querySelectorAll<HTMLAnchorElement>('#c12-critical a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const destination = anchor.getAttribute('href');

        if (!destination || destination === '#') {
            return;
        }

        const location = anchor.dataset.analyticsLocation;

        if (location) {
            const label = (anchor.getAttribute('aria-label') || anchor.textContent || 'CTA')
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
            
            // Try scrolling multiple times to catch delayed React mounts and layout shifts
            let attempts = 0;
            const tryScroll = () => {
                const el = document.querySelector(destination);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                attempts++;
                if (attempts < 5) {
                    setTimeout(tryScroll, 150);
                }
            };
            tryScroll();

            history.replaceState(null, '', destination);
        });
    });
});
