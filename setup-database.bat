@echo off
REM Database Setup Script for Arunika Agentic AI

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ============================================
echo Database Setup - Arunika Agentic AI
echo ============================================
echo.

REM Step 1: Create Database
echo Step 1: Creating database 'arunika_agentic'...
psql -U postgres -c "CREATE DATABASE arunika_agentic;" 2>nul
if !errorlevel! equ 0 (
    echo [OK] Database created successfully
) else (
    echo [INFO] Database may already exist, continuing...
)

echo.
echo Step 2: Running migrations...
psql -U postgres -d arunika_agentic -f database-migrations.sql
if !errorlevel! equ 0 (
    echo [OK] Migrations completed successfully
) else (
    echo [ERROR] Migration failed
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying setup...
psql -U postgres -d arunika_agentic -c "SELECT COUNT(*) as division_count FROM divisions;"

echo.
echo ============================================
echo Database Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Stop the dev server (Ctrl+C)
echo 2. Run: npm run dev
echo 3. Refresh browser at http://localhost:3000
echo.

pause
