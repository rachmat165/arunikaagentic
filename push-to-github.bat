@echo off
REM Script untuk push ke GitHub setelah cleanup

setlocal enabledelayedexpansion

REM Get the directory of this script
set SCRIPT_DIR=%~dp0

echo.
echo ============================================
echo Git Commit and Push Script
echo ============================================
echo.
echo Target Directory: %SCRIPT_DIR%
echo.

REM Navigate to project directory
cd /d "%SCRIPT_DIR%"

if not exist ".git" (
    echo ERROR: Folder .git tidak ditemukan!
    pause
    exit /b 1
)

echo Step 1: Staging all changes...
git add -A
if !errorlevel! neq 0 (
    echo ERROR: Gagal staging changes
    pause
    exit /b 1
)
echo [✓] Changes staged successfully
echo.

echo Step 2: Committing changes...
git commit -m "Add divisional management system: integrated sidebar menu with three divisions (CEO, Sales, Operations), collapsible submenus for Tasks/Mailbox/Reports/Approvals, removed mock data, prepared API endpoints"
if !errorlevel! neq 0 (
    echo ERROR: Gagal commit
    pause
    exit /b 1
)
echo [✓] Commit successful
echo.

echo Step 3: Pushing to GitHub...
git push origin main
if !errorlevel! neq 0 (
    echo ERROR: Gagal push ke GitHub
    echo Pastikan Anda punya akses internet dan credentials GitHub sudah ter-setup
    pause
    exit /b 1
)
echo [✓] Push successful
echo.

echo ============================================
echo SUCCESS! Code pushed to GitHub
echo ============================================
echo.
echo Repository: https://github.com/rachmat165/arunikaagentic.git
echo Branch: main
echo.

pause
