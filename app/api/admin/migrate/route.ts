/**
 * POST /api/admin/migrate
 * Jalankan database-migrations.sql untuk membuat semua tabel
 * GET  /api/admin/migrate
 * Cek apakah schema sudah ada (cek tabel divisions)
 */
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const PG_BIN_PATHS = [
  'C:\\Program Files\\PostgreSQL\\18\\bin',
  'C:\\Program Files\\PostgreSQL\\17\\bin',
  'C:\\Program Files\\PostgreSQL\\16\\bin',
  'C:\\Program Files\\PostgreSQL\\15\\bin',
];

const DB_USER = 'postgres';
const DB_HOST = 'localhost';
const DB_PORT = '5432';
const DB_NAME = 'arunika_agentic';
const DB_PASS = 'postgres';

async function findPsql(): Promise<string | null> {
  for (const binPath of PG_BIN_PATHS) {
    const psqlPath = `${binPath}\\psql.exe`;
    try {
      const { stdout } = await execAsync(
        `powershell -Command "Test-Path '${psqlPath}'"`,
        { timeout: 5000 }
      );
      if (stdout.trim() === 'True') return psqlPath;
    } catch { /* continue */ }
  }
  return null;
}

export async function GET() {
  try {
    // Quick check: apakah tabel divisions sudah ada?
    const { query } = await import('@/lib/database');
    const result = await query(
      `SELECT COUNT(*) as count FROM information_schema.tables
       WHERE table_schema = 'public'
       AND table_name IN ('divisions','tasks','approvals','messages','reports')`
    );
    const count = parseInt(result.rows[0].count);
    const tables = ['divisions', 'tasks', 'approvals', 'messages', 'reports'];

    // Get list of existing tables
    const existing = await query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
       AND table_name = ANY($1)`,
      [tables]
    );
    const existingNames = existing.rows.map((r: any) => r.table_name);

    return NextResponse.json({
      success: true,
      migrated: count >= 5,
      tablesFound: count,
      tablesExpected: 5,
      existingTables: existingNames,
      missingTables: tables.filter(t => !existingNames.includes(t)),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      migrated: false,
      error: error.message,
    });
  }
}

export async function POST() {
  const logs: string[] = [];

  try {
    // Cari psql.exe
    const psqlPath = await findPsql();
    if (!psqlPath) {
      return NextResponse.json({
        success: false,
        error: 'psql.exe tidak ditemukan di C:\\Program Files\\PostgreSQL\\{15-18}\\bin',
        logs,
      }, { status: 500 });
    }
    logs.push(`Found psql at: ${psqlPath}`);

    // Path ke migration file
    const migrationFile = path.join(process.cwd(), 'database-migrations.sql');
    logs.push(`Migration file: ${migrationFile}`);

    // Verify file exists
    try {
      const { stdout: fileCheck } = await execAsync(
        `powershell -Command "Test-Path '${migrationFile}'"`,
        { timeout: 5000 }
      );
      if (fileCheck.trim() !== 'True') {
        return NextResponse.json({
          success: false,
          error: `File tidak ditemukan: ${migrationFile}`,
          logs,
        }, { status: 500 });
      }
    } catch (e: any) {
      logs.push(`File check error: ${e.message}`);
    }

    // Jalankan migration via psql
    const cmd = `"${psqlPath}" -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -f "${migrationFile}" -v ON_ERROR_STOP=0 2>&1`;

    logs.push(`Running: psql -U ${DB_USER} -d ${DB_NAME} -f database-migrations.sql`);

    const { stdout, stderr } = await execAsync(cmd, {
      timeout: 60000,
      env: { ...process.env, PGPASSWORD: DB_PASS },
    });

    const output = (stdout + stderr).trim();
    logs.push(`psql output: ${output.substring(0, 500)}`);

    // Check jika ada error fatal
    const hasFatalError = output.includes('FATAL') || output.includes('could not connect');
    if (hasFatalError) {
      return NextResponse.json({
        success: false,
        error: 'psql gagal terkoneksi ke database',
        logs,
        output: output.substring(0, 1000),
      }, { status: 500 });
    }

    // Verify tables were created
    const { query } = await import('@/lib/database');
    const result = await query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
       AND table_name IN ('divisions','tasks','approvals','messages','reports')
       ORDER BY table_name`
    );
    const createdTables = result.rows.map((r: any) => r.table_name);
    logs.push(`Tables now in DB: ${createdTables.join(', ')}`);

    if (createdTables.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Migration dijalankan tapi tabel tidak terbuat. Cek output psql.',
        logs,
        output: output.substring(0, 1000),
      }, { status: 500 });
    }

    // Hitung divisions yang sudah di-insert
    let divisionCount = 0;
    try {
      const divResult = await query('SELECT COUNT(*) FROM divisions');
      divisionCount = parseInt(divResult.rows[0].count);
    } catch { /* table might need seeding */ }

    return NextResponse.json({
      success: true,
      message: `✅ Migration berhasil! ${createdTables.length} tabel dibuat.`,
      tablesCreated: createdTables,
      divisionsInserted: divisionCount,
      logs,
    });

  } catch (error: any) {
    logs.push(`Error: ${error.message}`);
    return NextResponse.json({
      success: false,
      error: error.message || 'Migration gagal',
      logs,
    }, { status: 500 });
  }
}
