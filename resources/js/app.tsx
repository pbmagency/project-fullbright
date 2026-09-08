import { createInertiaApp } from '@inertiajs/react';
import { lazy } from 'react';
import AppProviders from '@/components/app-providers';
import { initializeTheme } from '@/hooks/use-appearance';
// PostHog is optional: no-ops with a console warning if VITE_POSTHOG_KEY/HOST are unset.
import '@/lib/posthog-tracking';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const AppLayout = lazy(() => import('@/layouts/app-layout'));
const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));

function isLeanInitialPage(): boolean {
    const pageData = document.getElementById('app')?.dataset.page;

    if (!pageData) {
        return false;
    }

    try {
        const component = (JSON.parse(pageData) as { component?: string }).component;

        return component?.startsWith('cycle10/') ?? false;
    } catch {
        return false;
    }
}

const leanInitialPage = isLeanInitialPage();

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return <AppProviders lean={leanInitialPage}>{app}</AppProviders>;
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
