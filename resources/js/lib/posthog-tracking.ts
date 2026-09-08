// Ported from the PBM Agency LP template's posthog-tracking.ts, adapted for
// the CTWA (Click-to-WhatsApp) leads funnel: this variant has no on-page form,
// so there is no "add_to_cart" event here — only 'engaged' and 'intent'.
// The 'lead' event (WhatsApp click) is captured server-side only, via the
// 'conversion' event_type in AnalyticsController@track, so it can't be
// spoofed or double-fired from the client.
//
// The posthog-js SDK is large (~150 KB gzipped), so it is dynamically imported
// only when VITE_POSTHOG_KEY/VITE_POSTHOG_HOST are configured. This keeps the
// SDK off the critical rendering path for pages that don't need tracking.
const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

async function initPosthogTracking(): Promise<void> {
    if (!apiKey || !apiHost) {
        return;
    }

    const { default: posthog } = await import('@/lib/posthog');

    const CLIENT_ID = import.meta.env.VITE_POSTHOG_CLIENT_ID;
    const CLIENT_TYPE = import.meta.env.VITE_POSTHOG_CLIENT_TYPE || 'ctwa_leads';

    posthog.register({ client_id: CLIENT_ID, client_type: CLIENT_TYPE });

    // ==== 1. ENGAGED ====
    // Trigger: 15 detik di halaman ATAU scroll > 25%. Cuma fire sekali per kunjungan.
    let engagedFired = false;
    function fireEngaged() {
        if (engagedFired) {
            return;
        }

        engagedFired = true;
        posthog.capture('engaged');
    }
    setTimeout(fireEngaged, 15000);

    window.addEventListener(
        'scroll',
        () => {
            const scrolled =
                (window.scrollY /
                    (document.body.scrollHeight - window.innerHeight)) *
                100;

            if (scrolled > 25) {
                fireEngaged();
            }
        },
        { passive: true },
    );

    // ==== 2. INTENT dari klik CTA ====
    // Tiap tombol CTA yang mau ditrack dikasih data-cta-zone="hero" / "pricing" / dst.
    // (Di project ini, `LpButton` sudah punya prop opsional `ctaZone` yang otomatis
    // mengisi atribut ini — lihat resources/js/components/ui/lp-button.tsx.)
    document.addEventListener('click', (e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>(
            '[data-cta-zone]',
        );

        if (!el) {
            return;
        }

        posthog.capture('intent', {
            cta_zone: el.getAttribute('data-cta-zone'),
            cta_label: el.innerText ? el.innerText.trim().slice(0, 50) : undefined,
        });
    });
}

function schedulePosthogTracking(): void {
    let scheduled = false;

    const start = (): void => {
        if (scheduled) {
            return;
        }

        scheduled = true;
        void initPosthogTracking();
    };

    for (const eventName of ['pointerdown', 'touchstart', 'keydown', 'scroll']) {
        window.addEventListener(eventName, start, {
            once: true,
            passive: true,
        });
    }

    window.setTimeout(start, 15000);
}

if (apiKey && apiHost) {
    schedulePosthogTracking();
}
