<?php

namespace Tests\Feature;

use App\Models\UserAnalytic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_feed_contains_aggregate_analytics_without_visitor_details(): void
    {
        UserAnalytic::create([
            'session_id' => 'private-session-id',
            'event_type' => 'visit',
            'event_data' => ['landing_source' => '/c10-lp', 'email' => 'visitor@example.test'],
            'created_at' => now(),
        ]);

        $response = $this->getJson('/ops-analytics/feed?range=7')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('schema_version', 2)
            ->assertJsonPath('project_key', 'project-fullbright')
            ->assertJsonPath('stats.total_visits', 1)
            ->assertJsonMissingPath('recent_events');

        $response->assertDontSee('private-session-id')
            ->assertDontSee('visitor@example.test');
    }
}
