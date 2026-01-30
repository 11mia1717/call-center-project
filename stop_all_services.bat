@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo [Continue Project] Stopping Call Center System
echo ========================================================
echo.

echo [Step 1] Terminating Backend Ports (8081, 8082)...
for %%p in (8081 8082) do (
    for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing PID %%a on port %%p
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo [Step 2] Terminating Frontend Ports (5173, 5174)...
for %%p in (5173 5174) do (
    for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :%%p ^| findstr LISTENING') do (
        echo Killing PID %%a on port %%p
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo ========================================================
echo Call Center services stopped.
echo ========================================================
pause
