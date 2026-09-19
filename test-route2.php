<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$router = $app->make('router');
$route = collect($router->getRoutes())->first(fn($r) => $r->uri() === 'c10-lp');
$middlewares = $router->gatherRouteMiddleware($route);
print_r($middlewares);
