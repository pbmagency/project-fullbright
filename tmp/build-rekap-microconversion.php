<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$html = file_get_contents($root.'/tmp/rekap-microconversion-c8-c11-v2.html');
if ($html === false) { throw new RuntimeException('HTML source unavailable'); }
$dom = new DOMDocument();
libxml_use_internal_errors(true);
$dom->loadHTML('<?xml encoding="utf-8"?>'.$html);
libxml_clear_errors();
$body = $dom->getElementsByTagName('body')->item(0);
if (!$body) { throw new RuntimeException('Body unavailable'); }

function esc(string $value): string { return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8'); }
function runs(string $text, bool $bold = false, int $size = 19, string $color = '171717'): string {
    $parts = preg_split('/\R/u', trim($text)) ?: [''];
    $out = '';
    foreach ($parts as $i => $part) {
        if ($i > 0) $out .= '<w:r><w:br/></w:r>';
        $out .= '<w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="'.$size.'"/><w:color w:val="'.$color.'"/>'.($bold ? '<w:b/>' : '').'</w:rPr><w:t xml:space="preserve">'.esc($part).'</w:t></w:r>';
    }
    return $out;
}
function paragraph(string $text, string $kind = 'body'): string {
    $size = $kind === 'title' ? 40 : ($kind === 'heading' ? 25 : ($kind === 'small' ? 17 : 20));
    $bold = in_array($kind, ['title', 'heading'], true);
    $before = $kind === 'heading' ? 260 : 0;
    $after = $kind === 'title' ? 210 : ($kind === 'heading' ? 110 : 120);
    $keep = $kind === 'heading' ? '<w:keepNext/>' : '';
    return '<w:p><w:pPr>'.$keep.'<w:spacing w:before="'.$before.'" w:after="'.$after.'" w:line="285" w:lineRule="auto"/></w:pPr>'.runs($text, $bold, $size, $kind === 'small' ? '555555' : '000000').'</w:p>';
}
function table(DOMElement $table): string {
    $rows = [];
    foreach ($table->childNodes as $child) {
        if ($child instanceof DOMElement && $child->tagName === 'tr') $rows[] = $child;
        elseif ($child instanceof DOMElement && in_array($child->tagName, ['tbody', 'thead'], true)) {
            foreach ($child->childNodes as $row) if ($row instanceof DOMElement && $row->tagName === 'tr') $rows[] = $row;
        }
    }
    $widths = [2200, 4300, 3600, 4300];
    $xml = '<w:tbl><w:tblPr><w:tblW w:w="14400" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>';
    foreach (['top','left','bottom','right','insideH','insideV'] as $edge) $xml .= '<w:'.$edge.' w:val="single" w:sz="4" w:color="D9D9D9"/>';
    $xml .= '</w:tblBorders><w:tblCellMar><w:top w:w="100" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>';
    foreach ($widths as $width) $xml .= '<w:gridCol w:w="'.$width.'"/>';
    $xml .= '</w:tblGrid>';
    foreach ($rows as $ri => $row) {
        $xml .= '<w:tr>'.($ri === 0 ? '<w:trPr><w:tblHeader w:val="true"/></w:trPr>' : '');
        $cells = [];
        foreach ($row->childNodes as $cell) if ($cell instanceof DOMElement && in_array($cell->tagName, ['td','th'], true)) $cells[] = $cell;
        foreach ($cells as $ci => $cell) {
            $shade = $ri === 0 ? '243B59' : ($ri % 2 === 0 ? 'F3F6FA' : 'FFFFFF');
            $xml .= '<w:tc><w:tcPr><w:tcW w:w="'.($widths[$ci] ?? 3600).'" w:type="dxa"/><w:shd w:fill="'.$shade.'"/><w:vAlign w:val="center"/></w:tcPr>';
            $text = preg_replace('/\s+/u', ' ', $cell->textContent ?? '') ?? '';
            // Preserve explicit line breaks used in route and event cells.
            foreach ($cell->getElementsByTagName('br') as $br) $br->parentNode?->replaceChild($dom = $cell->ownerDocument->createTextNode("\n"), $br);
            $text = preg_replace('/[ \t]+/u', ' ', $cell->textContent ?? '') ?? '';
            $xml .= '<w:p><w:pPr><w:spacing w:after="0" w:line="260" w:lineRule="auto"/></w:pPr>'.runs($text, $ri === 0, $ri === 0 ? 18 : 17, $ri === 0 ? 'FFFFFF' : '171717').'</w:p></w:tc>';
        }
        $xml .= '</w:tr>';
    }
    return $xml.'</w:tbl><w:p><w:pPr><w:spacing w:after="65"/></w:pPr></w:p>';
}

$content = '';
foreach ($body->childNodes as $node) {
    if (!$node instanceof DOMElement) continue;
    $content .= match ($node->tagName) {
        'h1' => paragraph($node->textContent, 'title'),
        'h2' => paragraph($node->textContent, 'heading'),
        'p' => paragraph($node->textContent, $node->getAttribute('class') === 'small' ? 'small' : 'body'),
        'table' => table($node),
        default => '',
    };
}
$document = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'.$content.'<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="350" w:footer="350"/></w:sectPr></w:body></w:document>';
$styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="20"/></w:rPr></w:style></w:styles>';
$types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
$rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
$docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
$output = $root.'/docs/Rekap_Microconversion_C8_C11_dengan_Label_AB_Testing.docx';
$zip = new ZipArchive();
if ($zip->open($output, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) throw new RuntimeException('Cannot create DOCX');
foreach (['[Content_Types].xml'=>$types, '_rels/.rels'=>$rels, 'word/document.xml'=>$document, 'word/styles.xml'=>$styles, 'word/_rels/document.xml.rels'=>$docRels] as $path=>$data) $zip->addFromString($path, $data);
$zip->close();
echo $output.PHP_EOL;
