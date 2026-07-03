<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LabsController;
use Illuminate\Support\Facades\Route;

// ── Public landing page ───────────────────────────────────────────────────────
Route::inertia('/', 'landing')->name('home');
Route::inertia('/variant-1', 'landingV1');
Route::inertia('/variant-2', 'landingV2');

Route::inertia('/bio-ig-toefl-hack', 'landing')->name('home2');
Route::inertia('/toefl-hack', 'landing')->name('home3');

// ── Analytics tracking endpoint (public, uses session CSRF) ──────────────────
Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// ── Cycle 3 Test Problem ──────────────────────────────────────────────────────
Route::inertia('/c3-problem', 'cycle3/agitation-test')->name('cycle3.agitation');

// ── Admin routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('/labs', [LabsController::class, 'index'])->name('labs');
    Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');
});

require __DIR__ . '/settings.php';
