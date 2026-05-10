@echo off
REM Force cleanup dan push ke GitHub

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo Cleaning all lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
del /f /q ".git\refs\remotes\origin\main.lock" 2>nul

REM Clean git objects locks
for /r ".git\objects" %%F in (*.lock) do del /f /q "%%F" 2>nul

echo Waiting 2 seconds...
timeout /t 2 /nobreak

echo.
echo Removing git index and refstash for clean state...
del /f /q ".git\index" 2>nul

REM Reset hard to last known good state
git reset --hard HEAD~0 2>nul

echo.
echo Staging changes...
git add -A

echo.
echo Committing...
git commit -m "Add divisional management system: integrated sidebar with three divisions and API-ready structure"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Completed!
pause
