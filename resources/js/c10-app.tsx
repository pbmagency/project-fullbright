/**
 * C10 Landing Page — Deferred entry point.
 *
 * Strategi sama dengan landing-app.tsx (C12):
 *   1. Server merender skeleton HTML (banner + navbar + hero placeholder) SEBELUM JS dimuat.
 *   2. Entry point ini ringan — hanya routing hash + lazy mount React.
 *   3. React baru di-mount saat: idle callback, pointerdown, keydown, atau scroll ke #app.
 *
 * Ini menghilangkan "unused JS 78%" yang menyebabkan main-thread work di mobile.
 */
export {};

let mountPromise: Promise<void> | null = null;
let activeHashNavigation: AbortController | null = null;

const HASH_TARGET_WAIT_MS = 3000;
const SMOOTH_SCROLL_SETTLE_MS = 800;
const LAYOUT_SHIFT_GUARD_MS = 4000;

function hashTarget(destination: string): HTMLElement | null {
    if (!destination.startsWith('#')) return null;
    try {
        return document.getElementById(decodeURIComponent(destination.slice(1)));
    } catch {
        return null;
    }
}

function scrollMarginTop(element: HTMLElement): number {
    const margin = Number.parseFloat(window.getComputedStyle(element).scrollMarginTop);
    return Number.isFinite(margin) ? margin : 0;
}

function waitForHashTarget(destination: string, signal: AbortSignal): Promise<HTMLElement | null> {
    const startedAt = performance.now();
    return new Promise((resolve) => {
        const findTarget = (): void => {
            if (signal.aborted) { resolve(null); return; }
            const target = hashTarget(destination);
            if (target) { resolve(target); return; }
            if (performance.now() - startedAt >= HASH_TARGET_WAIT_MS) { resolve(null); return; }
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
    if (!target || signal.aborted) return;

    history.replaceState(null, '', destination);

    const cancel = (): void => navigation.abort();
    const cancelKey = (event: KeyboardEvent): void => {
        if (['ArrowDown','ArrowUp','End','Home','PageDown','PageUp',' '].includes(event.key)) cancel();
    };
    const opts = { passive: true, signal };
    window.addEventListener('wheel', cancel, opts);
    window.addEventListener('touchstart', cancel, opts);
    window.addEventListener('pointerdown', cancel, opts);
    window.addEventListener('keydown', cancelKey, { signal });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });

    window.setTimeout(() => {
        if (signal.aborted) return;
        const guardStartedAt = performance.now();
        const correct = (): void => {
            if (signal.aborted) return;
            const cur = hashTarget(destination);
            if (!cur || performance.now() - guardStartedAt >= LAYOUT_SHIFT_GUARD_MS) {
                navigation.abort(); return;
            }
            const offset = cur.getBoundingClientRect().top - scrollMarginTop(cur);
            if (Math.abs(offset) > 1) window.scrollBy({ top: offset, behavior: 'auto' });
            window.requestAnimationFrame(correct);
        };
        correct();
    }, prefersReduced ? 0 : SMOOTH_SCROLL_SETTLE_MS);
}

function mountInteractivePage(): Promise<void> {
    if (!mountPromise) {
        mountPromise = import('./c10-landing-app').then(({ mountC10App }) => mountC10App());
    }
    return mountPromise;
}

const idleWindow = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

// Mount setelah 6 detik idle — lebih cepat dari C12 (8s) karena C10 pakai Inertia
window.setTimeout(() => {
    if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(() => void mountInteractivePage(), { timeout: 1200 });
    } else {
        void mountInteractivePage();
    }
}, 6000);

// Mount saat section pertama visible (lebih cepat dari timer)
const interactiveRoot = document.getElementById('app');
if (interactiveRoot && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            void mountInteractivePage();
        }
    });
    observer.observe(interactiveRoot);
}

// Mount saat user mulai interaksi
window.addEventListener('pointerdown', () => void mountInteractivePage(), { once: true, passive: true });
window.addEventListener('keydown', () => void mountInteractivePage(), { once: true, passive: true });
window.addEventListener('touchstart', () => void mountInteractivePage(), { once: true, passive: true });

// Hash link navigation dari skeleton C10
document.querySelectorAll<HTMLAnchorElement>('#c10-critical a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const destination = anchor.getAttribute('href');
        if (!destination || destination === '#') return;

        const location = anchor.dataset.analyticsLocation;
        if (location) {
            const label = (anchor.getAttribute('aria-label') || anchor.textContent || 'CTA')
                .replace(/\s+/g, ' ').trim().slice(0, 255);
            const clickedAt = new Date().toISOString();
            void import('./hooks/use-analytics').then(({ generateEventId, trackAnalyticsEvent }) =>
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
        void mountInteractivePage().then(() => { void navigateToHash(destination); });
    });
});

// Handle URL hash on initial load
if (window.location.hash) {
    const initialDestination = window.location.hash;
    void mountInteractivePage().then(() => { void navigateToHash(initialDestination); });
}
