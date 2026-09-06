<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LabsController;
use Illuminate\Support\Facades\Route;

// ── Public landing page ───────────────────────────────────────────────────────
Route::inertia('/', 'cycle7/angle-1')->name('home');
// ── Cycle 4 Test Social Proof ─────────────────────
Route::inertia('/c4-sp-1', 'cycle4/sp-test-1')->name('cycle4.sp.v1');
Route::inertia('/c4-sp-2', 'cycle4/sp-test-2')->name('cycle4.sp.v2');
Route::inertia('/c5-hero', 'cycle5/hero-test')->name('cycle5.hero.test');
Route::inertia('/c6-angle', 'cycle6/angle-1')->name('cycle6.angle.v1');
Route::inertia('/c6-angle-2', 'cycle6/angle-2')->name('cycle6.angle.v2');
Route::inertia('/c7-angle-1', 'cycle7/angle-1')->name('cycle7.angle.v1');
Route::inertia('/c7-angle-2', 'cycle7/angle-2')->name('cycle7.angle.v2');
Route::inertia('/c7-angle-3', 'cycle7/angle-3')->name('cycle7.angle.v3');
Route::inertia('/c8-angle-1', 'cycle8/angle-1')->name('cycle8.angle.v1');
Route::inertia('/bio-ig-toefl-hack', 'cycle8/angle-1')->name('home2');
Route::inertia('/toefl-hack', 'cycle8/angle-1')->name('home3');
Route::inertia('/e-course-toefl-hack', 'cycle7/angle-3')->name('home4');
Route::redirect('/c10-lp', '/c10-lp/')->name('cycle10.landing');

// ── Analytics tracking endpoint (public, uses session CSRF) ──────────────────
Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::inertia('/c3-problem', 'cycle3/agitation-test')->name('cycle3.agitation');

// ── Admin routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('/labs', [LabsController::class, 'index'])->name('labs');
    Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');
});

require __DIR__ . '/settings.php';
