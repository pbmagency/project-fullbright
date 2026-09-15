<?php

namespace App\Http\Controllers;

use App\Models\ScalevOrder;
use App\Models\ScalevWebhookEvent;
use App\Models\UserAnalytic;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/** Receives signed order and payment events from the existing Scalev checkout. */
class ScalevWebhookController extends Controller
{
    private const PAID_STATUSES = ['paid', 'settled'];
    private const SOURCE = 'c11-problem';

    public function __invoke(Request $request): Response
    {
        $secret = trim((string) config('scalev.webhook_signing_secret'));
        $signature = (string) $request->header('X-Scalev-Hmac-Sha256', '');
        $rawBody = $request->getContent();

        if ($secret === '' || $signature === '' || ! $this->signatureIsValid($rawBody, $signature, $secret)) {
            return response()->noContent(401);
        }

        $event = json_decode($rawBody, true);
        if (! is_array($event) || empty($event['unique_id']) || empty($event['event'])) {
            return response()->noContent(400);
        }

        return DB::transaction(function () use ($event): Response {
            $record = ScalevWebhookEvent::firstOrCreate(
                ['unique_id' => (string) $event['unique_id']],
                ['event' => (string) $event['event'], 'payload' => $event],
            );
            if ($record->processed_at !== null) {
                return response()->noContent(204);
            }

            $data = is_array($event['data'] ?? null) ? $event['data'] : [];
            match ((string) $event['event']) {
                'order.created' => $this->handleOrderCreated($data),
                'payment.received' => $this->handlePaymentStatus($data, true),
                'payment.failed', 'order.payment_status_changed' => $this->handlePaymentStatus($data, false),
                default => null,
            };

            $record->forceFill(['processed_at' => now()])->save();
            return response()->noContent(204);
        });
    }

    private function signatureIsValid(string $rawBody, string $signature, string $secret): bool
    {
        $received = base64_decode($signature, true);
        return $received !== false && hash_equals(hash_hmac('sha256', $rawBody, $secret, true), $received);
    }

    /** @param array<string, mixed> $data */
    private function handleOrderCreated(array $data): void
    {
        $orderId = $this->stringOrNull($data['id'] ?? null);
        if ($orderId === null || ! $this->isC11Order($data)) {
            return;
        }

        $order = ScalevOrder::query()->firstOrNew(['scalev_order_id' => $orderId]);
        $wasPaid = $order->exists && in_array($order->payment_status, self::PAID_STATUSES, true);
        $previousStatus = $order->payment_status;
        $order->fill($this->orderFields($data));
        $order->payment_status = $wasPaid ? $previousStatus : (string) ($data['payment_status'] ?? 'unpaid');
        if (in_array($order->payment_status, self::PAID_STATUSES, true) && $order->paid_at === null) {
            $order->paid_at = now();
        }
        $order->save();

        if (! $wasPaid && in_array($order->payment_status, self::PAID_STATUSES, true)) {
            $this->recordConversion($order, $data);
        }

        // An unattributed payment may arrive first. Once order.created brings
        // the c11 marker, apply that earlier signed delivery to the new order.
        ScalevWebhookEvent::query()
            ->whereIn('event', ['payment.received', 'payment.failed', 'order.payment_status_changed'])
            ->where('payload->data->id', $orderId)
            ->orderBy('created_at')
            ->get()
            ->each(function (ScalevWebhookEvent $event): void {
                $data = $event->payload['data'] ?? [];
                if (is_array($data)) {
                    $this->handlePaymentStatus($data, $event->event === 'payment.received');
                }
            });
    }

