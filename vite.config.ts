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
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
                bunny('Nunito', {
                    weights: [400, 500, 600, 700, 800, 900],
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
            phpBinary: 'php',
            generateTypes: true,
        })] : []),
        compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
        compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // React core — always needed, long-lived cache
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'react-vendor';
                    }
                    // Lucide icons — shared across pages
                    if (id.includes('node_modules/lucide-react')) {
                        return 'icons-vendor';
                    }
                    // NOTE: recharts/d3 intentionally excluded here.
                    // It is only used on admin pages which are separate Inertia
                    // entry points — Vite will code-split it naturally so it
                    // never loads on the landing page.
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
