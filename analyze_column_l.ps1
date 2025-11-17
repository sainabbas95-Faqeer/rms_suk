# Column L Analysis Script - Count Enfra & SMS LD
# Analyzes column L in DB.xlsx for Enfra and SMS LD occurrences

Write-Host "Column L Analysis - Enfra & SMS LD Counter" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$excelFile = "DB.xlsx"

if (-not (Test-Path $excelFile)) {
    Write-Host "❌ Excel file not found: $excelFile" -ForegroundColor Red
    Write-Host "Please ensure DB.xlsx is in the current directory" -ForegroundColor Yellow
    exit
}

try {
    # Create Excel COM object
    Write-Host "Opening Excel file..." -ForegroundColor Green
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open((Resolve-Path $excelFile).Path)
    $worksheet = $workbook.Worksheets.Item(1)  # First sheet
    
    # Get used range
    $usedRange = $worksheet.UsedRange
    $rowCount = $usedRange.Rows.Count
    
    Write-Host "Analyzing Column L..." -ForegroundColor Yellow
    Write-Host "Total rows to analyze: $($rowCount - 1)" -ForegroundColor Gray  # Excluding header
    
    # Initialize counters
    $enframiCount = 0
    $smsLdCount = 0
    $otherCount = 0
    $emptyCount = 0
    
    # Analyze each row in column L (column 12)
    for ($row = 2; $row -le $rowCount; $row++) {
        $cellValue = $worksheet.Cells.Item($row, 12).Text  # Column L is column 12
        
        if ([string]::IsNullOrWhiteSpace($cellValue)) {
            $emptyCount++
        }
        else {
            $cellValueUpper = $cellValue.ToUpper().Trim()
            
            if ($cellValueUpper.Contains("ENFRA")) {
                $enframiCount++
                Write-Host "  Row $row : Enfra - $cellValue" -ForegroundColor Green
            }
            elseif ($cellValueUpper.Contains("SMS LD") -or $cellValueUpper.Contains("SMS-LD") -or $cellValueUpper.Contains("SMSLD")) {
                $smsLdCount++
                Write-Host "  Row $row : SMS LD - $cellValue" -ForegroundColor Blue
            }
            else {
                $otherCount++
                # Uncomment below line to see other values
                # Write-Host "  Row $row : Other - $cellValue" -ForegroundColor Gray
            }
        }
    }
    
    # Display results
    Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
    Write-Host "ANALYSIS RESULTS" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    Write-Host "Enfra Count    : " -NoNewline -ForegroundColor Green
    Write-Host "$enframiCount" -ForegroundColor White -BackgroundColor Green
    
    Write-Host "SMS LD Count  : " -NoNewline -ForegroundColor Blue
    Write-Host "$smsLdCount" -ForegroundColor White -BackgroundColor Blue
    
    Write-Host "Others Count  : " -NoNewline -ForegroundColor Yellow
    Write-Host "$otherCount" -ForegroundColor Black -BackgroundColor Yellow
    
    Write-Host "Empty Count   : " -NoNewline -ForegroundColor Gray
    Write-Host "$emptyCount" -ForegroundColor White -BackgroundColor Gray
    
    $totalAnalyzed = $enframiCount + $smsLdCount + $otherCount + $emptyCount
    Write-Host "Total Analyzed: " -NoNewline -ForegroundColor Cyan
    Write-Host "$totalAnalyzed" -ForegroundColor White -BackgroundColor Cyan
    
    # Calculate percentages
    if ($totalAnalyzed -gt 0) {
        $enframiPct = [Math]::Round(($enframiCount / $totalAnalyzed) * 100, 2)
        $smsLdPct = [Math]::Round(($smsLdCount / $totalAnalyzed) * 100, 2)
        $otherPct = [Math]::Round(($otherCount / $totalAnalyzed) * 100, 2)
        
        Write-Host "`nPERCENTAGES:" -ForegroundColor Cyan
        Write-Host "Enfra  : $enframiPct%" -ForegroundColor Green
        Write-Host "SMS LD : $smsLdPct%" -ForegroundColor Blue
        Write-Host "Others : $otherPct%" -ForegroundColor Yellow
    }
    
    # Create summary report
    $reportContent = @"
Column L Analysis Report
Generated: $(Get-Date)
File: $excelFile

COUNTS:
=======
Enfra Count: $enframiCount
SMS LD Count: $smsLdCount
Others Count: $otherCount
Empty Count: $emptyCount
Total Analyzed: $totalAnalyzed

PERCENTAGES:
============
Enfra: $enframiPct%
SMS LD: $smsLdPct%
Others: $otherPct%

SUMMARY:
========
- Primary focus entries (Enfra + SMS LD): $($enframiCount + $smsLdCount)
- Data completeness: $([Math]::Round((($totalAnalyzed - $emptyCount) / $totalAnalyzed) * 100, 2))%
- Most common: $(if ($enframiCount -gt $smsLdCount) { "Enfra" } else { "SMS LD" })
"@
    
    $reportFile = "Column_L_Analysis_Report.txt"
    $reportContent | Out-File -FilePath $reportFile -Encoding UTF8
    
    Write-Host "`nReport saved to: $reportFile" -ForegroundColor Green
    Write-Host "For 3D visualization, open: column_l_3d_chart.html" -ForegroundColor Magenta
    
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Cleanup
    if ($workbook) { $workbook.Close($false) }
    if ($excel) { 
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
}

Write-Host "`nAnalysis Complete!" -ForegroundColor Green