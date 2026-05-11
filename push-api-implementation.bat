@echo off
REM Push API implementation for divisional management system

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ============================================
echo Pushing API Implementation
echo ============================================
echo.

echo Staging API route files...
git add app/api/divisions/[divisionId]/tasks/route.ts
git add app/api/divisions/[divisionId]/messages/route.ts
git add app/api/divisions/[divisionId]/reports/route.ts
git add app/api/divisions/[divisionId]/approvals/route.ts

echo Staging updated component...
git add components/DivisionalContent.tsx

echo Staging environment and config templates...
git add .env.local.example
git add config/config.template.json

echo Staging API documentation...
git add API-ENDPOINTS.md

echo.
echo Checking status...
git status

echo.
echo Committing changes...
git commit -m "Implement API routes for divisional management system: tasks, messages, reports, and approvals with pagination support and error handling"
if !errorlevel! neq 0 (
    echo ERROR: Commit failed
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub...
git push origin main
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
echo API implementation pushed to GitHub
echo Repository: https://github.com/rachmat165/arunikaagentic.git
echo.
echo New API Endpoints:
echo - GET /api/divisions/{divisionId}/tasks
echo - GET /api/divisions/{divisionId}/messages
echo - GET /api/divisions/{divisionId}/reports
echo - GET /api/divisions/{divisionId}/approvals
echo.

pause
