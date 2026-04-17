param(
  [string]$SourcePath = "C:\Users\zyw64\Downloads\海资23-2 杜宛清.xlsx",
  [string]$OutputPath = "C:\Users\zyw64\Downloads\海资23-2 杜宛清-重制.xlsx"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Escape-XmlText {
  param([string]$Text)
  if ($null -eq $Text) { return "" }
  return [System.Security.SecurityElement]::Escape($Text)
}

function New-InlineCellXml {
  param(
    [string]$Ref,
    [string]$Text,
    [Nullable[int]]$Style = $null
  )

  $styleAttr = ""
  if ($Style -ne $null) {
    $styleAttr = " s=`"$Style`""
  }

  if ([string]::IsNullOrEmpty($Text)) {
    return "<c r=`"$Ref`"$styleAttr t=`"inlineStr`"></c>"
  }

  $escaped = Escape-XmlText $Text
  return "<c r=`"$Ref`"$styleAttr t=`"inlineStr`"><is><t>$escaped</t></is></c>"
}

function New-NumberCellXml {
  param(
    [string]$Ref,
    [decimal]$Value,
    [Nullable[int]]$Style = $null
  )

  $styleAttr = ""
  if ($Style -ne $null) {
    $styleAttr = " s=`"$Style`""
  }

  $numberText = $Value.ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)
  return "<c r=`"$Ref`"$styleAttr t=`"n`"><v>$numberText</v></c>"
}

$usdRate = 7.1812
$rows = @(
  [ordered]@{
    Type = "耕地"
    AreaKm2 = 1286088
    AreaSource = "来源：《2024年中国自然资源公报》"
    UnitRmb = 9118.07
    UnitSource = "来源：张莉金等（2023）表3加权重算"
  }
  [ordered]@{
    Type = "林地（近似森林生态系统）"
    AreaKm2 = 2836957
    AreaSource = "来源：《2024年中国自然资源公报》"
    UnitRmb = 47857.29
    UnitSource = "来源：张莉金等（2023）表3加权重算"
  }
  [ordered]@{
    Type = "草地"
    AreaKm2 = 2632157
    AreaSource = "来源：《2024年中国自然资源公报》"
    UnitRmb = 25687.72
    UnitSource = "来源：张莉金等（2023）表3加权重算"
  }
  [ordered]@{
    Type = "湿地"
    AreaKm2 = 235198
    AreaSource = "来源：《2024年中国自然资源公报》"
    UnitRmb = 120372.72
    UnitSource = "来源：张莉金等（2023）表3直接取值"
  }
  [ordered]@{
    Type = "水域及水利设施用地（近似水域）"
    AreaKm2 = 362648
    AreaSource = "来源：《2024年中国自然资源公报》"
    UnitRmb = 290657.77
    UnitSource = "来源：张莉金等（2023）表3水系取值"
  }
  [ordered]@{
    Type = "红树林（单列，不计入合计）"
    AreaKm2 = 303
    AreaSource = "来源：《中国海洋生态保护修复公报2024》"
    UnitRmb = 987400.00
    UnitSource = "来源：廖宝文等（2022）中国红树林基准价值"
  }
)

foreach ($row in $rows) {
  $row.UnitUsd = [math]::Round($row.UnitRmb / $usdRate, 2)
  $row.TotalUsd = [math]::Round(($row.AreaKm2 * $row.UnitUsd) / 1000000, 2)
  $row.TotalRmb = [math]::Round(($row.AreaKm2 * $row.UnitRmb) / 1000000, 2)
}

$mainRows = $rows | Select-Object -First 5
$totalAreaKm2 = 0
$totalUsd = 0.0
$totalRmb = 0.0
foreach ($item in $mainRows) {
  $totalAreaKm2 += [int]$item.AreaKm2
  $totalUsd += [double]$item.TotalUsd
  $totalRmb += [double]$item.TotalRmb
}
$totalUsd = [math]::Round($totalUsd, 2)
$totalRmb = [math]::Round($totalRmb, 2)

$sheetRows = New-Object System.Collections.Generic.List[string]

$sheetRows.Add("<row r=`"1`">$(New-InlineCellXml -Ref 'A1' -Text '中国生态系统服务价值（按2024年面积与近年论文口径重算）' -Style 1)</row>")

$headerCells = @(
  (New-InlineCellXml -Ref "A2" -Text "生态系统类型"),
  (New-InlineCellXml -Ref "B2" -Text "面积/km²"),
  (New-InlineCellXml -Ref "C2" -Text "单位价值/USD·(hm²·a)⁻¹"),
  (New-InlineCellXml -Ref "D2" -Text "总价值/10⁸ USD·a⁻¹"),
  (New-InlineCellXml -Ref "E2" -Text "总价值/10⁸ RMB·a⁻¹")
)
$sheetRows.Add("<row r=`"2`">$($headerCells -join '')</row>")

$excelRow = 3
foreach ($row in $rows) {
  $cells = @(
    (New-InlineCellXml -Ref ("A{0}" -f $excelRow) -Text $row.Type),
    (New-InlineCellXml -Ref ("B{0}" -f $excelRow) -Text ("{0:N0} {1}" -f $row.AreaKm2, $row.AreaSource)),
    (New-InlineCellXml -Ref ("C{0}" -f $excelRow) -Text ("{0:N2} {1}" -f $row.UnitUsd, $row.UnitSource)),
    (New-NumberCellXml -Ref ("D{0}" -f $excelRow) -Value ([decimal]$row.TotalUsd)),
    (New-NumberCellXml -Ref ("E{0}" -f $excelRow) -Value ([decimal]$row.TotalRmb))
  )
  $sheetRows.Add("<row r=`"$excelRow`">$($cells -join '')</row>")
  $excelRow++
}

$totalCells = @(
  (New-InlineCellXml -Ref ("A{0}" -f $excelRow) -Text "合计（前五类，陆地为主）"),
  (New-InlineCellXml -Ref ("B{0}" -f $excelRow) -Text ("{0:N0} 面积合计" -f $totalAreaKm2)),
  (New-InlineCellXml -Ref ("C{0}" -f $excelRow) -Text "不单列平均单位价值"),
  (New-NumberCellXml -Ref ("D{0}" -f $excelRow) -Value ([decimal]$totalUsd)),
  (New-NumberCellXml -Ref ("E{0}" -f $excelRow) -Value ([decimal]$totalRmb))
)
$sheetRows.Add("<row r=`"$excelRow`">$($totalCells -join '')</row>")
$excelRow++

$note1 = "说明：全国海洋、海岸带和开阔海面缺乏与上表同口径的最新全国统一论文数据，本次未纳入合计。"
$sheetRows.Add("<row r=`"$excelRow`">$(New-InlineCellXml -Ref ("A{0}" -f $excelRow) -Text $note1)</row>")
$excelRow++

$note2 = "说明：USD 按 2024 年平均汇率 1 USD = 7.1812 RMB 折算；张莉金等（2023）使用的标准当量价值为 2313.97 元/hm²。"
$sheetRows.Add("<row r=`"$excelRow`">$(New-InlineCellXml -Ref ("A{0}" -f $excelRow) -Text $note2)</row>")

$lastRow = $excelRow

$sheetXml = @"
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetPr>
    <outlinePr summaryBelow="1" summaryRight="1"/>
    <pageSetUpPr/>
  </sheetPr>
  <dimension ref="A1:E$lastRow"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <selection activeCell="A1" sqref="A1"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr baseColWidth="8" defaultRowHeight="15"/>
  <cols>
    <col width="24" customWidth="1" min="1" max="1"/>
    <col width="58" customWidth="1" min="2" max="2"/>
    <col width="66" customWidth="1" min="3" max="3"/>
    <col width="24" customWidth="1" min="4" max="4"/>
    <col width="24" customWidth="1" min="5" max="5"/>
  </cols>
  <sheetData>
    $($sheetRows -join [Environment]::NewLine)
  </sheetData>
  <mergeCells count="1">
    <mergeCell ref="A1:E1"/>
  </mergeCells>
  <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
</worksheet>
"@

if (-not (Test-Path -LiteralPath $SourcePath)) {
  throw "Source workbook not found: $SourcePath"
}

Copy-Item -LiteralPath $SourcePath -Destination $OutputPath -Force

$zip = [System.IO.Compression.ZipFile]::Open($OutputPath, [System.IO.Compression.ZipArchiveMode]::Update)
try {
  $sheetEntry = $zip.GetEntry("xl/worksheets/sheet1.xml")
  if ($null -eq $sheetEntry) {
    throw "Worksheet entry xl/worksheets/sheet1.xml not found."
  }

  $sheetEntry.Delete()
  $newEntry = $zip.CreateEntry("xl/worksheets/sheet1.xml")
  $writer = New-Object System.IO.StreamWriter($newEntry.Open(), (New-Object System.Text.UTF8Encoding($false)))
  try {
    $writer.Write($sheetXml)
  }
  finally {
    $writer.Dispose()
  }
}
finally {
  $zip.Dispose()
}

[pscustomobject]@{
  OutputPath = $OutputPath
  TotalRows = $rows.Count
  MainTotalUsd_1e8 = $totalUsd
  MainTotalRmb_1e8 = $totalRmb
} | ConvertTo-Json -Compress
