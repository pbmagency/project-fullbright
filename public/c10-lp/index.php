<?php

// LiteSpeed canonicalizes the physical /c10-lp directory to /c10-lp/.
// Hand the canonical URL to Laravel so the Inertia/TSX route renders normally.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = dirname(__DIR__).'/index.php';
require dirname(__DIR__).'/index.php';
