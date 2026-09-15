<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scalev_orders', function (Blueprint $table) {
            $table->id();
            $table->string('scalev_order_id')->unique();
            $table->string('landing_source')->default('/c11-problem')->index();
            $table->string('scalev_order_number')->nullable()->index();
            $table->string('secret_slug')->nullable();
            $table->string('package');
            $table->string('package_label');
            $table->unsignedInteger('amount');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            // Lets a paid webhook be attributed to the browser session that
            // started the checkout on the landing page.
            $table->string('analytics_session_id')->nullable()->index();
            // Meta click/browser ids captured at checkout time, reused for the
            // server-side Purchase event when the webhook reports payment.
            $table->string('fbp')->nullable();
            $table->string('fbc')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('pending')->index();
            $table->timestamp('paid_at')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });

        Schema::create('scalev_webhook_events', function (Blueprint $table) {
            $table->id();
            // Scalev delivers webhooks at least once, so every event id must be
            // stored with a unique constraint to keep processing idempotent.
            $table->string('unique_id')->unique();
            $table->string('event')->index();
            $table->json('payload')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scalev_webhook_events');
        Schema::dropIfExists('scalev_orders');
    }
};
