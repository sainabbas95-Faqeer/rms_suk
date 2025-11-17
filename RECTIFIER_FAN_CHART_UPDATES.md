# Rectifier Fan Dashboard Chart Updates

## Changes Made

### 1. Pie Chart Title Update
- **Original**: "Rectifier Fan Status"
- **Updated**: "Rectifier Fan Alarms - Aging"

### 2. Data Source Change
- **Original**: Used Column G (Status) for pie chart data
- **Updated**: Now uses Column F (Aging) for pie chart data

### 3. Aging Category Sorting
- Added logical sorting for aging categories:
  1. 01 - 10 Days
  2. 11 - 30 Days
  3. 31 - 100 Days
  4. 100+ Days
  5. 180+ Days

### 4. Card Click Functionality
- Ensured all cards open the details page with the correct filter when clicked
- Maintained existing functionality for all card interactions

## Files Updated

1. **rectifier_fan_dashboard.html**
   - Updated pie chart title in HTML
   - Modified `analyzeRectifierFanData()` function to use Column F for aging data
   - Updated `sortStatusCategories()` function for proper aging category sorting
   - Updated `createStatusPieChart()` function to reflect new naming

## Technical Details

### Data Mapping
- **Column F (Index 5)**: Aging information (used for pie chart)
- **Column G (Index 6)**: Fan status (Working, Faulty, Maintenance, etc.)
- **Column C (Index 2)**: Region information
- **Column K (Index 10)**: Reason/Issue information

### Aging Categories
The pie chart now properly displays aging categories from Column F with the following sorting order:
1. 01 - 10 Days
2. 11 - 30 Days
3. 31 - 100 Days
4. 100+ Days
5. 180+ Days
6. Other categories (alphabetically)

### Card Functionality
All dashboard cards maintain their click functionality to open the details page with the appropriate filter:
- Total Fan Alarms card
- Fan Alarms - Enfra End card
- Fan Alarms - SMS LD End card
- Fan Alarms - Resolved card
- Fan Alarms - Others card

## Benefits
1. **Accurate Data Representation**: Pie chart now correctly displays aging data from Column F
2. **Logical Sorting**: Aging categories are displayed in a meaningful order
3. **Consistent Naming**: Chart title matches the dashboard naming convention
4. **Enhanced User Experience**: Users can click any card to view related entries
5. **Better Data Visualization**: Aging information is now the primary focus of the pie chart

## Testing
The changes have been implemented to maintain consistency with the existing SPD dashboard functionality while providing the specific aging data visualization requested.