@echo off
REM Clean reset to remove commits with secrets

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ============================================
echo Clean Reset and Push
echo ============================================
echo.
echo Resetting to last clean commit...
echo.

REM Reset to origin/main (last clean commit)
git reset --soft 2e23d6d

echo Staging divisional management files...
git add app/
git add components/sidebar.tsx
git add components/DivisionalContent.tsx
git add components/DivisionalSidebar.tsx
git add .gitignore
git add IMPLEMENTATION-GUIDE.md
git add README-DIVISIONAL-SYSTEM.md
git add sidebar-menu-design.md
git add database-migrations.sql
git add backend-api-examples.ts

echo Excluding config files...
git reset HEAD config/ 2>nul

echo.
echo Removing config files from disk...
rmdir /s /q "config" 2>nul

echo.
echo Committing...
git commit -m "Add divisional management system with integrated sidebar - complete implementation with API-ready structure, no credentials in version control"
if !errorlevel! neq 0 (
    echo ERROR: Commit failed
    pause
    exit /b 1
)

echo.
echo Force pushing to GitHub (rewriting history)...
git push --force-with-lease origin main
if !errorlevel! neq 0 (
    echo ERROR: Push failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo SUCCESS!
echo ============================================
echo.
echo Clean history pushed to GitHub
echo Repository: https://github.com/rachmat165/arunikaagentic.git
echo.

pause
