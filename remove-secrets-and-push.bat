@echo off
REM Script untuk menghapus sensitive files dan push ke GitHub

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ============================================
echo Remove Secrets and Push to GitHub
echo ============================================
echo.
echo Removing sensitive files from commit...
echo.

REM Unstage sensitive files
echo Unstaging config/gcp-gmail-sa.json...
git reset HEAD config/gcp-gmail-sa.json 2>nul

echo Unstaging config/gcp-service-account.json...
git reset HEAD config/gcp-service-account.json 2>nul

echo Unstaging config/api-keys.json...
git reset HEAD config/api-keys.json 2>nul

echo.
echo Deleting sensitive files from disk...

REM Delete sensitive files
if exist "config\gcp-gmail-sa.json" (
    del /f /q "config\gcp-gmail-sa.json"
    echo [✓] Deleted config/gcp-gmail-sa.json
)

if exist "config\gcp-service-account.json" (
    del /f /q "config\gcp-service-account.json"
    echo [✓] Deleted config/gcp-service-account.json
)

if exist "config\api-keys.json" (
    del /f /q "config\api-keys.json"
    echo [✓] Deleted config/api-keys.json
)

echo.
echo Adding .gitignore entries...

REM Create/update .gitignore to exclude sensitive files
(
    echo config/gcp-gmail-sa.json
    echo config/gcp-service-account.json
    echo config/api-keys.json
) >> .gitignore

echo [✓] Updated .gitignore
echo.

echo Staging changes...
git add .gitignore
if !errorlevel! neq 0 (
    echo ERROR: Failed to stage .gitignore
    pause
    exit /b 1
)
echo [✓] .gitignore staged
echo.

echo Committing...
git commit -m "Add divisional management system with integrated sidebar - remove sensitive credentials from version control"
if !errorlevel! neq 0 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)
echo [✓] Commit successful
echo.

echo Pushing to GitHub...
git push origin main
if !errorlevel! neq 0 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)
echo [✓] Push successful!
echo.

echo ============================================
echo SUCCESS!
echo ============================================
echo.
echo Divisional Management System pushed to GitHub
echo Repository: https://github.com/rachmat165/arunikaagentic.git
echo Branch: main
echo.

pause
