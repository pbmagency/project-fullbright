<?php

namespace App\Jobs;

use App\Models\UserAnalytic;
use App\Services\MetaConversionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\Request;

class ProcessAnalyticsBatch implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public array $events,
        public string $sessionId,
        public string $ipHash,
        public ?string $clientIp,
        public ?string $userAgent,
        public ?int $userId,
        public ?string $referer,
    ) {}

    public function handle(MetaConversionService $metaService): void
    {
        foreach ($this->events as $event) {
            $data = $event['event_data'] ?? [];
            $eventId = $data['event_id'] ?? null;

            if ($eventId && UserAnalytic::query()->where('event_data->event_id', $eventId)->exists()) {
                continue;
            }

            UserAnalytic::create([
                'session_id' => $data['analytics_session_id'] ?? $this->sessionId,
                'event_type' => $event['event_type'],
                'event_data' => $data,
                'referral_source' => $event['referral_source'] ?? null,
                'utm_source' => $event['utm_source'] ?? null,
                'utm_medium' => $event['utm_medium'] ?? null,
                'utm_campaign' => $event['utm_campaign'] ?? null,
                'utm_content' => $event['utm_content'] ?? null,
                'utm_term' => $event['utm_term'] ?? null,
                'ip_hash' => $this->ipHash,
                'user_agent' => $this->userAgent,
                'user_id' => $this->userId,
                'created_at' => now(),
            ]);

            if ($eventId && in_array($event['event_type'], ['visit', 'initiate_checkout'], true)) {
                $request = Request::create(
                    'https://fullbrightindonesia.com/analytics/track-batch',
                    'POST',
                    ['event_data' => $data],
                    [],
                    [],
                    array_filter([
                        'REMOTE_ADDR' => $this->clientIp,
                        'HTTP_USER_AGENT' => $this->userAgent,
                        'HTTP_REFERER' => $this->referer,
                    ]),
                );

                if ($event['event_type'] === 'visit') {
                    $metaService->sendPageView($request, $eventId);
                } else {
                    $metaService->sendAddToCart($request, $eventId, $data);
                }
            }
        }
    }
}
