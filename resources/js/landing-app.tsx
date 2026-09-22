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

if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(() => void mountInteractivePage(), { timeout: 1200 });
} else {
    window.setTimeout(() => void mountInteractivePage(), 250);
}

window.addEventListener('pointerdown', () => void mountInteractivePage(), { once: true, passive: true });
window.addEventListener('keydown', () => void mountInteractivePage(), { once: true, passive: true });

document.querySelectorAll<HTMLAnchorElement>('#c12-critical a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const destination = anchor.getAttribute('href');
        if (!destination || destination === '#') {
            return;
        }

        event.preventDefault();
        void mountInteractivePage().then(() => {
            document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', destination);
        });
    });
});
