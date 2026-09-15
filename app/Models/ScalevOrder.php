<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScalevOrder extends Model
{
    protected $fillable = [
        'scalev_order_id',
        'landing_source',
        'scalev_order_number',
        'secret_slug',
        'package',
        'package_label',
        'amount',
        'customer_name',
        'customer_phone',
        'customer_email',
        'analytics_session_id',
        'fbp',
        'fbc',
        'payment_method',
        'payment_status',
        'paid_at',
        'payload',
    ];

    protected $casts = [
        'amount' => 'integer',
        'paid_at' => 'datetime',
        'payload' => 'array',
    ];
}
