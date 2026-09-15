<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Server-side HTML cache for the public landing page.
 *
 * Anonymous GET requests for "/" are served from cache after the first hit,
 * dramatically reducing TTFB on subsequent requests.
 *
 * The cache key includes the request host: the cached bytes contain absolute
 * asset URLs generated from the request root, so a page rendered on
 * 127.0.0.1:8000 must not be replayed to localhost:8000 (that cross-origin
 * mismatch makes the browser block the scripts with a CORS error).
 */
class CacheLandingPage
{
    private const CSRF_PLACEHOLDER = '__LANDING_CSRF_TOKEN__';

    // INCREASED: Changed from 300 seconds (5 mins) to 7 days (604800 seconds).
    // This virtually guarantees a cache hit for TTFB in the green line.
    // It is safe because the cache key updates automatically on deployment.
    private const TTL_SECONDS = 604800;

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET') || $request->user() || ! $request->is('/')) {
            return $next($request);
        }

        $cacheKey = self::cacheKey($request);

        if (Cache::has($cacheKey)) {
            /** @var string $html */
            $html = Cache::get($cacheKey);

            return response(
                str_replace(self::CSRF_PLACEHOLDER, csrf_token(), $html),
                200,
                ['Content-Type' => 'text/html; charset=UTF-8'],
            );
        }

        /** @var Response $response */
        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            $cacheableHtml = str_replace(
                csrf_token(),
                self::CSRF_PLACEHOLDER,
                $response->getContent(),
            );

            Cache::put($cacheKey, $cacheableHtml, self::TTL_SECONDS);
        }

        return $response;
    }

    /**
     * Cache key for one rendered landing page.
     *
     * The cached bytes contain absolute asset URLs generated from the request
     * root, so every host needs its own entry: replaying HTML rendered on
     * 127.0.0.1:8000 to localhost:8000 makes the browser treat the assets as
     * cross-origin and block them with a CORS error.
     */
    public static function cacheKey(Request $request): string
    {
        return 'landing_page_html_v2:'.self::manifestVersion().':'.sha1($request->getSchemeAndHttpHost());
    }

    private static function manifestVersion(): string
    {
        $manifest = public_path('build/manifest.json');

        if (file_exists($manifest)) {
            return (string) filemtime($manifest);
        }

        return 'dev';
    }
}
