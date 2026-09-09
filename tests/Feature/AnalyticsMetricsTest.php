<?php

namespace Tests\Feature;

use App\Http\Controllers\AnalyticsController;
use App\Models\User;
use App\Models\UserAnalytic;
use App\Services\AbTestingService;
use App\Services\AnalyticsMetricsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AnalyticsMetricsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tracking_endpoint_keeps_browser_sessions_separate_and_updates_rates(): void
    {
        $events = [
            ['bounce', 'visit', []],
            ['scroll', 'visit', []],
            ['scroll', 'scroll', ['depth' => 25]],
            ['cta', 'visit', []],
            ['cta', 'cta_click', ['location' => 'hero', 'destination' => '#pricing']],
            ['survey', 'visit', []],
            ['survey', 'engagement', ['type' => 'survey_response', 'location' => 'difficulty_survey']],
        ];

        foreach ($events as [$analyticsSessionId, $eventType, $eventData]) {
            $this->postJson('/analytics/track', [
                'event_type' => $eventType,
                'event_data' => [
                    'analytics_session_id' => "browser-{$analyticsSessionId}",
                    'landing_source' => '/c10-lp',
                    ...$eventData,
                ],
                'referral_source' => 'direct',
            ])->assertOk();
        }

        $now = Carbon::now();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats(
            $now->copy()->subMinute(),
            $now->copy()->addMinute(),
        );
        $matrix = collect(app(AbTestingService::class)->getPerformanceMatrix(
            $now->copy()->subMinute(),
            $now->copy()->addMinute(),
        ))->firstWhere('landing_source', '/c10-lp');

        $this->assertSame(4, $stats['unique_visitors']);
        $this->assertSame(3, $stats['engaged']);
        $this->assertSame(75.0, $stats['engagement_rate']);
        $this->assertSame(1, $stats['intent']);
        $this->assertSame(25.0, $stats['intent_rate']);
        $this->assertSame(3, $matrix['engaged']);
        $this->assertSame(75.0, $matrix['engagement_rate']);
        $this->assertSame(25.0, $matrix['intent_rate']);
        $this->assertDatabaseHas('user_analytics', [
            'session_id' => 'browser-survey',
            'event_type' => 'engagement',
        ]);
    }

    public function test_engagement_uses_scroll_or_dwell_or_funnel_action(): void
    {
        $now = Carbon::now();

        foreach (['bounce', 'dwell', 'scroll', 'action', 'survey'] as $sessionId) {
            $this->event($sessionId, 'visit', '/', $now);
        }

        $this->event('dwell', 'engagement', '/', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('dwell', 'scroll', '/', $now, ['depth' => 26]);
        $this->event('scroll', 'scroll', '/', $now, ['depth' => 26]);
        $this->event('scroll', 'engagement', '/', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('action', 'cta_click', '/', $now, ['location' => 'hero']);
        $this->event('survey', 'engagement', '/', $now, [
            'type' => 'survey_response',
            'location' => 'difficulty_survey',
        ]);

        $metrics = app(AnalyticsMetricsService::class);
        $stats = $metrics->dashboardStats($now->copy()->subHour(), $now->copy()->addHour());
        $matrix = collect(app(AbTestingService::class)->getPerformanceMatrix(
            $now->copy()->subHour(),
            $now->copy()->addHour(),
        ))->firstWhere('landing_source', '/');

        $this->assertSame(1, $metrics->bouncedSessions($now->copy()->subHour(), $now->copy()->addHour()));
        $this->assertSame(4, $stats['engaged']);
        $this->assertSame(80.0, $stats['engagement_rate']);
        $this->assertSame(4, $matrix['engaged']);
        $this->assertSame(80.0, $matrix['engagement_rate']);

        $engagedQuery = DB::table('user_analytics')
            ->whereBetween('created_at', [
                $now->copy()->subHour(),
                $now->copy()->addHour(),
            ]);
        $metrics->applyEngagedEventConditions($engagedQuery);

        $this->assertSame(4, $engagedQuery->distinct()->count('session_id'));

        $chartMethod = new \ReflectionMethod(
            AnalyticsController::class,
            'getChartData',
        );
        $chartData = $chartMethod->invoke(
            app(AnalyticsController::class),
            $now->copy()->subHour(),
            $now->copy()->addHour(),
        );

        $this->assertSame(
            4,
            (int) $chartData->get('engagement')->first()->total,
        );
    }

    public function test_bounce_formula_matches_performance_matrix_and_behavioral_personas(): void
    {
        $now = Carbon::now();
        $sessions = [
            'none',
            'dwell-only',
            'scroll-only',
            'boundary',
            'reading',
            'intent',
            'checkout',
            'lead',
            'payment',
            'other-conversion',
        ];

        foreach ($sessions as $sessionId) {
            $this->event($sessionId, 'visit', '/formula', $now);
        }

        $this->event('dwell-only', 'engagement', '/formula', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('scroll-only', 'scroll', '/formula', $now, ['depth' => 26]);
        $this->event('boundary', 'scroll', '/formula', $now, ['depth' => 25]);
        $this->event('boundary', 'engagement', '/formula', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('reading', 'scroll', '/formula', $now, ['depth' => 26]);
        $this->event('reading', 'engagement', '/formula', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('intent', 'cta_click', '/formula', $now);
        $this->event('checkout', 'initiate_checkout', '/formula', $now);
        $this->event('lead', 'conversion', '/formula', $now, ['type' => 'wa_inquiry']);
        $this->event('payment', 'payment', '/formula', $now);
        $this->event('other-conversion', 'conversion', '/formula', $now, ['type' => 'newsletter_signup']);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $metrics = app(AnalyticsMetricsService::class);
        $service = app(AbTestingService::class);
        $matrix = collect($service->getPerformanceMatrix($start, $end))
            ->firstWhere('landing_source', '/formula');
        $reader = collect($service->getReaderSegmentation($start, $end))
            ->firstWhere('landing_source', '/formula');
        $bouncer = collect($reader['personas'])->firstWhere('name', 'Bouncers');

        $engagedQuery = DB::table('user_analytics')
            ->whereBetween('created_at', [$start, $end]);
        $metrics->applyEngagedEventConditions($engagedQuery, $start, $end);

        $this->assertSame(2, $metrics->bouncedSessions($start, $end));
        $this->assertSame(8, $engagedQuery->distinct()->count('session_id'));
        $this->assertSame(20.0, $matrix['bounce_rate']);
        $this->assertSame(10, $reader['total_sessions']);
        $this->assertSame(2, $bouncer['count']);
        $this->assertSame(20.0, $bouncer['percentage']);
    }

    public function test_checkout_lead_and_untracked_payment_are_not_conflated(): void
    {
        $now = Carbon::now();

        foreach (['checkout', 'lead'] as $sessionId) {
            $this->event($sessionId, 'visit', '/c6-angle', $now);
            $this->event($sessionId, 'cta_click', '/c6-angle', $now);
        }

        $this->event('checkout', 'initiate_checkout', '/c6-angle', $now);
        $this->event('checkout', 'conversion', '/c6-angle', $now, ['type' => 'checkout_redirect']);
        $this->event('lead', 'conversion', '/c6-angle', $now, ['type' => 'wa_inquiry']);
        $this->event('lead', 'payment', '/c6-angle', $now, [
            'status' => 'success',
            'amount' => 250000,
        ]);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats($start, $end);
        $metrics = app(AnalyticsMetricsService::class);
        $matrix = app(AbTestingService::class)->getPerformanceMatrix($start, $end);
        $funnel = collect($metrics->dashboardFunnel($start, $end))->keyBy('stage');
        $splitFunnel = app(AbTestingService::class)->getSplitFunnel($start, $end);

        $this->assertSame(1, $stats['direct_checkouts']);
        $this->assertSame(1, $stats['whatsapp_leads']);
        $this->assertSame(2, $stats['total_leads']);
        $this->assertSame(100.0, $stats['total_leads_from_intent_rate']);
        $this->assertSame(1, $matrix[0]['direct_checkouts']);
        $this->assertSame(1, $matrix[0]['whatsapp_leads']);
        $this->assertSame(2, $matrix[0]['total_leads']);
        $this->assertSame(0.0, $matrix[0]['bounce_rate']);
        $this->assertSame(2, $matrix[0]['engaged']);
        $this->assertSame(100.0, $matrix[0]['engagement_rate']);
        $this->assertSame('Intent', $funnel['Direct Checkout']['from_stage']);
        $this->assertSame('checkout', $funnel['Direct Checkout']['branch']);
        $this->assertSame('Intent', $funnel['WhatsApp Leads']['from_stage']);
        $this->assertSame('lead', $funnel['WhatsApp Leads']['branch']);
        $this->assertSame(50.0, $funnel['WhatsApp Leads']['transition_percentage']);
        $this->assertSame('total', $funnel['Total Leads']['branch']);
        $this->assertSame(100.0, $funnel['Total Leads']['transition_percentage']);
        $this->assertSame(
            ['Visits', 'Engaged', 'Intent', 'Direct Checkout', 'WhatsApp Leads', 'Total Leads'],
            collect($splitFunnel[0]['steps'])->pluck('stage')->all(),
        );
        $this->assertSame(
            2,
            collect($splitFunnel[0]['steps'])->firstWhere('stage', 'Engaged')['count'],
        );
    }

    public function test_whatsapp_inquiries_and_registrations_roll_up_to_unique_leads(): void
    {
        $now = Carbon::now();

        foreach (['inquiry', 'registration', 'both', 'other'] as $sessionId) {
            $this->event($sessionId, 'visit', '/', $now);
        }

        $this->event('inquiry', 'conversion', '/', $now, ['type' => 'wa_inquiry']);
        $this->event('registration', 'conversion', '/', $now, ['type' => 'wa_registration']);
        $this->event('both', 'conversion', '/', $now, ['type' => 'wa_inquiry']);
        $this->event('both', 'conversion', '/', $now, ['type' => 'wa_registration']);
        $this->event('other', 'conversion', '/', $now, ['type' => 'checkout_redirect']);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats($start, $end);
        $matrix = app(AbTestingService::class)->getPerformanceMatrix($start, $end);

        $chartMethod = new \ReflectionMethod(
            AnalyticsController::class,
            'getChartData',
        );
        $chartData = $chartMethod->invoke(
            app(AnalyticsController::class),
            $start,
            $end,
        );

        $this->assertSame(3, $stats['whatsapp_leads']);
        $this->assertSame(75.0, $stats['whatsapp_lead_rate']);
        $this->assertSame(4, $stats['total_leads']);
        $this->assertSame(3, $matrix[0]['whatsapp_leads']);
        $this->assertSame(4, $matrix[0]['total_leads']);
        $this->assertSame(3, (int) $chartData->get('whatsapp_lead')->first()->total);
        $this->assertSame(4, (int) $chartData->get('total_lead')->first()->total);
    }

    public function test_deleting_a_user_keeps_their_anonymous_analytics_history(): void
    {
        $user = User::factory()->create();

        UserAnalytic::create([
            'session_id' => 'retained-session',
            'event_type' => 'visit',
            'event_data' => ['landing_source' => '/'],
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        $user->delete();

        $this->assertDatabaseHas('user_analytics', [
            'session_id' => 'retained-session',
            'user_id' => null,
        ]);
    }

    public function test_total_leads_add_direct_checkout_and_whatsapp_across_all_labs_analysis(): void
    {
        $now = Carbon::now();

        foreach (['direct', 'whatsapp', 'both'] as $sessionId) {
            $this->event($sessionId, 'visit', '/template', $now);
            $this->event($sessionId, 'cta_click', '/template', $now, [
                'location' => $sessionId,
            ]);
        }

        $this->event('direct', 'initiate_checkout', '/template', $now);
        $this->event('whatsapp', 'conversion', '/template', $now, ['type' => 'wa_inquiry']);
        $this->event('both', 'initiate_checkout', '/template', $now);
        $this->event('both', 'conversion', '/template', $now, ['type' => 'wa_registration']);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats($start, $end);
        $service = app(AbTestingService::class);
        $matrix = $service->getPerformanceMatrix($start, $end);
        $quality = $service->getQualityAnalysis($start, $end);
        $devices = $service->getDevicePerformance($start, $end);
        $cta = $service->getCtaPerformance($start, $end);
        $chartMethod = new \ReflectionMethod(AnalyticsController::class, 'getChartData');
        $chartData = $chartMethod->invoke(app(AnalyticsController::class), $start, $end);

        $this->assertSame(2, $stats['direct_checkouts']);
        $this->assertSame(2, $stats['whatsapp_leads']);
        $this->assertSame(4, $stats['total_leads']);
        $this->assertSame(4, (int) $chartData->get('total_lead')->first()->total);
        $this->assertSame(133.33, $stats['total_leads_from_intent_rate']);
        $this->assertSame(4, $matrix[0]['total_leads']);
        $this->assertSame(133.33, $matrix[0]['total_lead_rate']);
        $this->assertSame(4, $quality[0]['total_leads']['count']);
        $this->assertSame(0, $quality[0]['others']['count']);
        $this->assertSame(4, $devices[0]['desktop']['total_leads']);
        $this->assertSame(133.33, $devices[0]['desktop']['total_lead_rate']);
        $ctaRates = collect($cta[0]['cta_locations'])->pluck('total_lead_rate', 'location');
        $this->assertSame(100.0, $ctaRates['direct']);
        $this->assertSame(100.0, $ctaRates['whatsapp']);
        $this->assertSame(200.0, $ctaRates['both']);
    }

    public function test_legacy_checkout_redirects_roll_up_without_becoming_leads_or_double_counting(): void
    {
        $now = Carbon::now();

        foreach (['legacy', 'current', 'dual-written'] as $sessionId) {
            $this->event($sessionId, 'visit', '/c6-angle', $now);
        }

        $this->event('legacy', 'conversion', '/c6-angle', $now, ['type' => 'checkout_redirect']);
        $this->event('current', 'initiate_checkout', '/c6-angle', $now);
        $this->event('dual-written', 'conversion', '/c6-angle', $now, ['type' => 'checkout_redirect']);
        $this->event('dual-written', 'initiate_checkout', '/c6-angle', $now);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $metrics = app(AnalyticsMetricsService::class);
        $stats = $metrics->dashboardStats($start, $end);
        $matrix = app(AbTestingService::class)->getPerformanceMatrix($start, $end);
        $splitFunnel = app(AbTestingService::class)->getSplitFunnel($start, $end);

        $chartMethod = new \ReflectionMethod(
            AnalyticsController::class,
            'getChartData',
        );
        $chartData = $chartMethod->invoke(
            app(AnalyticsController::class),
            $start,
            $end,
        );

        $this->assertSame(3, $stats['direct_checkouts']);
        $this->assertSame(0, $stats['whatsapp_leads']);
        $this->assertSame(3, $stats['total_leads']);
        $this->assertSame(3, $matrix[0]['direct_checkouts']);
        $this->assertSame(0, $matrix[0]['whatsapp_leads']);
        $this->assertSame(3, $matrix[0]['total_leads']);
        $this->assertSame(
            3,
            collect($splitFunnel[0]['steps'])->firstWhere('stage', 'Direct Checkout')['count'],
        );
        $this->assertSame(3, (int) $chartData->get('direct_checkout')->first()->total);
        $this->assertSame(3, (int) $chartData->get('total_lead')->first()->total);
    }

    public function test_section_heatmap_uses_pbm_visibility_order(): void
    {
        $now = Carbon::now();

        $this->event('reader-one', 'visit', '/', $now);
        $this->event('reader-two', 'visit', '/', $now);
        $this->event('reader-one', 'section_view', '/', $now->copy()->subMinute(), [
            'section' => 'harga',
        ]);
        $this->event('reader-one', 'section_view', '/', $now, ['section' => 'hero']);
        $this->event('reader-two', 'section_view', '/', $now, ['section' => 'hero']);

        $heatmap = app(AbTestingService::class)->getSectionHeatmap(
            $now->copy()->subHour(),
            $now->copy()->addHour(),
        );
        $sections = collect($heatmap[0]['sections'])->keyBy('id');

        $this->assertSame(['hero', 'harga'], collect($heatmap[0]['sections'])->pluck('id')->all());
        $this->assertSame(100.0, $sections['hero']['pct']);
        $this->assertSame(50.0, $sections['harga']['pct']);
        $this->assertSame(50.0, $sections['harga']['drop_from_prev']);
    }

    public function test_mysql_json_escaped_landing_sources_are_normalized(): void
    {
        $service = app(AbTestingService::class);
        $method = new \ReflectionMethod($service, 'normalizeLandingSource');

        $this->assertSame('/', $method->invoke($service, '"\/"'));
        $this->assertSame('/c6-angle-2', $method->invoke($service, '"\/c6-angle-2"'));
        $this->assertSame('/c6-angle-2', $method->invoke($service, '\/c6-angle-2'));
    }

    private function event(
        string $sessionId,
        string $eventType,
        string $landingSource,
        Carbon $createdAt,
        array $eventData = [],
    ): void {
        UserAnalytic::create([
            'session_id' => $sessionId,
            'event_type' => $eventType,
            'event_data' => ['landing_source' => $landingSource, ...$eventData],
            'referral_source' => 'direct',
            'created_at' => $createdAt,
        ]);
    }
}
