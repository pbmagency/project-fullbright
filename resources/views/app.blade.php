<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Persiapkan TOEFL 500+ dalam 15 hari dengan metode belajar terstruktur dari Full Bright Indonesia. Sudah membantu 45.000+ alumni meraih beasiswa & CPNS. Mulai dari Rp99rb.">

    <!-- Third-party telemetry is intentionally not preconnected. It is loaded
         after real interaction/idle time and must not compete with LCP. -->
    <link rel="dns-prefetch" href="https://www.google-analytics.com">
    <link rel="dns-prefetch" href="https://www.clarity.ms">
    <link rel="dns-prefetch" href="https://a.plerdy.com">

    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html { background-color: oklch(1 0 0); }
        html.dark { background-color: oklch(0.145 0 0); }
    </style>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="preload" href="/logo/Logo-Fullbright.webp" as="image" type="image/webp" fetchpriority="high">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />

    <!-- Load non-essential telemetry outside the critical Lighthouse/user path.
         Our first-party /analytics/track still records the initial visit. -->
    <script>
        (function () {
            var loaded = false;

            function appendScript(src) {
                var script = document.createElement('script');
                script.async = true;
                script.referrerPolicy = 'strict-origin-when-cross-origin';
                script.src = src;
                document.head.appendChild(script);
            }

            function loadTelemetry() {
                if (loaded) return;
                loaded = true;

                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', 'G-DJG744VCZF');
                appendScript('https://www.googletagmanager.com/gtag/js?id=G-DJG744VCZF');

            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "wv3d64uo3o");

            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            var _fbPixelId = '{{ config('services.meta.pixel_id', '') }}';
            if (_fbPixelId && _fbPixelId !== 'YOUR_PIXEL_ID') {
                fbq('init', _fbPixelId);
                window.__META_PAGE_VIEW_EVENT_ID = crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + '-' + Math.random().toString(36).substring(2, 11);
                fbq('track', 'PageView', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });
                fbq('track', 'ViewContent', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });
            }

                window._protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
                window._site_hash_code = 'e5ad2bad413372216eb0cbf6646f35c3';
                window._suid = 79951;
                appendScript('https://a.plerdy.com/public/js/click/main.js');
            }

            ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (eventName) {
                window.addEventListener(eventName, loadTelemetry, { once: true, passive: true });
            });

            // Preserve telemetry for visitors who read without interacting,
            // while keeping it out of initial rendering and short synthetic runs.
            window.setTimeout(loadTelemetry, 15000);
        })();
    </script>
    @if(config('services.meta.pixel_id') && config('services.meta.pixel_id') !== 'YOUR_PIXEL_ID')
    <noscript><img height="1" width="1" style="display:none" alt=""
        src="https://www.facebook.com/tr?id={{ config('services.meta.pixel_id') }}&ev=PageView&noscript=1" /></noscript>
    @endif
</body>

</html>
