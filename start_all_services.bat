@echo off
echo ========================================================
echo [Continue Project] Call Center System Startup
echo ========================================================
echo.

echo [Step 1] Killing existing processes on ports...

:: Kill port 8081
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :8081 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 8081
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill port 8082
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :8082 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 8082
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill port 5173
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 5173
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill port 5174
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :5174 ^| findstr LISTENING') do (
    echo Killing PID %%a on port 5174
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [Step 2] Starting Backend Services...

:: Start Issuer WAS (8081)
echo Starting Issuer WAS on port 8081...
start "Issuer-WAS-8081" cmd /k "cd /d %~dp0issuer-was && call gradlew.bat bootRun"

:: Start CallCenter WAS (8082)
echo Starting CallCenter WAS on port 8082...
start "CallCenter-WAS-8082" cmd /k "cd /d %~dp0callcenter-was && call gradlew.bat bootRun"

echo.
echo Waiting 5 seconds for backends to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [Step 3] Starting Frontend Services...

:: Start CallCenter Web (5173)
echo Starting CallCenter Web on port 5173...
start "CallCenter-Web-5173" cmd /k "cd /d %~dp0callcenter-web && npm run dev"

:: Start Issuer Web (5174)
echo Starting Issuer Web on port 5174...
start "Issuer-Web-5174" cmd /k "cd /d %~dp0issuer-web && npm run dev"

echo.
echo ========================================================
echo All services have been started!
echo Check the new command windows for status.
echo ========================================================
echo.
pause
