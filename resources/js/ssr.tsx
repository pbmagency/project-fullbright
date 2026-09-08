import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import type { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import AppProviders from '@/components/app-providers';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title}` : appName),
        layout: (name) => {
            switch (true) {
                case name === 'welcome':
                case name === 'landing':
                case name === 'checkout':
                case name.startsWith('payment/'):
                case name.startsWith('admin/'):
                case name.startsWith('cycle10/'):
                    return null;
                case name.startsWith('auth/'):
                    return AuthLayout;
                case name.startsWith('settings/'):
                    return [AppLayout, SettingsLayout];
                default:
                    return AppLayout;
            }
        },
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

            return pages[`./pages/${name}.tsx`] as { default: ComponentType };
        },
        setup({ App, props }) {
            return (
                <AppProviders lean={page.component.startsWith('cycle10/')}>
                    <App {...props} />
                </AppProviders>
            );
        },
    }),
);
