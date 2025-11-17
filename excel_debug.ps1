# PowerShell script to debug Excel file
Write-Host "Debugging Excel file..."

# Try to load the Excel file and show sheet names
try {
    # Use .NET to read Excel file
    Add-Type -AssemblyName "Microsoft.Office.Interop.Excel"
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $workbook = $excel.Workbooks.Open("c:\Users\Bahadur Ali - SMS LD\Desktop\RMS\DB.xlsx")
    
    Write-Host "Sheet names:"
    foreach ($sheet in $workbook.Worksheets) {
        Write-Host "  - $($sheet.Name)"
    }
    
    # Show first few rows of first sheet
    $worksheet = $workbook.Worksheets.Item(1)
    Write-Host "`nFirst sheet data (first 5 rows):"
    for ($row = 1; $row -le 5; $row++) {
        $rowData = @()
        for ($col = 1; $col -le 10; $col++) {
            $cellValue = $worksheet.Cells.Item($row, $col).Text
            $rowData += $cellValue
        }
        Write-Host "  Row $row`: $($rowData -join ' | ')"
    }
    
    $workbook.Close()
    $excel.Quit()
} catch {
    Write-Host "Error reading Excel file with COM: $($_.Exception.Message)"
    
    # Try alternative method
    Write-Host "`nTrying alternative method..."
    try {
        # Check if file exists
        if (Test-Path "c:\Users\Bahadur Ali - SMS LD\Desktop\RMS\DB.xlsx") {
            Write-Host "DB.xlsx file exists"
            $fileInfo = Get-Item "c:\Users\Bahadur Ali - SMS LD\Desktop\RMS\DB.xlsx"
            Write-Host "File size: $($fileInfo.Length) bytes"
        } else {
            Write-Host "DB.xlsx file does not exist"
        }
    } catch {
        Write-Host "Error with alternative method: $($_.Exception.Message)"
    }
}

Write-Host "`nDebug complete."