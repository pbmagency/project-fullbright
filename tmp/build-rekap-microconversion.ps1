$ErrorActionPreference = 'Stop'
$workspace = 'E:\PBM\Gorden\project-fullbright'
$inputHtml = Join-Path $workspace 'tmp\rekap-microconversion-c8-c11.html'
$outputDocx = Join-Path $workspace 'docs\Rekap_Microconversion_C8_C11.docx'
$outputPdf = Join-Path $workspace 'tmp\Rekap_Microconversion_C8_C11_QA.pdf'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $document = $word.Documents.Open($inputHtml, $false, $true)
    $document.SaveAs2($outputDocx, 16)
    $document.ExportAsFixedFormat($outputPdf, 17)
    $document.Close($false)
} finally {
    $word.Quit()
}
Write-Output $outputDocx
Write-Output $outputPdf
