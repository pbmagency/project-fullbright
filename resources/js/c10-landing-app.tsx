/**
 * C10 Landing Page — React mount stub (lazy-loaded dari c10-app.tsx).
 *
 * Menggunakan createInertiaApp minimal (tanpa layout, tanpa PostHog)
 * untuk menyediakan Inertia context yang dibutuhkan oleh Head component.
 */
import { createInertiaApp } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';
import { createRoot } from 'react-dom/client';
import LandingPage from '@/pages/cycle10/LandingPage';

// Jadikan file ini modul ES yang benar (menghindari konflik scope TypeScript)
export {};

function initialC10Page(root: HTMLElement): Page {
    const json = document.querySelector<HTMLScriptElement>('script[data-page="app"][type="application/json"]')?.textContent
        ?? root.dataset.page;

    if (json) {
        try {
            const page = JSON.parse(json) as Page;
            if (page?.component === 'cycle10/LandingPage') return page;
        } catch {
            // Older cached HTML may carry malformed page data.
        }
    }

    return {
        component: 'cycle10/LandingPage',
        props: { errors: {} },
        url: window.location.pathname + window.location.search + window.location.hash,
        version: null,
        rescuedProps: [],
        flash: {},
        rememberedState: {},
    };
}

export async function mountC10App(): Promise<void> {
    const root = document.getElementById('app');
    if (!root) return;

    // Sembunyikan skeleton server-rendered — React akan render konten interaktif
    await createInertiaApp({
        page: initialC10Page(root),
        // C10 LP tidak butuh shared layout (no sidebar/navbar dari app)
        resolve: () => ({ default: LandingPage }),
        setup({ el, App, props }) {
            createRoot(el).render(<App {...props} />);
        },
        progress: false,
    });
}
