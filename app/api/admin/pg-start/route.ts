/**
 * POST /api/admin/pg-start
 * Coba start PostgreSQL service via `net start` (Windows)
 * GET  /api/admin/pg-start
 * Cek nama service PostgreSQL yang terdaftar
 */
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Nama service PostgreSQL yang umum di Windows
const PG_SERVICE_NAMES = [
  'postgresql-x64-17',
  'postgresql-x64-16',
  'postgresql-x64-15',
  'postgresql-x64-14',
  'postgresql-x64-13',
  'PostgreSQL',
  'postgres',
];

export async function GET() {
  const os = require('os');
  const path = require('path');

  // Diagnosa environment
  const env: Record<string, string> = {
    platform: os.platform(),
    release: os.release(),
    tmpdir: os.tmpdir(),
    cwd: process.cwd(),
    shell: process.env.SHELL || process.env.ComSpec || 'unknown',
    path: (process.env.PATH || '').substring(0, 200),
    isWsl: (process.env.WSL_DISTRO_NAME || process.env.WSLENV) ? 'YES' : 'NO',
  };

  // Test simple command
  const cmdTests: Record<string, string> = {};

  // Test uname (Linux/WSL)
  try {
    const { stdout } = await execAsync('uname -a', { timeout: 3000 });
    cmdTests['uname'] = stdout.trim();
  } catch (e: any) {
    cmdTests['uname'] = `fail: ${e.code || e.message?.substring(0, 50)}`;
  }

  // Test sc (Windows native)
  try {
    const { stdout } = await execAsync('sc query type= all state= all 2>&1 | head -20', { timeout: 5000 });
    cmdTests['sc'] = stdout.substring(0, 100);
  } catch (e: any) {
    cmdTests['sc'] = `fail: ${e.code || e.message?.substring(0, 80)}`;
  }

  // Test powershell
  try {
    const { stdout } = await execAsync('powershell -Command "Write-Output OK"', { timeout: 5000 });
    cmdTests['powershell'] = stdout.trim();
  } catch (e: any) {
    cmdTests['powershell'] = `fail: ${e.code || e.message?.substring(0, 80)}`;
  }

  // Test pg_ctl / pg_isready
  try {
    const { stdout } = await execAsync('pg_isready -h localhost -p 5432', { timeout: 5000 });
    cmdTests['pg_isready'] = stdout.trim();
  } catch (e: any) {
    cmdTests['pg_isready'] = `fail: ${e.code || e.message?.substring(0, 80)}`;
  }

  // Test pg via Windows path
  const winPgPaths = [
    'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_isready.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_isready.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_isready.exe',
  ];
  for (const pgPath of winPgPaths) {
    try {
      const { stdout } = await execAsync(`"${pgPath}" -h localhost -p 5432`, { timeout: 5000 });
      cmdTests[`pg_isready_win`] = `${pgPath}: ${stdout.trim()}`;
      break;
    } catch (e: any) {
      cmdTests[`pg_isready_win_${path.basename(path.dirname(path.dirname(pgPath)))}`] = `fail: ${e.code || e.message?.substring(0, 50)}`;
    }
  }

  // Test WSL interop - bisa panggil Windows exe dari WSL?
  if (env.isWsl === 'YES') {
    try {
      const { stdout } = await execAsync('cmd.exe /C "echo Windows_OK"', { timeout: 5000 });
      cmdTests['wsl_cmd_interop'] = stdout.trim();
    } catch (e: any) {
      cmdTests['wsl_cmd_interop'] = `fail: ${e.message?.substring(0, 80)}`;
    }

    try {
      const { stdout } = await execAsync('sc.exe query postgresql-x64-17 2>&1', { timeout: 5000 });
      cmdTests['wsl_sc_exe'] = stdout.substring(0, 150);
    } catch (e: any) {
      cmdTests['wsl_sc_exe'] = `fail: ${e.code || e.message?.substring(0, 80)}`;
    }
  }

  // ─── Deep scan via PowerShell ────────────────────────────────────────────
  const deepScan: Record<string, string> = {};

  // 1. What's listening on port 5432?
  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,State,OwningProcess | ConvertTo-Json"`,
      { timeout: 8000 }
    );
    deepScan['port5432'] = stdout.trim() || 'nothing_listening';
  } catch (e: any) {
    deepScan['port5432'] = `error: ${e.message?.substring(0, 80)}`;
  }

  // 2. All services (any name containing sql, data, pg, base)
  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-Service | Where-Object {$_.Name -match 'sql|pg|post|data|base' -or $_.DisplayName -match 'sql|Post|Data'} | Select-Object Name,Status,DisplayName | ConvertTo-Json"`,
      { timeout: 8000 }
    );
    deepScan['sqlRelatedServices'] = stdout.trim() || 'none';
  } catch (e: any) {
    deepScan['sqlRelatedServices'] = `error: ${e.message?.substring(0, 80)}`;
  }

  // 3. Find pg_ctl.exe anywhere on C: and P:
  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-ChildItem -Path C:\\,P:\\ -Filter pg_ctl.exe -Recurse -ErrorAction SilentlyContinue -Force 2>$null | Select-Object -First 5 FullName | ConvertTo-Json"`,
      { timeout: 20000 }
    );
    deepScan['pgCtlSearch'] = stdout.trim() || 'not_found';
  } catch (e: any) {
    deepScan['pgCtlSearch'] = `error: ${e.message?.substring(0, 80)}`;
  }

  // 4. Environment variables with postgres/pg hints
  try {
    const { stdout } = await execAsync(
      `powershell -Command "[System.Environment]::GetEnvironmentVariables() | Where-Object {$_.Keys -match 'PG|POSTGRES|DATA'}"`,
      { timeout: 5000 }
    );
    deepScan['pgEnvVars'] = stdout.trim() || 'none';
  } catch (e: any) {
    deepScan['pgEnvVars'] = `error: ${e.message?.substring(0, 80)}`;
  }

  // 5. Check registry for PostgreSQL
  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-ItemProperty 'HKLM:\\SOFTWARE\\PostgreSQL\\Installations\\*' -ErrorAction SilentlyContinue | ConvertTo-Json"`,
      { timeout: 8000 }
    );
    deepScan['registry'] = stdout.trim() || 'not_in_registry';
  } catch (e: any) {
    deepScan['registry'] = `error: ${e.message?.substring(0, 80)}`;
  }

  return NextResponse.json({
    success: true,
    environment: env,
    commandTests: cmdTests,
    deepScan,
    hint: 'Lihat deepScan untuk info lengkap lokasi PostgreSQL'
  });
}

