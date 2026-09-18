<?php
$path = dirname(__DIR__).'/docs/Rekap_Microconversion_C8_C11_dengan_Label_AB_Testing.docx';
$zip = new ZipArchive();
if ($zip->open($path) !== true) throw new RuntimeException('Cannot open DOCX');
foreach (['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/styles.xml', 'word/_rels/document.xml.rels'] as $entry) {
    $xml = new DOMDocument();
    $data = $zip->getFromName($entry);
    if ($data === false || !$xml->loadXML($data)) throw new RuntimeException('Invalid '.$entry);
    echo $entry.' valid'.PHP_EOL;
}
$body = $zip->getFromName('word/document.xml');
echo 'Tables: '.substr_count($body, '<w:tbl>').PHP_EOL;
echo 'Rows: '.substr_count($body, '<w:tr>').PHP_EOL;
echo 'Bytes: '.filesize($path).PHP_EOL;
