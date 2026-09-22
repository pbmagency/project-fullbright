<?php
$html = file_get_contents('http://127.0.0.1:8080/c10-lp');
echo substr($html, 0, 1500);
