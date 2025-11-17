# DeepSea Dashboard Creation

## Overview
Created a new DeepSea dashboard that mirrors the structure and functionality of the existing Rectifier Fan dashboard. This dashboard will be linked to the "DeepSea Data Base" button on the welcome page.

## Files Created

### 1. [deepsea_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html)
- Main dashboard page for DeepSea generator data analysis
- Mirrors the structure and functionality of [rectifier_fan_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/rectifier_fan_dashboard.html)
- Features:
  - Colorful statistics cards with hover effects
  - 3D pie chart for aging analysis
  - Bar charts for reasons and region-wise analysis
  - Export functionality (Excel and PDF)
  - Responsive design for all screen sizes
  - Automatic data loading from DSE.xlsx
  - Visit counter with localStorage
  - Back button navigation

### 2. [deepsea_data_details.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_data_details.html)
- Details page for viewing filtered DeepSea data
- Mirrors the structure and functionality of [rectifier_fan_data_details.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/rectifier_fan_data_details.html)
- Features:
  - Filtered data display based on card clicks
  - Data table with proper column mapping
  - Summary statistics cards
  - Direct data loading from DSE.xlsx
  - Debug information panel (hidden by default)

## Files Modified

### 3. [welcome.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/welcome.html)
- Updated the "DeepSea Data Base" button to link to the new dashboard
- Removed the "Under Construction" badge

## Key Features Implemented

### Data Analysis
- Total Generator Alarms count
- Generator Alarms - Enfra End count
- Generator Alarms - SMS LD End count
- Generator Alarms - Resolved count
- Generator Alarms - Others count
- Aging analysis pie chart
- Reason/category bar chart
- Region-wise bar chart

### UI/UX Features
- Consistent styling with the existing dashboards
- Responsive design for all screen sizes
- Animated elements and hover effects
- Clear data visualization with Chart.js
- Intuitive navigation between dashboard and details pages

### Technical Implementation
- Data loading from DSE.xlsx file
- Robust character encoding handling for special characters
- LocalStorage for data passing between pages
- Error handling and fallback mechanisms
- Sample data initialization for development/testing

## Usage Instructions

1. Place the DSE.xlsx file in the same directory as the HTML files
2. Open [deepsea_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html) in a web browser
3. The dashboard will automatically load and analyze the data from DSE.xlsx
4. Click on any statistics card to view detailed filtered data
5. Use the export buttons to export data to Excel or PDF formats

## Data Structure Assumptions

The implementation assumes the DSE.xlsx file follows a similar structure to the Rectifier Fan data:
- Column A: Site Id
- Column B: Sub Region
- Column C: Region
- Column D: Installation Date
- Column E: Days Running
- Column F: Aging information (for pie chart)
- Column G: Status
- Column H: ES POC
- Column J: History/Issue
- Column K: Reasons (for domain chart)
- Column L: Additional information (for card filtering)

The card filtering is based on Column L values:
- "Enfra" variations for Generator Alarms - Enfra End
- "SMS LD" for Generator Alarms - SMS LD End
- "Resolved" for Generator Alarms - Resolved
- Other non-empty values for Generator Alarms - Others