<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$req = Illuminate\Http\Request::create("/c10-lp");
try {
    echo $req->user() ? "user\n" : "no user\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
