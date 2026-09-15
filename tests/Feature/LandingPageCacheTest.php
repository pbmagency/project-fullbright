<?php

namespace Tests\Feature;

use App\Http\Middleware\CacheLandingPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class LandingPageCacheTest extends TestCase
{
    public function test_cached_landing_page_uses_the_current_session_csrf_token(): void
    {
        Cache::flush();

        $firstToken = 'first-session-token';
        $this->withSession(['_token' => $firstToken])
            ->get('/')
            ->assertOk()
            ->assertSee('content="'.$firstToken.'"', false);

        $cachedHtml = Cache::get(CacheLandingPage::cacheKey(Request::create('/', 'GET')));

        $this->assertIsString($cachedHtml);
        $this->assertStringContainsString('__LANDING_CSRF_TOKEN__', $cachedHtml);
        $this->assertStringNotContainsString($firstToken, $cachedHtml);

        $secondToken = 'second-session-token';
        $this->withSession(['_token' => $secondToken])
            ->get('/')
            ->assertOk()
            ->assertSee('content="'.$secondToken.'"', false)
            ->assertDontSee('content="'.$firstToken.'"', false);
    }
}