    /** @param array<string, mixed> $data */
    private function handlePaymentStatus(array $data, bool $isPaymentEvent): void
    {
        $orderId = $this->stringOrNull($data['id'] ?? null);
        if ($orderId === null) {
            Log::warning('Scalev webhook without order id');
            return;
        }

        $order = ScalevOrder::query()->where('scalev_order_id', $orderId)->lockForUpdate()->first();
        // A payment can arrive before order.created, if it carries attribution.
        if ($order === null && $this->isC11Order($data)) {
            $fields = $this->orderFields($data);
            $fields['payment_status'] = 'unpaid';
            $order = ScalevOrder::create($fields);
        }
        if ($order === null) {
            Log::info('Scalev payment for an unattributed order', ['order' => $orderId]);
            return;
        }

        $status = (string) ($data['payment_status'] ?? ($isPaymentEvent ? 'paid' : 'unpaid'));
        $isPaid = in_array($status, self::PAID_STATUSES, true);
        $wasPaid = in_array($order->payment_status, self::PAID_STATUSES, true);
        if ($wasPaid && ! $isPaid) {
            return;
        }

        $order->forceFill([
            'payment_status' => $status,
            'payment_method' => $this->stringOrNull($data['payment_method'] ?? null) ?? $order->payment_method,
            'paid_at' => $isPaid ? ($order->paid_at ?? now()) : $order->paid_at,
        ])->save();

        if ($isPaid && ! $wasPaid) {
            $this->recordConversion($order, $data);
        }
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    private function orderFields(array $data): array
    {
        $customer = is_array($data['customer'] ?? null) ? $data['customer'] : [];
        $address = is_array($data['destination_address'] ?? null) ? $data['destination_address'] : [];
        $lines = is_array($data['orderlines'] ?? null) ? $data['orderlines'] : [];
        $firstLine = is_array($lines[0] ?? null) ? $lines[0] : [];
        $variants = is_array($data['final_variants'] ?? null) ? $data['final_variants'] : [];
        $package = $this->stringOrNull($data['utm_content'] ?? null) ?? 'unknown';

        return [
            'scalev_order_id' => (string) $data['id'],
            'landing_source' => '/c11-problem',
            'scalev_order_number' => $this->stringOrNull($data['order_id'] ?? null),
            'secret_slug' => $this->stringOrNull($data['secret_slug'] ?? null),
            'package' => $package,
            'package_label' => $this->stringOrNull($firstLine['product_name'] ?? null)
                ?? $this->stringOrNull(array_key_first($variants)) ?? $package,
            'amount' => (int) round((float) ($data['gross_revenue'] ?? 0)),
            'customer_name' => $this->stringOrNull($customer['name'] ?? $address['name'] ?? null) ?? '',
            'customer_phone' => $this->stringOrNull($customer['phone'] ?? $address['phone'] ?? null) ?? '',
            'customer_email' => $this->stringOrNull($customer['email'] ?? $address['email'] ?? null),
            'payment_method' => $this->stringOrNull($data['payment_method'] ?? null),
            'payment_status' => (string) ($data['payment_status'] ?? 'unpaid'),
            'payload' => $data,
        ];
    }

    /** @param array<string, mixed> $data */
    private function isC11Order(array $data): bool
    {
        $metadata = is_array($data['metadata'] ?? null) ? $data['metadata'] : [];
        foreach ([$data['utm_source'] ?? null, $metadata['utm_source'] ?? null] as $value) {
            if ($value === self::SOURCE) {
                return true;
            }
        }

        $sourceUrl = $this->stringOrNull($metadata['event_source_url'] ?? $data['event_source_url'] ?? null);
        if ($sourceUrl === null) {
            return false;
        }
        parse_str((string) parse_url($sourceUrl, PHP_URL_QUERY), $query);
        return ($query['utm_source'] ?? null) === self::SOURCE;
    }

    /** @param array<string, mixed> $data */
    private function recordConversion(ScalevOrder $order, array $data): void
    {
        UserAnalytic::create([
            'session_id' => $order->analytics_session_id ?? 'scalev:'.$order->scalev_order_id,
            'event_type' => 'payment',
            'event_data' => [
                'status' => 'paid',
                'platform' => 'scalev',
                'scalev_order_id' => $order->scalev_order_id,
                'order_number' => $data['order_id'] ?? $order->scalev_order_number,
                'package' => $order->package,
                'package_label' => $order->package_label,
                'amount' => (float) ($data['gross_revenue'] ?? $order->amount),
                'currency' => 'IDR',
                'payment_method' => $order->payment_method,
                'event_id' => $order->scalev_order_id,
                'landing_source' => '/c11-problem',
                'timestamp' => now()->toIso8601String(),
            ],
            'referral_source' => 'scalev',
            'created_at' => now(),
        ]);
    }

    private function stringOrNull(mixed $value): ?string
    {
        if (! is_string($value) && ! is_int($value)) {
            return null;
        }
        $value = trim((string) $value);
        return $value === '' ? null : $value;
    }
}
