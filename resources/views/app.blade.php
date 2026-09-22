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
    @if(in_array($page['component'], ['cycle10/LandingPage', 'cycle11/LandingPage'], true))
        {{-- Preload harus memakai kandidat srcset yang sama dengan <img>, kalau
             tidak browser mengunduh dua kali (satu dari preload, satu dari img). --}}
        <link rel="preload" href="/assets/hero-consultant.webp" as="image" type="image/webp" fetchpriority="high"
              imagesrcset="/assets/hero-consultant-460-alpha.webp 460w, /assets/hero-consultant-660-alpha.webp 660w, /assets/hero-consultant.webp 820w"
              imagesizes="(max-width: 899px) 250px, 560px">
    @elseif($page['component'] === 'cycle12/LandingPage')
        <link rel="preload" href="/assets-c12/hero-consultant.webp" as="image" type="image/webp" fetchpriority="high">
        <style>
            #c12-critical { min-height: 100vh; background: #fff; color: #151515; font-family: Nunito, Arial, sans-serif; }
            #c12-critical * { box-sizing: border-box; }
            .c12-banner { position: fixed; inset: 0 0 auto; z-index: 51; height: 38px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 7px 12px; overflow: hidden; background: #c10707; color: #fff; font-size: 13px; font-weight: 800; text-decoration: none; white-space: nowrap; }
            .c12-banner-time { padding: 3px 10px; border-radius: 999px; background: #fff; color: #c10707; font-size: 13px; font-weight: 900; font-variant-numeric: tabular-nums; }
            .c12-nav-space { height: 102px; }
            .c12-nav { position: fixed; inset: 38px 0 auto; z-index: 50; height: 64px; border-bottom: 1px solid #f3f4f6; background: rgba(255,255,255,.96); }
            .c12-nav-inner { max-width: 1152px; height: 64px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; }
            .c12-logo { display: block; width: auto; height: 150px; margin: -43px 0; object-fit: contain; }
            .c12-nav-cta { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 7px 16px; border-radius: 999px; background: #d70808; box-shadow: 0 6px 16px rgba(215,8,8,.35); color: #fff; font-size: 13px; font-weight: 800; line-height: 1.2; text-decoration: none; }
            .c12-nav-price { font-size: 14px; font-weight: 900; }
            .c12-hero { position: relative; overflow: hidden; background: linear-gradient(160deg,#fff 55%,#fff5f5 100%); }
            .c12-hero-inner { position: relative; max-width: 1152px; margin: 0 auto; padding: 40px 24px 20px; display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: 40px; }
            .c12-hero-copy { display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 1; }
            .c12-rating-badge { width: fit-content; display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1.5px solid #151515; border-radius: 999px; color: #374151; font-size: 12px; font-weight: 700; letter-spacing: .05em; }
            .c12-stars { color: #f59e0b; }
            .c12-hero h1 { max-width: 680px; margin: 0; color: #151515; font-size: clamp(30px,4vw,44px); font-weight: 900; line-height: 1.15; }
            .c12-highlight { padding: 0 2px; background: linear-gradient(#f5b700,#f5b700) 0 100% / 100% 12px no-repeat; }
            .c12-hero-copy > p { margin: 0; color: #3d3d3d; font-size: 16px; line-height: 1.6; }
            .c12-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
            .c12-button { display: inline-flex; min-height: 50px; align-items: center; justify-content: center; padding: 14px 28px; border-radius: 16px; font-size: 16px; font-weight: 700; text-decoration: none; }
            .c12-button-primary { background: #d70808; box-shadow: 0 4px 20px rgba(215,8,8,.35); color: #fff; }
            .c12-button-secondary { border: 2px solid #d70808; color: #151515; }
            .c12-trust { display: flex; flex-wrap: wrap; gap: 8px 12px; color: #6b7280; font-size: 12px; font-weight: 600; }
            .c12-hero-media { display: flex; align-self: stretch; align-items: flex-end; justify-content: center; }
            .c12-hero-image { display: block; width: 100%; max-width: 560px; height: auto; max-height: min(72vh,660px); object-fit: contain; object-position: bottom center; filter: drop-shadow(0 18px 40px rgba(0,0,0,.16)); }
            .c12-wave { height: 36px; background: #f3f3f3; clip-path: polygon(0 78%,17% 100%,34% 62%,50% 82%,67% 100%,84% 62%,100% 82%,100% 100%,0 100%); }
            @media (max-width: 899px) {
                .c12-hero-inner { grid-template-columns: 1fr; gap: 12px; padding: 24px 24px 8px; }
                .c12-hero-media { align-self: initial; }
                .c12-hero-image { width: 250px; height: 215px; max-height: 215px; filter: drop-shadow(0 12px 28px rgba(0,0,0,.14)); }
            }
            @media (max-width: 500px) {
                .c12-banner-label { font-size: 12px; }
                .c12-nav-inner { padding: 0 16px; }
                .c12-nav-cta { padding: 7px 13px; }
                .c12-hero h1 { font-size: clamp(24px,7vw,30px); }
                .c12-hero-copy > p { font-size: 14px; }
                .c12-hero-actions { flex-direction: column; }
                .c12-button { width: 100%; font-size: 14px; }
            }
        </style>
    @endif

    @viteReactRefresh
    @if($page['component'] === 'cycle10/LandingPage')
        @vite(['resources/css/cycle10.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @elseif($page['component'] === 'cycle12/LandingPage')
        @vite(['resources/css/cycle12.css', 'resources/js/landing-app.tsx'])
    @else
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @endif
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    @if($page['component'] === 'cycle12/LandingPage')
        {{-- Permanent server-rendered critical content. React mounts below it. --}}
        <div id="c12-critical">
            <a class="c12-banner" href="#pricing" data-analytics-location="banner_pricing">
                <span class="c12-banner-label">🔥 FLASH SALE SEPTEMBER · DISKON 60%</span>
                <span class="c12-banner-time" data-c12-countdown>12:00:00</span>
            </a>
            <div class="c12-nav-space"></div>
            <header class="c12-nav">
                <div class="c12-nav-inner">
                    <a href="#" aria-label="Full Bright Indonesia"><img class="c12-logo" src="/logo/Logo-Fullbright.webp" width="400" height="400" alt="Full Bright Indonesia"></a>
                    <a class="c12-nav-cta" href="#pricing" data-analytics-location="navbar_pricing"><span>🎓 Amankan Seat</span><span class="c12-nav-price">Rp99rb</span></a>
                </div>
            </header>
            <section class="c12-hero">
                <div class="c12-hero-inner">
                    <div class="c12-hero-copy">
                        <div class="c12-rating-badge"><span class="c12-stars">★★★★★</span><span>45.000+ ALUMNI</span></div>
                        <h1>Serius Soal Beasiswa &amp; CPNS?<br>Capai <span class="c12-highlight">TOEFL 500+ dalam 15 Hari Saja</span></h1>
                        <p><strong>Persiapkan dari sekarang</strong> dengan strategi <strong>belajar 1 jam sehari</strong> yang telah membantu <strong>45.000+ alumni</strong> meraih <strong>beasiswa impian</strong> mereka.</p>
                        <div class="c12-hero-actions">
                            <a class="c12-button c12-button-primary" href="#pricing" data-analytics-location="hero_pricing">Mulai Persiapan TOEFL →</a>
                            <a class="c12-button c12-button-secondary" href="#testimonials" data-analytics-location="hero_testimonials">Lihat Bukti Alumni →</a>
                        </div>
                        <div class="c12-trust"><span>★★★★★ 4.9/5 Google Review</span><span>• 45.000+ Alumni Sukses</span><span>• 🛡 Garansi 100%</span></div>
                    </div>
                    <div class="c12-hero-media"><img class="c12-hero-image" src="/assets-c12/hero-consultant.webp" width="660" height="805" fetchpriority="high" alt="Konsultan Full Bright Indonesia siap membantu persiapan TOEFL kamu"></div>
                </div>
                <div class="c12-wave"></div>
            </section>
        </div>
        <div id="app"></div>
        <script>
            (function () {
                var duration = 12 * 60 * 60 * 1000;
                var start = Number(localStorage.getItem('fb_flash_start') || 0);
                if (!start) {
                    start = Date.now();
                    try { localStorage.setItem('fb_flash_start', String(start)); } catch (error) {}
                }
                var output = document.querySelector('[data-c12-countdown]');
                function updateCountdown() {
                    var seconds = Math.max(0, Math.floor((start + duration - Date.now()) / 1000));
                    var hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
                    var minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                    var remaining = String(seconds % 60).padStart(2, '0');
                    if (output) output.textContent = hours + ':' + minutes + ':' + remaining;
                }
                updateCountdown();
                window.setInterval(updateCountdown, 1000);
            })();
        </script>
    @else
        <x-inertia::app />
    @endif

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
