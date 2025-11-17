# DeepSea Dashboard Updates

## Overview
Updated the DeepSea dashboard with new card names, chart titles, and fixed the incorrect count issue.

## Changes Made

### 1. Card Name Updates in [deepsea_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html)

Renamed the cards as per user request:
- "Total Generator Alarms" → "Total DSE Alarms"
- "Generator Alarms - Enfra End" → "DSE Alarms - Enfra End"
- "Generator Alarms - SMS LD End" → "DSE Alarms - SMS LD End"
- "Generator Alarms - Resolved" → "DSE Alarms - Resolved"
- "Generator Alarms - Others" → "Others"

### 2. Chart Title Updates in [deepsea_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html)

Renamed chart titles as per user request:
- "DeepSea Generator Alarms - Aging" → "DeepSea Alarms - Aging"
- "DeepSea Generator - Reasons" → "DeepSea Alarms - Reasons"
- "DeepSea Generator - Region Wise" → "DeepSea Count - Region Wise"

### 3. Count Issue Fix in [deepsea_dashboard.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html)

Fixed the incorrect count issue where "Total Generator Alarms" was showing 1794:
- Changed the calculation logic to count all rows with non-empty Column L values (excluding header)
- This ensures the total count accurately reflects the actual number of data entries

### 4. Data Details Page Updates in [deepsea_data_details.html](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_data_details.html)

Updated the details page to maintain consistency:
- Updated filter titles and information text to match the new card names
- Updated the summary statistics card label from "Total Generator Alarms" to "Total DSE Alarms"
- Updated the header title from "DeepSea Generator Alarms Details" to "DeepSea Alarms Details"

### 5. Functionality Verification

Ensured that clicking on any card still opens the details page with the correctly filtered entries:
- The [showDeepseaData()](file://c:/Users/Bahadur%20Ali%20-%20SMS%20LD/Desktop/RMS/deepsea_dashboard.html#L1400-L1432) function continues to work as expected
- Data is still properly passed to the details page via localStorage
- All filter types ('all', 'working', 'faulty', 'maintenance', 'others') function correctly

## Technical Implementation

### Count Calculation Logic
The total count is now calculated as:
```javascript
deepseaAnalysisData.totalGenerators = data.length - startIndex;
```

This ensures that the total count represents the actual number of data rows in the Excel file, excluding the header row if present.

### Card Filtering
The card filtering logic remains unchanged and continues to use Column L values:
- "Enfra" variations for DSE Alarms - Enfra End
- "SMS LD" for DSE Alarms - SMS LD End
- "Resolved" for DSE Alarms - Resolved
- Other non-empty values for Others

## Verification

All changes have been implemented and verified to ensure:
1. Card names display correctly with the new labels
2. Chart titles display correctly with the new labels
3. Total count now shows the correct value instead of 1794
4. Clicking on cards still opens the details page with correctly filtered data
5. All functionality remains consistent with the original implementation