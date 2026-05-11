/**
 * POST /api/admin/seed
 * Seed data divisi ke database.
 * Panggil sekali dari browser: fetch('/api/admin/seed', {method:'POST'})
 * atau klik tombol seed di halaman admin.
 * HANYA untuk environment development.
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Seed tidak diizinkan di production' }, { status: 403 });
  }

  const results: string[] = [];

  // Diagnosa env
  const dbUrl = process.env.DATABASE_URL;
  results.push(`ℹ️ DATABASE_URL: ${dbUrl ? dbUrl.replace(/:([^@]+)@/, ':***@') : 'TIDAK ADA!'}`);

  if (!dbUrl) {
    return NextResponse.json({
      success: false,
      error: 'DATABASE_URL tidak ditemukan di environment variables. Pastikan .env.local sudah benar.',
      results,
    }, { status: 500 });
  }

  try {
    // Test koneksi dasar
    await query('SELECT 1 as ping');
    results.push('✅ Koneksi DB: OK');

    // 1. Pastikan divisions ada
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await query(`
      INSERT INTO divisions (name, slug, description, icon, status, sort_order)
      VALUES
        ('CEO Office', 'ceo-office', 'Kantor CEO dan kepemimpinan eksekutif', '👔', 'active', 1),
        ('Sales & Marketing Division', 'sales-marketing', 'Divisi penjualan dan pemasaran', '💼', 'active', 2),
        ('Operations & Finance Division', 'ops-finance', 'Divisi operasional dan keuangan', '🏢', 'active', 3)
      ON CONFLICT (slug) DO NOTHING
    `);
    results.push('✅ Divisions: OK');

    // 2. Ambil UUIDs
    const divRows = await query(`SELECT id, slug FROM divisions WHERE slug IN ('ceo-office','sales-marketing','ops-finance')`);
    const divMap: Record<string, string> = {};
    divRows.rows.forEach((r: any) => { divMap[r.slug] = r.id; });

    const ceoId = divMap['ceo-office'];
    const salesId = divMap['sales-marketing'];
    const opsId = divMap['ops-finance'];

    if (!ceoId || !salesId || !opsId) {
      throw new Error(`Division UUIDs tidak lengkap: ${JSON.stringify(divMap)}`);
    }

    const dummyUser = '00000000-0000-0000-0000-000000000001';

    // 3. Seed Tasks - CEO Office
    const ceoTasks = [
      ['Review Laporan Kinerja Q1 2026', 'Evaluasi laporan kinerja seluruh divisi untuk kuartal pertama 2026. Identifikasi area yang memerlukan perhatian khusus.', 'pending-approval', 'high', 3],
      ['Persiapan Board Meeting Mei 2026', 'Siapkan agenda, materi presentasi, dan laporan eksekutif untuk rapat dewan komisaris bulan Mei 2026.', 'in-progress', 'high', 7],
      ['Evaluasi Proposal Ekspansi Bisnis', 'Tinjau proposal ekspansi ke pasar Jawa Tengah dan Jawa Timur. Analisis ROI dan risiko investasi.', 'new', 'high', 14],
      ['Review Kontrak Vendor IT', 'Evaluasi kontrak perpanjangan dengan vendor IT utama. Negosiasi ulang SLA dan harga.', 'in-progress', 'medium', 10],
      ['Finalisasi OKR Divisi Q2 2026', 'Finalisasi dan setujui Objectives and Key Results setiap divisi untuk Q2 2026.', 'completed', 'high', -2],
    ];

    for (const [title, desc, status, priority, dayOffset] of ceoTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
        ON CONFLICT DO NOTHING
      `, [title, desc, ceoId, status, priority, dayOffset, dummyUser]);
    }
    results.push('✅ CEO Tasks: 5 records');

    // 4. Seed Tasks - Sales & Marketing
    const salesTasks = [
      ['Kampanye Digital Q2 - Social Media', 'Eksekusi kampanye digital media sosial Q2 2026. Target: 50.000 impressions, 5% engagement rate.', 'in-progress', 'high', 5],
      ['Riset Pasar - Segmen UKM Bandung', 'Survei dan analisis kebutuhan segmen UKM di Kota Bandung untuk produk AI agentic.', 'pending-approval', 'high', 2],
      ['Proposal Partnership Bank BJB', 'Siapkan proposal kerjasama dengan Bank BJB untuk implementasi AI agent di layanan nasabah.', 'new', 'high', 20],
      ['Follow-up 25 Prospek Bulan Mei', 'Lakukan follow-up terhadap 25 prospek yang masuk bulan Mei. Target konversi minimal 20%.', 'in-progress', 'medium', 15],
      ['Laporan Penjualan April 2026', 'Kompilasi dan analisis data penjualan April 2026.', 'completed', 'medium', -5],
    ];

    for (const [title, desc, status, priority, dayOffset] of salesTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
        ON CONFLICT DO NOTHING
      `, [title, desc, salesId, status, priority, dayOffset, dummyUser]);
    }
    results.push('✅ Sales Tasks: 5 records');

    // 5. Seed Tasks - Operations & Finance
    const opsTasks = [
      ['Laporan Keuangan April 2026', 'Finalisasi laporan keuangan bulan April 2026 termasuk neraca, laba rugi, dan arus kas.', 'pending-approval', 'high', 1],
      ['Audit Internal Sistem Penggajian', 'Audit internal proses penggajian dan benefit karyawan. Verifikasi kesesuaian dengan regulasi ketenagakerjaan.', 'in-progress', 'high', 8],
      ['Efisiensi Biaya Operasional Q2', 'Identifikasi dan implementasi area efisiensi biaya dengan target penghematan 10%.', 'new', 'medium', 20],
      ['Review Kontrak Vendor Non-IT', 'Evaluasi seluruh kontrak vendor non-IT untuk identifikasi peluang renegosiasi.', 'in-progress', 'low', 30],
    ];

    for (const [title, desc, status, priority, dayOffset] of opsTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
        ON CONFLICT DO NOTHING
      `, [title, desc, opsId, status, priority, dayOffset, dummyUser]);
    }
    results.push('✅ Ops Tasks: 4 records');

    // 6. Seed Approvals (menuju CEO Office)
    const approvals = [
      ['Persetujuan Anggaran Kampanye Digital Q2 2026',
       'Permohonan anggaran Rp 85.000.000 untuk kampanye digital marketing Q2 2026 mencakup iklan Google Ads, Meta Ads, LinkedIn Ads, dan konten kreator. Timeline: 15 Mei - 30 Juni 2026.',
       salesId, ceoId, 'pending', 'high', 'budget', 85000000],
      ['Approval Kontrak Kerjasama PT Solusi Digital Nusantara',
       'Persetujuan penandatanganan kontrak kerjasama implementasi sistem CRM senilai Rp 250.000.000 dengan PT Solusi Digital Nusantara untuk periode 12 bulan.',
       salesId, ceoId, 'pending', 'high', 'contract', 250000000],
      ['Persetujuan Pengadaan Server Cloud AWS',
       'Permohonan persetujuan pengadaan infrastruktur cloud AWS untuk deployment AI agent. Estimasi biaya Rp 45.000.000/bulan. Kontrak awal 12 bulan.',
       opsId, ceoId, 'pending', 'high', 'procurement', 45000000],
      ['Laporan Keuangan April 2026 - Tanda Tangan Direksi',
       'Laporan keuangan konsolidasian April 2026 memerlukan tanda tangan Direktur Utama untuk keperluan audit dan pelaporan ke dewan komisaris. Revenue: Rp 1,2M | Profit: Rp 280jt.',
       opsId, ceoId, 'pending', 'high', 'report', null],
      ['Persetujuan Rekrutmen 3 Sales Executive',
       'Permohonan rekrutmen 3 posisi Sales Executive untuk ekspansi coverage Jawa Tengah. Estimasi biaya rekrutmen dan onboarding Rp 30.000.000.',
       salesId, ceoId, 'pending', 'medium', 'hiring', 30000000],
      ['Revisi Kebijakan Work From Home Karyawan',
       'Usulan revisi kebijakan WFH: 3 hari kantor, 2 hari remote per minggu. Berlaku mulai Juni 2026. Survei karyawan: 87% setuju.',
       opsId, ceoId, 'pending', 'medium', 'policy', null],
      ['Persetujuan Anggaran Operasional Mei 2026',
       'Anggaran operasional bulanan seluruh divisi Q2 2026 termasuk gaji, utilitas, dan biaya operasional rutin.',
       opsId, ceoId, 'approved', 'medium', 'budget', 320000000],
      ['Partnership Pelatihan AI - Universitas Telkom',
       'Proposal kerjasama program magang dan penelitian bersama dengan Universitas Telkom Bandung selama 1 tahun akademik.',
       salesId, ceoId, 'approved', 'low', 'other', null],
    ];

    for (const [title, desc, fromDiv, toDiv, status, priority, reqType, amount] of approvals) {
      await query(`
        INSERT INTO approvals (title, description, from_division_id, to_division_id, status, priority, request_type, amount, currency, approval_level, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'IDR', 3, $9::uuid)
        ON CONFLICT DO NOTHING
      `, [title, desc, fromDiv, toDiv, status, priority, reqType, amount, dummyUser]);
    }
    results.push('✅ Approvals: 8 records (6 pending, 2 approved)');

    // 7. Seed Messages
    const messages = [
      [salesId, ceoId, '🔴 URGENT: Approval Anggaran Kampanye Q2 Diperlukan Hari Ini',
       'Yth. Bapak Direktur Utama,\n\nMohon persetujuan segera untuk anggaran kampanye digital Q2 2026 sebesar Rp 85.000.000. Deadline launching kampanye adalah 15 Mei 2026.\n\nDetail rencana kampanye telah dilampirkan dalam sistem.\n\nTerima kasih,\nTim Sales & Marketing',
       'approval-request', false, 'urgent'],
      [opsId, ceoId, 'Laporan Keuangan April 2026 Siap untuk Ditandatangani',
       'Yth. Bapak Direktur Utama,\n\nLaporan keuangan April 2026 telah selesai diaudit internal dan siap untuk ditandatangani. Revenue Rp 1,2M | Profit Rp 280jt | Cash Flow positif.\n\nSilakan jadwalkan waktu untuk review dan tanda tangan.',
       'task-notification', false, 'high'],
      [opsId, ceoId, 'Update: Evaluasi Vendor Cloud - Rekomendasi AWS',
       'Bapak Direktur,\n\nProses evaluasi vendor cloud telah selesai. AWS memberikan proposal terbaik dengan biaya Rp 45jt/bulan, SLA 99.9% uptime.\n\nPerbandingan: GCP Rp 52jt/bulan, Azure Rp 48jt/bulan.\n\nRekomendasi tim: AWS dengan kontrak 12 bulan.',
       'report-generated', false, 'normal'],
      [salesId, ceoId, 'Laporan Prospecting Harian - 11 Mei 2026',
       'Ringkasan aktivitas prospecting:\n✅ 12 cold calls terlaksana\n✅ 3 meeting demo terjadwal\n✅ 2 proposal dikirim\n⭐ 1 deal senilai Rp 80jt hampir closing\n\nPipeline aktif: 34 prospek | Nilai total: Rp 1,8M',
       'report-generated', true, 'normal'],
      [salesId, ceoId, 'Konfirmasi Meeting Bank BJB - 18 Mei 2026',
       'Pak Adang,\n\nMeeting dengan VP Digital Banking BJB dikonfirmasi:\n📅 Senin, 18 Mei 2026 pukul 10.00 WIB\n📍 Kantor Pusat BJB, Jl. Asia Afrika Bandung\n\nAgenda: Presentasi solusi AI agent untuk customer service BJB.',
       'general', true, 'normal'],
      [ceoId, salesId, 'Arahan Strategi Penjualan Q2 2026',
       'Tim Sales & Marketing yang saya hormati,\n\nBerikut arahan strategis Q2 2026:\n1. Fokus segmen enterprise (kontrak >Rp 100jt)\n2. Target minimum 5 demo/minggu\n3. Tingkatkan win rate dari 18% → 25%\n4. Prioritas: perbankan dan pendidikan\n\nSalam,\nAdang A. Kunandar\nDirektur Utama',
       'general', false, 'high'],
      [ceoId, opsId, 'Instruksi: Efisiensi Biaya Operasional 10%',
       'Tim Operasional & Keuangan,\n\nMohon identifikasi area efisiensi biaya operasional dengan target penghematan 10% mulai Q2 2026.\n\nLaporan rencana aksi diminta paling lambat 20 Mei 2026.\n\nTerima kasih.',
       'general', false, 'high'],
      [opsId, salesId, 'Reminder: Expense Report April 2026',
       'Kepada Tim Sales & Marketing,\n\nDeadline submission expense report April 2026 adalah Jumat, 15 Mei 2026.\n\nHarap submit melalui sistem dengan melampirkan bukti transaksi.',
       'system-alert', false, 'normal'],
      [opsId, opsId, 'Notifikasi: Payroll Mei 2026 Telah Diproses',
       'Gaji karyawan bulan Mei 2026 telah diproses:\n\n💰 Transfer: 15 Mei 2026\n👥 Total karyawan: 47 orang\n💵 Total payroll: Rp 892.000.000',
       'system-alert', true, 'normal'],
    ];

    for (const [fromDiv, toDiv, subject, body, msgType, isRead, priority] of messages) {
      await query(`
        INSERT INTO messages (from_division_id, to_division_id, sender_id, subject, body, message_type, is_read, priority)
        VALUES ($1, $2, $3::uuid, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [fromDiv, toDiv, dummyUser, subject, body, msgType, isRead, priority]);
    }
    results.push('✅ Messages: 9 records');

    // 8. Seed Reports
    const reports = [
      [ceoId, 'Laporan Kinerja Eksekutif Q1 2026', 'executive', 'complete',
       '{"period":"Q1 2026","revenue":"Rp 3.2M","growth":"18%","highlights":["Ekspansi 3 kota","5 produk AI diluncurkan","MoU 2 BUMN"]}'],
      [ceoId, 'Dashboard KPI Bulanan - April 2026', 'kpi', 'complete',
       '{"period":"April 2026","revenue_actual":"Rp 1.2M","revenue_target":"Rp 1.1M","achievement":"109%","nps":72}'],
      [salesId, 'Laporan Penjualan April 2026', 'sales-performance', 'complete',
       '{"period":"April 2026","total_deals":23,"total_value":"Rp 2.1M","new_customers":8,"pipeline_value":"Rp 8.4M"}'],
      [salesId, 'Analisis Prospecting - Minggu 1-2 Mei 2026', 'sales-performance', 'complete',
       '{"period":"1-11 Mei 2026","calls_made":127,"meetings_set":18,"proposals_sent":12,"conversion_rate":"19%"}'],
      [salesId, 'Rencana Kampanye Digital Q2 2026', 'marketing-campaigns', 'processing',
       '{"status":"draft","channels":["Google Ads","Meta Ads","LinkedIn"],"budget":"Rp 85jt"}'],
      [opsId, 'Laporan Keuangan April 2026', 'financial', 'complete',
       '{"period":"April 2026","revenue":"Rp 1.2M","expenses":"Rp 920jt","profit":"Rp 280jt","margin":"23.3%"}'],
      [opsId, 'Laporan Operasional SLA & Uptime April 2026', 'operational', 'complete',
       '{"period":"April 2026","uptime":"99.7%","incidents":2,"resolved":2,"tickets":145,"resolved_tickets":141}'],
      [opsId, 'Proyeksi Cash Flow Mei-Juli 2026', 'financial', 'processing',
       '{"period":"Mei-Juli 2026","may":"Rp 1.4M","jun":"Rp 1.5M","jul":"Rp 1.6M"}'],
    ];

    for (const [divId, title, rptType, status, content] of reports) {
      await query(`
        INSERT INTO reports (division_id, title, report_type, status, content, generated_by)
        VALUES ($1, $2, $3, $4, $5::jsonb, $6::uuid)
        ON CONFLICT DO NOTHING
      `, [divId, title, rptType, status, content, dummyUser]);
    }
    results.push('✅ Reports: 8 records');

    // Final count
    const counts = await query(`
      SELECT
        (SELECT COUNT(*) FROM tasks) as tasks,
        (SELECT COUNT(*) FROM approvals) as approvals,
        (SELECT COUNT(*) FROM messages) as messages,
        (SELECT COUNT(*) FROM reports) as reports
    `);

    return NextResponse.json({
      success: true,
      message: '🎉 Seed data berhasil diinsert!',
      results,
      counts: counts.rows[0],
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    const errMsg = error?.message || error?.toString() || JSON.stringify(error) || 'Unknown error';
    const errCode = error?.code || '';
    const errDetail = error?.detail || '';
    return NextResponse.json({
      success: false,
      error: errMsg,
      errorCode: errCode,
      errorDetail: errDetail,
      hint: errCode === 'ECONNREFUSED'
        ? 'PostgreSQL tidak berjalan. Jalankan: pg_ctl start atau pastikan service PostgreSQL aktif.'
        : errCode === '3D000'
        ? 'Database "arunika_agentic" belum dibuat. Jalankan: createdb arunika_agentic'
        : errMsg.includes('does not exist')
        ? 'Tabel belum ada. Jalankan migration dulu: npm run db:migrate atau psql -f database-migrations.sql'
        : 'Periksa DATABASE_URL di .env.local dan pastikan PostgreSQL sudah berjalan.',
      results,
    }, { status: 500 });
  }
}

export async function GET() {
  // Quick status check — step 1: test DB connection, step 2: check if schema exists
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({
      success: false,
      error: 'DATABASE_URL tidak ada di environment',
      hint: 'Pastikan file .env.local ada dan berisi DATABASE_URL=postgres://...',
    }, { status: 500 });
  }
  try {
    // Step 1: test basic connection — jangan query tabel dulu
    await query('SELECT 1 as ping');

    // Step 2: cek apakah schema sudah ada
    const tableCheck = await query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('divisions','tasks','approvals','messages','reports')
    `);
    const tableCount = parseInt(tableCheck.rows[0].count);

    if (tableCount < 5) {
      // DB konek tapi tabel belum ada — perlu migration
      return NextResponse.json({
        success: true,
        migrated: false,
        counts: null,
        tablesFound: tableCount,
        dbUrl: dbUrl.replace(/:([^@]+)@/, ':***@'),
      });
    }

    // Step 3: tabel ada, ambil counts
    const counts = await query(`
      SELECT
        (SELECT COUNT(*) FROM divisions) as divisions,
        (SELECT COUNT(*) FROM tasks) as tasks,
        (SELECT COUNT(*) FROM approvals) as approvals,
        (SELECT COUNT(*) FROM messages) as messages,
        (SELECT COUNT(*) FROM reports) as reports
    `);
    return NextResponse.json({
      success: true,
      migrated: true,
      counts: counts.rows[0],
      dbUrl: dbUrl.replace(/:([^@]+)@/, ':***@'),
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: (e as Error).message,
    }, { status: 500 });
  }
}
