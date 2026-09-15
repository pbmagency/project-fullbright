<?php

namespace App\Http\Controllers;

use App\Models\ScalevOrder;
use Illuminate\Http\JsonResponse;

class C11ScalevProofController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $orders = ScalevOrder::query()->where('landing_source', '/c11-problem');
        $latest = (clone $orders)->where('created_at', '>=', now()->subMinutes(5))
            ->latest('id')->first();
        $address = is_array($latest?->payload['destination_address'] ?? null)
            ? $latest->payload['destination_address'] : [];
        $city = $address['city'] ?? null;
        $city = is_string($city) ? trim($city) : null;

        return response()->json([
            'submitted' => (clone $orders)->count(),
            'paid' => (clone $orders)->whereIn('payment_status', ['paid', 'settled'])->count(),
            'latest_submission' => $latest === null ? null : [
                'id' => $latest->id,
                'city' => $city !== '' ? $city : null,
            ],
        ])->header('Cache-Control', 'no-store');
    }
}
