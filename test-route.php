<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$route = collect(Route::getRoutes())->first(fn($r) => $r->uri() === 'c10-lp');
print_r($route->gatherMiddleware());
