# ============================================================
#  Arunika Agentic AI — Setup PostgreSQL Database
#  Jalankan sebagai Administrator (klik kanan → Run as Admin)
# ============================================================

Write-Host "`n=== Arunika Agentic AI Database Setup ===" -ForegroundColor Cyan
Write-Host "PT. Arunika Teknologi Global`n" -ForegroundColor Cyan

# ─── 1. Cek apakah PostgreSQL sudah terinstall ───────────────
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
$pgExe = Get-Command pg_isready -ErrorAction SilentlyContinue

if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "[OK] PostgreSQL sudah berjalan." -ForegroundColor Green
} elseif ($pgService) {
    Write-Host "[FOUND] PostgreSQL terinstall tapi tidak berjalan. Mencoba start..." -ForegroundColor Yellow
    try {
        Start-Service -Name $pgService.Name
        Write-Host "[OK] PostgreSQL berhasil distart: $($pgService.Name)" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Gagal start: $_" -ForegroundColor Red
    }
} else {
    Write-Host "[INSTALL] PostgreSQL tidak ditemukan. Menginstall via winget..." -ForegroundColor Yellow

    # Coba install via winget
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if ($winget) {
        Write-Host "Menginstall PostgreSQL 17..." -ForegroundColor Yellow
        winget install -e --id PostgreSQL.PostgreSQL.17 `
            --accept-package-agreements `
            --accept-source-agreements `
            --override "--mode unattended --superpassword postgres --serverport 5432"

        Write-Host "`nInstallasi selesai. Menunggu service..." -ForegroundColor Green
        Start-Sleep -Seconds 5

        # Refresh environment
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    } else {
        Write-Host "`n[ERROR] winget tidak tersedia." -ForegroundColor Red
        Write-Host "Silakan download PostgreSQL manual dari:" -ForegroundColor Yellow
        Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor White
        Write-Host "`nPastikan:" -ForegroundColor Yellow
        Write-Host "  - Password superuser: postgres" -ForegroundColor White
        Write-Host "  - Port: 5432" -ForegroundColor White
        Write-Host "`nSetelah install, jalankan script ini lagi." -ForegroundColor Yellow
        Read-Host "Tekan Enter untuk keluar"
        exit 1
    }
}

# ─── 2. Tunggu PostgreSQL ready ──────────────────────────────
Write-Host "`nMenunggu PostgreSQL siap..." -ForegroundColor Yellow
$pgBins = @(
    "C:\Program Files\PostgreSQL\17\bin",
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin"
)
$pgBin = $pgBins | Where-Object { Test-Path "$_\psql.exe" } | Select-Object -First 1

if (-not $pgBin) {
    # Coba dari PATH
    $pgReady = Get-Command pg_isready -ErrorAction SilentlyContinue
    if ($pgReady) { $pgBin = Split-Path $pgReady.Source }
}

if (-not $pgBin) {
    Write-Host "[ERROR] Tidak menemukan psql.exe. Install mungkin belum selesai." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

$psql = "$pgBin\psql.exe"
$pgIsReady = "$pgBin\pg_isready.exe"

# Poll sampai siap (max 30 detik)
$maxWait = 30
$waited = 0
while ($waited -lt $maxWait) {
    $result = & $pgIsReady -h localhost -p 5432 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] PostgreSQL siap menerima koneksi!" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 2
    $waited += 2
    Write-Host "  Menunggu... ($waited/$maxWait detik)" -ForegroundColor Gray
}

if ($waited -ge $maxWait) {
    Write-Host "[ERROR] PostgreSQL tidak merespons setelah $maxWait detik." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# ─── 3. Buat database arunika_agentic ────────────────────────
Write-Host "`nMembuat database 'arunika_agentic'..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres"

# Cek apakah database sudah ada
$dbExists = & $psql -U postgres -h localhost -p 5432 -tAc "SELECT 1 FROM pg_database WHERE datname='arunika_agentic'" 2>&1
if ($dbExists -match "1") {
    Write-Host "[OK] Database 'arunika_agentic' sudah ada." -ForegroundColor Green
} else {
    & $psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE arunika_agentic ENCODING 'UTF8' LC_COLLATE 'en-US' LC_CTYPE 'en-US' TEMPLATE template0" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database 'arunika_agentic' berhasil dibuat!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Gagal membuat database. Coba buat manual:" -ForegroundColor Red
        Write-Host "  createdb -U postgres arunika_agentic" -ForegroundColor White
    }
}

# ─── 4. Tampilkan hasil ──────────────────────────────────────
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " SETUP SELESAI!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Database URL: postgres://postgres:postgres@localhost:5432/arunika_agentic"
Write-Host ""
Write-Host " Langkah selanjutnya:"
Write-Host " 1. Buka browser ke: http://localhost:3001/admin"
Write-Host " 2. Klik tombol 'Seed Data' untuk mengisi data awal"
Write-Host " 3. Buka http://localhost:3001/ dan test fitur"
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Read-Host "Tekan Enter untuk selesai"
