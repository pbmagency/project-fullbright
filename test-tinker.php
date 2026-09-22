<?php
$req1 = Illuminate\Http\Request::create('/c10-lp/', 'GET');
app()->instance('request', $req1);
echo "c10-lp/: " . asset('build/test.css') . "\n";

$req2 = Illuminate\Http\Request::create('/c1-lp/', 'GET');
app()->instance('request', $req2);
echo "c1-lp/: " . asset('build/test.css') . "\n";
