$ErrorActionPreference = 'Stop'
$workspace = 'E:\PBM\Gorden\project-fullbright'
$source = Join-Path $workspace 'docs\Rekap_Microconversion_C8_C11.docx'
$output = Join-Path $workspace 'tmp\Rekap_Microconversion_C8_C11_QA.pdf'
$log = Join-Path $workspace 'tmp\rekap-word-stage.txt'
Set-Content -LiteralPath $log -Value 'launch'
$word = New-Object -ComObject Word.Application
Set-Content -LiteralPath $log -Value 'created'
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $document = $word.Documents.Open($source, $false, $true)
    Set-Content -LiteralPath $log -Value 'opened'
    $document.SaveAs2($output, 17)
    Set-Content -LiteralPath $log -Value 'exported'
    $document.Close($false)
} finally {
    $word.Quit()
}
Write-Output $output
