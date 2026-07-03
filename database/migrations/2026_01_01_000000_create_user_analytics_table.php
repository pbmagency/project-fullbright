<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_analytics', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('event_type'); // visit, scroll, engagement, cta_click, conversion, payment
            $table->json('event_data');   // flexible — always includes landing_source
            $table->string('referral_source')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('ip_hash')->nullable();
            $table->text('user_agent')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamp('created_at');

            // Composite indexes for fast aggregation queries
            $table->index(['event_type', 'created_at']);
            $table->index(['referral_source', 'created_at']);
            $table->index(['event_type', 'session_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_analytics');
    }
};
