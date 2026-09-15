<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScalevWebhookEvent extends Model
{
    protected $fillable = [
        'unique_id',
        'event',
        'payload',
        'processed_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'processed_at' => 'datetime',
    ];
}
