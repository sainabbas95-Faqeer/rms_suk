@echo off
title SPD Dashboard Server
echo ==========================================
echo SPD ALARM ANALYSIS DASHBOARD
echo ==========================================
echo.
echo Starting local web server...
echo.
echo Open your browser and go to: http://localhost:8000/spd_dashboard.html
echo.
echo For direct file access (auto-loading available):
echo Double-click on spd_dashboard.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server...
    echo.
    python -m http.server 8000
    goto :eof
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js server...
    echo.
    node server.js
    goto :eof
)

echo Neither Python nor Node.js found.
echo.
echo Please install Python or Node.js to run the local server.
echo.
echo Alternative: Double-click on spd_dashboard.html for direct file access
echo (auto-loading will be attempted)
echo.
pause