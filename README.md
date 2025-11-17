# 📊 Excel Data Dashboard - User Guide

## Overview
This dashboard automatically analyzes your DB.xlsx file and provides interactive visualizations for Column L (Enfra/SMS LD) analysis and regional distribution.

## 🚀 Quick Start

### Method 1: Automatic Loading (Recommended)
1. Simply open **`column_l_3d_chart.html`** in your browser
2. The dashboard will **automatically load DB.xlsx** from the same folder
3. No need to upload the file after refresh - it auto-loads every time!

### Method 2: Manual Upload
If DB.xlsx is in a different location:
1. Open **`column_l_3d_chart.html`**
2. Drag and drop your Excel file or click "Choose Excel File"
3. View the analysis results

## 📈 Dashboard Features

### 1. Statistics Cards
- **Enfra Count**: Total number of Enfra entries in Column L
- **SMS LD Count**: Total number of SMS LD entries in Column L
- **Others Count**: Other entries
- **Total Records**: Total rows analyzed

### 2. 3D Pie Chart (Left Side)
- Visual distribution of Enfra vs SMS LD vs Others
- Hover over slices to see exact counts and percentages
- Download button to save the chart as PNG

### 3. Regional Distribution Bar Graph (Right Side)
Shows the breakdown of Enfra and SMS LD by regions from Column D:

**Example:**
- **Enfra (26 total)**:
  - Larkana: 8
  - Jacobabad: 7
  - Sukkur: 9
  - Others: 2

- **SMS LD (count)**:
  - Region breakdown from Column D

The bar graph displays:
- 🏢 Red bars for Enfra regions
- 📱 Blue bars for SMS LD regions
- Side-by-side comparison of regional distribution
- Top 10 regions with highest counts
- Percentage of total for each region

### 4. Data Export
- **Download Chart**: Save the pie chart as PNG image
- **Download Analysis**: Export detailed analysis report as text file

## 📂 File Structure

```
RMS/
├── DB.xlsx                      # Your Excel data file
├── column_l_3d_chart.html       # Main dashboard (auto-loads DB.xlsx)
├── dashboard.html               # General purpose dashboard
├── python_dashboard.py          # Python version (requires Python)
├── column_l_analysis.py         # Python analysis script
├── analyze_column_l.ps1         # PowerShell analysis script
└── README.md                    # This file
```

## 🔍 Column Mapping

- **Column D**: Regions/Clusters (Larkana, Jacobabad, Sukkur, etc.)
- **Column L**: Organization (Enfra, SMS LD, Others)

## 💡 Tips

1. **No Upload Needed**: The dashboard automatically loads DB.xlsx on page load
2. **Refresh Safe**: Just refresh the page - data auto-loads again
3. **Multiple Views**: Use both pie chart (overall) and bar graph (detailed regional breakdown)
4. **Interactive Charts**: Hover over any chart element for detailed information
5. **Export Data**: Download charts and reports for presentations

## 🛠️ Alternative Tools

### PowerShell Script
For command-line analysis:
```powershell
PowerShell -ExecutionPolicy Bypass -File analyze_column_l.ps1
```

### Python Script
When Python is installed:
```bash
python column_l_analysis.py
```

## 📊 Understanding the Results

### Regional Distribution Bar Chart
The bar chart shows **grouped bars** where:
- Each region (cluster) from Column D appears on the X-axis
- Two bars per region:
  - **Red bar**: Count of Enfra entries in that region
  - **Blue bar**: Count of SMS LD entries in that region
- Height of bar indicates the count
- Tooltip shows exact count and percentage

### Example Interpretation
If you see:
- **Larkana**: Red bar (height 8), Blue bar (height 5)
  - Means: 8 Enfra entries and 5 SMS LD entries in Larkana
  - Percentage shows what % this represents of total Enfra/SMS LD

## 🔄 Auto-Load Feature

The dashboard uses browser fetch API to automatically load DB.xlsx:
- Checks for DB.xlsx in the same directory
- Loads and analyzes data automatically
- No manual upload needed after page refresh
- Falls back to manual upload if file not found

## 📞 Support

If you encounter any issues:
1. Ensure DB.xlsx is in the same folder as column_l_3d_chart.html
2. Check browser console (F12) for error messages
3. Try manual upload if auto-load fails
4. Use PowerShell script as alternative

## 🎯 Key Benefits

✅ **No Upload After Refresh**: Auto-loads DB.xlsx every time  
✅ **Dual Visualization**: Pie chart + Bar graph for comprehensive analysis  
✅ **Regional Breakdown**: See Enfra/SMS LD distribution by clusters  
✅ **Interactive**: Hover for details, click to explore  
✅ **Export Ready**: Download charts and reports  
✅ **Fast & Responsive**: Works entirely in browser  

---

**Version**: 2.0  
**Last Updated**: 2025-10-11  
**Compatible Browsers**: Chrome, Firefox, Edge, Safari
