@echo off
echo ========================================
echo Restarting H2BIS ProjectBrain API Server
echo ========================================
echo.

cd /d "c:\My_work\RnD\project_brain_prototype_node\h2bis-pb\h2bis-pb-api"

echo Step 1: Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting server...
echo Press Ctrl+C to stop the server
echo.
call npm start
