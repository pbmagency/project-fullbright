/**
 * C10 Landing Page — React mount stub (lazy-loaded dari c10-app.tsx).
 *
 * Menggunakan createInertiaApp minimal (tanpa layout, tanpa PostHog)
 * untuk menyediakan Inertia context yang dibutuhkan oleh Head component.
 */
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import LandingPage from '@/pages/cycle10/LandingPage';

// Jadikan file ini modul ES yang benar (menghindari konflik scope TypeScript)
export {};

export function mountC10App(): void {
    const root = document.getElementById('app');
    if (!root) return;

    // Sembunyikan skeleton server-rendered — React akan render konten interaktif
    const criticalEl = document.getElementById('c10-critical');
    if (criticalEl) criticalEl.style.display = 'none';

    void createInertiaApp({
        // C10 LP tidak butuh shared layout (no sidebar/navbar dari app)
        resolve: () => ({ default: LandingPage }),
        setup({ el, App, props }) {
            createRoot(el).render(<App {...props} />);
        },
        progress: false,
    });
}
