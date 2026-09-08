<?php

// LiteSpeed canonicalizes the physical /c10-lp directory to /c10-lp/.
// Hand the canonical URL to Laravel so the Inertia/TSX route renders normally.
require dirname(__DIR__).'/index.php';