export async function POST() {
  const attempts: string[] = [];

  // ─── Step 1: Temukan service PostgreSQL via PowerShell ───────────────────
  let targetService: string | null = null;
  let serviceStatus = '';

  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-Service | Where-Object {$_.Name -like '*postgr*' -or $_.DisplayName -like '*Postgr*'} | Select-Object Name, Status | ConvertTo-Json"`,
      { timeout: 10000 }
    );
    const trimmed = stdout.trim();
    if (trimmed) {
      attempts.push(`PS Get-Service: ${trimmed}`);
      const parsed = JSON.parse(trimmed.startsWith('[') ? trimmed : `[${trimmed}]`);
      const running = parsed.find((s: any) => s.Status === 4); // 4 = Running
      const stopped = parsed.find((s: any) => s.Status === 1); // 1 = Stopped
      if (running) {
        return NextResponse.json({
          success: true,
          message: `✅ PostgreSQL sudah berjalan (${running.Name})`,
          service: running.Name,
          status: 'already_running'
        });
      }
      if (stopped) {
        targetService = stopped.Name;
        serviceStatus = 'stopped';
      }
    }
  } catch (e: any) {
    attempts.push(`PS Get-Service error: ${e.message?.substring(0, 150)}`);
  }

  // ─── Step 2: Jika tidak ada service, coba pg_ctl langsung ─────────────────
  const pgBinPaths = [
    'C:\\Program Files\\PostgreSQL\\17\\bin',
    'C:\\Program Files\\PostgreSQL\\16\\bin',
    'C:\\Program Files\\PostgreSQL\\15\\bin',
    'C:\\Program Files\\PostgreSQL\\14\\bin',
  ];
  const pgDataPaths = [
    'C:\\Program Files\\PostgreSQL\\17\\data',
    'C:\\Program Files\\PostgreSQL\\16\\data',
    'C:\\Program Files\\PostgreSQL\\15\\data',
    'C:\\Program Files\\PostgreSQL\\14\\data',
  ];

  if (!targetService) {
    // Coba pg_ctl start dengan full path
    for (let i = 0; i < pgBinPaths.length; i++) {
      const pgCtl = `${pgBinPaths[i]}\\pg_ctl.exe`;
      const pgData = pgDataPaths[i];
      try {
        // Check if pg_ctl exists
        const { stdout: checkFile } = await execAsync(
          `powershell -Command "Test-Path '${pgCtl}'"`, { timeout: 5000 }
        );
        if (checkFile.trim() === 'True') {
          attempts.push(`Found pg_ctl at: ${pgCtl}`);
          // Check status first
          try {
            const { stdout: statusOut } = await execAsync(
              `"${pgCtl}" status -D "${pgData}"`, { timeout: 8000 }
            );
            attempts.push(`pg_ctl status: ${statusOut.trim()}`);
            if (statusOut.includes('server is running')) {
              return NextResponse.json({
                success: true,
                message: `✅ PostgreSQL sudah berjalan (pg_ctl)`,
                attempts
              });
            }
          } catch { /* status check failed */ }

          // Try starting
          const { stdout: startOut } = await execAsync(
            `"${pgCtl}" start -D "${pgData}" -w -t 30`,
            { timeout: 40000 }
          );
          attempts.push(`pg_ctl start: ${startOut.trim()}`);

          if (startOut.includes('server started') || startOut.includes('done')) {
            return NextResponse.json({
              success: true,
              message: `✅ PostgreSQL berhasil distart via pg_ctl! (${pgData})`,
              attempts
            });
          }
        }
      } catch (e: any) {
        attempts.push(`pg_ctl ${pgBinPaths[i]} error: ${e.message?.substring(0, 120)}`);
      }
    }
  }

  // ─── Step 3: Start service via PowerShell Start-Service ───────────────────
  if (targetService) {
    try {
      const { stdout } = await execAsync(
        `powershell -Command "Start-Service -Name '${targetService}'; Start-Sleep -Seconds 3; (Get-Service -Name '${targetService}').Status"`,
        { timeout: 30000 }
      );
      attempts.push(`Start-Service result: ${stdout.trim()}`);
      if (stdout.includes('Running')) {
        return NextResponse.json({
          success: true,
          message: `✅ PostgreSQL berhasil distart! (${targetService})`,
          service: targetService,
          attempts
        });
      }
    } catch (e: any) {
      attempts.push(`Start-Service error: ${e.message?.substring(0, 200)}`);
    }

    // Step 4: Try via net.exe with full path
    try {
      const { stdout } = await execAsync(
        `C:\\Windows\\System32\\net.exe start "${targetService}"`,
        { timeout: 30000 }
      );
      attempts.push(`net.exe start: ${stdout.trim()}`);
      return NextResponse.json({
        success: true,
        message: `✅ PostgreSQL started via net.exe (${targetService})`,
        service: targetService,
        attempts
      });
    } catch (e: any) {
      attempts.push(`net.exe error: ${e.message?.substring(0, 200)}`);
    }
  }

  // ─── Gagal semua ─────────────────────────────────────────────────────────
  // Cari nama service yang benar untuk instruksi manual
  let manualServiceName = 'postgresql-x64-17';
  try {
    const { stdout } = await execAsync(
      `powershell -Command "Get-Service | Where-Object {$_.Name -like '*postgr*'} | Select-Object -First 1 -ExpandProperty Name"`,
      { timeout: 5000 }
    );
    if (stdout.trim()) manualServiceName = stdout.trim();
  } catch { /* ignore */ }

  return NextResponse.json({
    success: false,
    error: 'Tidak dapat start PostgreSQL otomatis — perlu hak Administrator',
    attempts,
    manualSteps: [
      `1. Tekan Win+R, ketik: services.msc`,
      `2. Cari service: ${manualServiceName} (atau postgresql-x64-*)`,
      `3. Klik kanan → Start`,
      `ATAU buka Command Prompt sebagai Admin dan ketik:`,
      `   net start ${manualServiceName}`
    ]
  }, { status: 500 });
}
