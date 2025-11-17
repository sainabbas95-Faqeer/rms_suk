SPD Dashboard Usage Instructions
===============================

There are two ways to use the SPD Dashboard:

Method 1: Recommended - Using Local Web Server (Accurate Data)
------------------------------------------------------------
1. Double-click on "start_server.bat" to start the local web server
2. Open your browser (Chrome, Edge, Firefox) and go to:
   http://localhost:8000/spd_dashboard.html
3. The dashboard will automatically load data from DB.xlsx

Method 2: Direct File Access (Auto-Loading Available)
----------------------------------------------------
1. Double-click on "spd_dashboard.html" to open it directly
2. The dashboard will automatically attempt to load DB.xlsx using multiple methods:
   - File System Access API (modern browsers like Chrome/Edge)
   - Direct fetch request (works in some browsers)
   - XMLHttpRequest (alternative method for better compatibility)
   - Manual file selection (if automatic methods fail)
3. If automatic loading works, no user interaction is required
4. If automatic loading fails, a minimal upload icon will appear in the top-right corner

Features:
--------
- Auto-loading: The dashboard attempts to load DB.xlsx automatically using modern browser APIs
- Minimal UI: Only shows upload icon on error (not full upload interface)
- Smart fallback: If auto-loading fails, provides minimal manual upload option
- Persistent reference: Remembers the last file name for reference
- Cross-browser support: Works with modern browsers (Chrome, Edge, Firefox, Safari)
- Three-chart layout: Displays all charts in a responsive grid layout

Dashboard Content:
-----------------
1. Statistics Cards: Shows key SPD alarm metrics
2. SPD Alarms By Aging: Pie chart showing distribution by aging categories
3. SPD alarms - Reasons: Bar chart showing alarm reasons (Column K data)
4. SPD Alarms - Region Wise: Bar chart showing alarms by region (Column C data)

Troubleshooting:
---------------
- If you see sample data instead of real data, it means the DB.xlsx file wasn't loaded
- When opening files directly (file://), browsers may block automatic file access for security
- For best experience, always use Method 1 with the local web server
- Refresh the page to retry auto-loading
- Click the upload icon in the top-right corner if auto-loading fails

File Locations:
--------------
- Dashboard: spd_dashboard.html
- Data Source: DB.xlsx
- Local Server Script: start_server.bat
- Server Script: server.js

For any issues, check the browser's developer console (F12) for error messages.