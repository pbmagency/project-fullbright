import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        ...(process.env.CI !== 'true' ? [wayfinder({
            formVariants: true,
            phpBinary: 'C:\\Users\\User\\.config\\herd\\bin\\php84\\php.exe',
            generateTypes: true,
        })] : []),
        // Pre-compress assets for OpenLiteSpeed to serve directly
        compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
        compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // React core — most critical, separate chunk
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'react-vendor';
                    }
                    // Inertia — needed early for hydration
                    if (id.includes('node_modules/@inertiajs/')) {
                        return 'inertia-vendor';
                    }
                    // Radix UI components — large UI primitives
                    if (id.includes('node_modules/@radix-ui/')) {
                        return 'radix-vendor';
                    }
                    // Recharts — heavy charting library, only used in admin/dashboard
                    if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
                        return 'charts-vendor';
                    }
                    // Lucide icons — medium sized, shared across app
                    if (id.includes('node_modules/lucide-react')) {
                        return 'icons-vendor';
                    }
                },
            },
        },
        // Raise chunk size warning threshold (default 500kB is too conservative)
        chunkSizeWarningLimit: 1000,
    },
});



