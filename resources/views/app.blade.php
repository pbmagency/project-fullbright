<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <!-- Google tag (gtag.js) - deferred to load so it doesn't block the critical path -->
    <script>
        window.addEventListener('load', function() {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-DJG744VCZF';
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJG744VCZF');
        });
    </script>
    <!-- End Google tag (gtag.js) -->

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Persiapkan TOEFL 500+ dalam 15 hari dengan metode belajar terstruktur dari Full Bright Indonesia. Sudah membantu 45.000+ alumni meraih beasiswa & CPNS. Mulai dari Rp99rb.">

    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://connect.facebook.net">
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

    <link rel="preload" href="/logo/Primary%20Logo.webp" as="image" fetchpriority="high">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />

    <!-- Microsoft Clarity -->
    <script>
        window.addEventListener('load', function() {
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "wv3d64uo3o");
        });
    </script>

    <!-- Meta Pixel -->
    <script>
        window.addEventListener('load', function() {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ config('services.meta.pixel_id', 'YOUR_PIXEL_ID') }}');
            window.__META_PAGE_VIEW_EVENT_ID = crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now() + '-' + Math.random().toString(36).substring(2, 11);
            fbq('track', 'PageView', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });
            //THIS IS THE NEW LINE YOU NEED TO ADD
            fbq('track', 'ViewContent', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });
        });
    </script>
    <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id={{ config('services.meta.pixel_id', 'YOUR_PIXEL_ID') }}&ev=PageView&noscript=1" /></noscript>

    <!-- BEGIN PLERDY CODE -->
    <!-- Deferred to the load event (same as Clarity/Meta Pixel) so Plerdy's heavy
         monitoring scripts don't compete with the critical rendering path. -->
    <script>
    window.addEventListener('load', function() {
        (function(w,d){
            if(w.__plerdyCode)return;
            w.__plerdyCode=1;
            w._protocol=w.location.protocol=="https:"?"https://":"http://";
            w._site_hash_code="e5ad2bad413372216eb0cbf6646f35c3";
            w._suid=79951;
            var s=d.createElement("script");
            s.async=true;
            s.referrerPolicy="strict-origin-when-cross-origin";
            s.src="https://a.plerdy.com/public/js/click/main.js?v="+Math.random();
            d.head.appendChild(s);
        })(window,document);
    });
    </script>
    <!-- END PLERDY CODE -->
</body>

</html>