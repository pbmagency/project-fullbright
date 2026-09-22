<?php

namespace Tests\Feature;

use App\Models\ScalevOrder;
use App\Models\ScalevWebhookEvent;
use App\Models\UserAnalytic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScalevWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();

        config(['scalev.webhook_signing_secret' => self::SECRET, 'posthog.disabled' => true]);
    }

    /**
     * Scalev signs the exact raw body bytes with HMAC-SHA256 and sends the
     * Base64 digest in X-Scalev-Hmac-Sha256.
     */
    private function deliver(array $payload, ?string $signature = null): \Illuminate\Testing\TestResponse
    {
        $body = json_encode($payload, JSON_UNESCAPED_SLASHES);

        return $this->call(
            'POST',
            route('scalev.webhook'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
                'HTTP_X_SCALEV_HMAC_SHA256' => $signature ?? base64_encode(
                    hash_hmac('sha256', $body, self::SECRET, true),
                ),
            ],
            $body,
        );
    }

    private function paymentEvent(string $uniqueId, string $paymentStatus = 'paid'): array
    {
        return [
            'event' => 'payment.received',
            'unique_id' => $uniqueId,
            'timestamp' => '2026-09-15T10:00:00.000000Z',
            'data' => [
                'id' => 'order-uuid-1',
                'order_id' => '250915ABCDEF',
                'payment_status' => $paymentStatus,
                'payment_method' => 'va_bca',
                'gross_revenue' => '200000.00',
            ],
        ];
    }

    private function paidOrder(): ScalevOrder
    {
        return ScalevOrder::create([
            'scalev_order_id' => 'order-uuid-1',
            'scalev_order_number' => '250915ABCDEF',
            'package' => 'starter',
            'package_label' => 'Paket Starter — Live Zoom Intensif',
            'amount' => 200000,
            'customer_name' => 'Budi Santoso',
            'customer_phone' => '6281234567890',
            'customer_email' => 'budi@example.com',
            'analytics_session_id' => 'session-abc',
            'fbp' => 'fb.1.123',
            'payment_method' => 'payment_link',
            'payment_status' => 'unpaid',
        ]);
    }

    private function createdEvent(string $source = 'c11-problem'): array
    {
        return [
            'event' => 'order.created',
            'unique_id' => 'event_created_'.$source,
            'data' => [
                'id' => 'order-uuid-1',
                'order_id' => '250915ABCDEF',
                'utm_source' => $source,
                'utm_content' => 'starter',
                'payment_status' => 'unpaid',
                'payment_method' => 'payment_link',
                'gross_revenue' => '200000.00',
                'customer' => [
                    'name' => 'Budi Santoso',
                    'phone' => '6281234567890',
                    'email' => 'budi@example.com',
                ],
                'orderlines' => [['product_name' => 'Paket Starter']],
            ],
        ];
    }

    public function test_c11_order_submission_is_saved_and_payment_updates_it(): void
    {
        $this->deliver($this->createdEvent())->assertNoContent();

        $order = ScalevOrder::query()->sole();
        $this->assertSame('/c11-problem', $order->landing_source);
        $this->assertSame('starter', $order->package);
        $this->assertSame('Paket Starter', $order->package_label);
        $this->assertSame('Budi Santoso', $order->customer_name);
        $this->assertSame(200000, $order->amount);
        $this->assertSame('unpaid', $order->payment_status);
        $this->get(route('cycle11.scalev-proof'))
            ->assertOk()->assertJson(['submitted' => 1, 'paid' => 0]);

        $this->deliver($this->paymentEvent('event_paid'))->assertNoContent();
        $this->assertSame('paid', $order->refresh()->payment_status);
        $this->get(route('cycle11.scalev-proof'))
            ->assertOk()->assertJson(['submitted' => 1, 'paid' => 1]);
        $this->assertDatabaseCount('user_analytics', 1);
    }

    public function test_recent_c11_submission_can_drive_an_anonymous_popup(): void
    {
        $created = $this->createdEvent();
        $created['data']['destination_address'] = [
            'name' => 'Budi Santoso',
            'phone' => '6281234567890',
            'city' => 'Bogor',
        ];

        $this->deliver($created)->assertNoContent();
        $response = $this->get(route('cycle11.scalev-proof'))
            ->assertOk()
            ->assertJsonPath('latest_submission.city', 'Bogor');

        $this->assertFalse(str_contains($response->getContent(), 'Budi Santoso'));
        $this->assertFalse(str_contains($response->getContent(), '6281234567890'));
        $this->assertFalse(str_contains($response->getContent(), 'syarat rekrutmen'));
    }

    public function test_orders_from_other_landing_pages_are_not_shown_on_c11(): void
    {
        $this->deliver($this->createdEvent('c10-lp'))->assertNoContent();
        $this->assertDatabaseCount('scalev_orders', 0);
        $this->get(route('cycle11.scalev-proof'))
            ->assertOk()->assertJson(['submitted' => 0, 'paid' => 0]);
    }

    public function test_c12_order_and_payment_are_attributed_to_c12(): void
    {
        $this->deliver($this->createdEvent('c12-price'))->assertNoContent();

        $order = ScalevOrder::query()->sole();
        $this->assertSame('/c12-price', $order->landing_source);
        $this->get(route('cycle11.scalev-proof'))
            ->assertOk()->assertJson(['submitted' => 0, 'paid' => 0]);

        $this->deliver($this->paymentEvent('event_c12_paid'))->assertNoContent();

        $analytic = UserAnalytic::query()->sole();
        $this->assertSame('/c12-price', $analytic->event_data['landing_source']);
    }

    public function test_attributed_payment_can_arrive_before_order_created(): void
    {
        $payment = $this->paymentEvent('event_paid_first');
        $payment['data']['utm_source'] = 'c11-problem';
        $payment['data']['customer'] = ['name' => 'Budi', 'phone' => '6281234567890'];

        $this->deliver($payment)->assertNoContent();
        $this->assertSame('paid', ScalevOrder::query()->sole()->payment_status);
        $this->deliver($this->createdEvent())->assertNoContent();
        $this->assertSame('paid', ScalevOrder::query()->sole()->payment_status);
        $this->assertDatabaseCount('user_analytics', 1);
    }

    public function test_unattributed_payment_is_reconciled_when_c11_order_arrives_later(): void
    {
        $this->deliver($this->paymentEvent('event_early'))->assertNoContent();
        $this->assertDatabaseCount('scalev_orders', 0);

        $this->deliver($this->createdEvent())->assertNoContent();
        $this->assertSame('paid', ScalevOrder::query()->sole()->payment_status);
        $this->assertDatabaseCount('user_analytics', 1);
    }

    public function test_c11_attribution_in_event_source_url_is_accepted(): void
    {
        $created = $this->createdEvent('unknown');
        $created['data']['metadata']['event_source_url'] =
            'https://member.fullbrightindonesia.com/checkout?utm_source=c11-problem';

        $this->deliver($created)->assertNoContent();
        $this->assertDatabaseCount('scalev_orders', 1);
    }

    public function test_a_bad_signature_is_rejected_and_not_stored(): void
    {
        $this->deliver($this->paymentEvent('event_bad'), 'not-a-valid-signature')
            ->assertStatus(401);

        $this->assertDatabaseCount('scalev_webhook_events', 0);
        $this->assertDatabaseCount('user_analytics', 0);
    }

    public function test_a_missing_signature_is_rejected(): void
    {
        $body = json_encode($this->paymentEvent('event_none'), JSON_UNESCAPED_SLASHES);

        $this->call('POST', route('scalev.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], $body)->assertStatus(401);

        $this->assertDatabaseCount('scalev_webhook_events', 0);
    }

    public function test_a_signed_payment_marks_the_order_paid_and_records_the_conversion(): void
    {
        $order = $this->paidOrder();

        $this->deliver($this->paymentEvent('event_paid'))->assertNoContent();

        $order->refresh();

        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('va_bca', $order->payment_method);
        $this->assertNotNull($order->paid_at);

        $analytic = UserAnalytic::query()->sole();

        $this->assertSame('payment', $analytic->event_type);
        $this->assertSame('session-abc', $analytic->session_id);
        $this->assertSame('scalev', $analytic->referral_source);
        $this->assertSame('paid', $analytic->event_data['status']);
        $this->assertSame('starter', $analytic->event_data['package']);
        $this->assertSame(200000.0, (float) $analytic->event_data['amount']);
        $this->assertSame('order-uuid-1', $analytic->event_data['scalev_order_id']);
    }

    public function test_a_replayed_event_is_ignored(): void
    {
        $this->paidOrder();

        $this->deliver($this->paymentEvent('event_paid'))->assertNoContent();
        $this->deliver($this->paymentEvent('event_paid'))->assertNoContent();

        $this->assertDatabaseCount('scalev_webhook_events', 1);
        $this->assertDatabaseCount('user_analytics', 1);
    }

    public function test_paid_then_settled_only_counts_as_one_conversion(): void
    {
        $order = $this->paidOrder();

        $this->deliver($this->paymentEvent('event_paid', 'paid'))->assertNoContent();
        $this->deliver($this->paymentEvent('event_settled', 'settled'))->assertNoContent();

        // Both deliveries are stored, but the buyer bought once.
        $this->assertDatabaseCount('scalev_webhook_events', 2);
        $this->assertDatabaseCount('user_analytics', 1);
        $this->assertSame('settled', $order->refresh()->payment_status);
        $this->assertNotNull($order->paid_at);
    }

    public function test_a_failed_payment_does_not_count_as_a_conversion(): void
    {
        $order = $this->paidOrder();

        $this->deliver([
            'event' => 'payment.failed',
            'unique_id' => 'event_failed',
            'timestamp' => '2026-09-15T10:00:00.000000Z',
            'data' => [
                'id' => 'order-uuid-1',
                'order_id' => '250915ABCDEF',
                'payment_status' => 'conflict',
                'gross_revenue' => '200000.00',
            ],
        ])->assertNoContent();

        $this->assertSame('conflict', $order->refresh()->payment_status);
        $this->assertNull($order->paid_at);
        $this->assertDatabaseCount('user_analytics', 0);
    }

    public function test_an_event_for_an_unknown_order_is_acknowledged_without_side_effects(): void
    {
        $this->deliver($this->paymentEvent('event_unknown'))->assertNoContent();

        $this->assertDatabaseCount('scalev_webhook_events', 1);
        $this->assertDatabaseCount('user_analytics', 0);
    }

    public function test_an_event_without_an_id_is_rejected(): void
    {
        $this->deliver(['event' => 'payment.received'])->assertStatus(400);
    }
}
