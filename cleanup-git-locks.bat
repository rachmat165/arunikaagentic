@echo off
REM Script untuk membersihkan Git lock files
REM Jalankan script ini dari Command Prompt atau double-click

setlocal enabledelayedexpansion

REM Get the directory of this script
set SCRIPT_DIR=%~dp0

echo.
echo ============================================
echo Git Lock Files Cleanup Script
echo ============================================
echo.
echo Target Directory: %SCRIPT_DIR%
echo.

REM Navigate to project directory
cd /d "%SCRIPT_DIR%"

if not exist ".git" (
    echo ERROR: Folder .git tidak ditemukan di directory ini!
    echo Pastikan script dijalankan dari root project directory.
    pause
    exit /b 1
)

echo Cleaning up Git lock files...
echo.

REM Delete index.lock
if exist ".git\index.lock" (
    echo Menghapus: .git\index.lock
    del ".git\index.lock" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [✓] .git\index.lock berhasil dihapus
    ) else (
        echo [✗] Gagal menghapus .git\index.lock
    )
) else (
    echo [✓] .git\index.lock tidak ditemukan (sudah bersih)
)

echo.

REM Delete HEAD.lock
if exist ".git\HEAD.lock" (
    echo Menghapus: .git\HEAD.lock
    del ".git\HEAD.lock" >nul 2>&1
    if !errorlevel! equ 0 (
        echo [✓] .git\HEAD.lock berhasil dihapus
    ) else (
        echo [✗] Gagal menghapus .git\HEAD.lock
    )
) else (
    echo [✓] .git\HEAD.lock tidak ditemukan (sudah bersih)
)

echo.

REM Clean up temporary object files
echo Membersihkan temporary object files...
for /r ".git\objects" %%F in (tmp_obj_*) do (
    echo Menghapus: %%F
    del "%%F" >nul 2>&1
)

echo.
echo ============================================
echo Cleanup selesai!
echo ============================================
echo.
echo Anda sekarang bisa melanjutkan dengan git commit dan push.
echo.

pause
