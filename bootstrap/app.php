<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\CacheLandingPage;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Services\PostHogService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Static landing pages (for example /c10-lp/) cannot receive the
        // Blade-generated CSRF token, but still need to submit analytics.
        // The endpoint only accepts a tightly validated, rate-limited payload.
        $middleware->validateCsrfTokens(except: [
            'analytics/track',
        ]);

        $middleware->web(append: [
            CacheLandingPage::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // PostHog is optional here — PostHogService no-ops when unconfigured,
        // so this is safe to leave in place even if POSTHOG_PROJECT_TOKEN is empty.
        $exceptions->report(function (Throwable $exception): void {
            $userId = auth()->id();

            app(PostHogService::class)->captureException(
                $exception,
                $userId !== null ? (string) $userId : null,
            );
        });
    })->create();
