-- ============================================================
-- SEED DATA - Arunika Agentic AI Divisional Management System
-- PT. Arunika Teknologi Global
-- Menambahkan data nyata: Tasks, Messages, Reports, Approvals
-- ============================================================

-- Enable extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pastikan divisions sudah ada
INSERT INTO divisions (name, slug, description, icon, status, sort_order)
VALUES
  ('CEO Office', 'ceo-office', 'Kantor CEO dan kepemimpinan eksekutif', '👔', 'active', 1),
  ('Sales & Marketing Division', 'sales-marketing', 'Divisi penjualan dan pemasaran', '💼', 'active', 2),
  ('Operations & Finance Division', 'ops-finance', 'Divisi operasional dan keuangan', '🏢', 'active', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VARIABEL UUID (ambil dari tabel divisions)
-- ============================================================
DO $$
DECLARE
  ceo_id UUID;
  sales_id UUID;
  ops_id UUID;

  -- Task IDs
  t1 UUID := uuid_generate_v4();
  t2 UUID := uuid_generate_v4();
  t3 UUID := uuid_generate_v4();
  t4 UUID := uuid_generate_v4();
  t5 UUID := uuid_generate_v4();
  t6 UUID := uuid_generate_v4();
  t7 UUID := uuid_generate_v4();
  t8 UUID := uuid_generate_v4();
  t9 UUID := uuid_generate_v4();
  t10 UUID := uuid_generate_v4();
  t11 UUID := uuid_generate_v4();
  t12 UUID := uuid_generate_v4();

  -- Approval IDs
  a1 UUID := uuid_generate_v4();
  a2 UUID := uuid_generate_v4();
  a3 UUID := uuid_generate_v4();
  a4 UUID := uuid_generate_v4();
  a5 UUID := uuid_generate_v4();
  a6 UUID := uuid_generate_v4();
  a7 UUID := uuid_generate_v4();
  a8 UUID := uuid_generate_v4();

  -- Message IDs
  m1 UUID := uuid_generate_v4();
  m2 UUID := uuid_generate_v4();
  m3 UUID := uuid_generate_v4();
  m4 UUID := uuid_generate_v4();
  m5 UUID := uuid_generate_v4();
  m6 UUID := uuid_generate_v4();
  m7 UUID := uuid_generate_v4();
  m8 UUID := uuid_generate_v4();
  m9 UUID := uuid_generate_v4();

  -- Report IDs
  r1 UUID := uuid_generate_v4();
  r2 UUID := uuid_generate_v4();
  r3 UUID := uuid_generate_v4();
  r4 UUID := uuid_generate_v4();
  r5 UUID := uuid_generate_v4();
  r6 UUID := uuid_generate_v4();
  r7 UUID := uuid_generate_v4();
  r8 UUID := uuid_generate_v4();

  dummy_user UUID := '00000000-0000-0000-0000-000000000001'::UUID;

BEGIN
  SELECT id INTO ceo_id FROM divisions WHERE slug = 'ceo-office';
  SELECT id INTO sales_id FROM divisions WHERE slug = 'sales-marketing';
  SELECT id INTO ops_id FROM divisions WHERE slug = 'ops-finance';

  -- ============================================================
  -- TASKS - CEO Office
  -- ============================================================
  INSERT INTO tasks (id, title, description, division_id, status, priority, due_date, assigned_to, created_by)
  VALUES
    (t1, 'Review Laporan Kinerja Q1 2026',
     'Evaluasi laporan kinerja seluruh divisi untuk kuartal pertama 2026. Identifikasi area yang memerlukan perhatian khusus.',
     ceo_id, 'pending-approval', 'high', CURRENT_DATE + 3, dummy_user, dummy_user),

    (t2, 'Persiapan Board Meeting Mei 2026',
     'Siapkan agenda, materi presentasi, dan laporan eksekutif untuk rapat dewan komisaris bulan Mei 2026.',
     ceo_id, 'in-progress', 'high', CURRENT_DATE + 7, dummy_user, dummy_user),

    (t3, 'Evaluasi Proposal Ekspansi Bisnis',
     'Tinjau proposal ekspansi ke pasar Jawa Tengah dan Jawa Timur. Analisis ROI dan risiko investasi.',
     ceo_id, 'new', 'high', CURRENT_DATE + 14, dummy_user, dummy_user),

    (t4, 'Review Kontrak Vendor IT',
     'Evaluasi kontrak perpanjangan dengan vendor IT utama. Negosiasi ulang SLA dan harga.',
     ceo_id, 'in-progress', 'medium', CURRENT_DATE + 10, dummy_user, dummy_user),

    (t5, 'Finalisasi OKR Divisi Q2 2026',
     'Finalisasi dan setujui Objectives and Key Results setiap divisi untuk Q2 2026.',
     ceo_id, 'completed', 'high', CURRENT_DATE - 2, dummy_user, dummy_user)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- TASKS - Sales & Marketing
  -- ============================================================
  INSERT INTO tasks (id, title, description, division_id, status, priority, due_date, assigned_to, created_by)
  VALUES
    (t6, 'Kampanye Digital Q2 - Social Media',
     'Eksekusi kampanye digital media sosial untuk Q2 2026. Target: 50.000 impressions, 5% engagement rate.',
     sales_id, 'in-progress', 'high', CURRENT_DATE + 5, dummy_user, dummy_user),

    (t7, 'Riset Pasar - Segmen UKM Bandung',
     'Survei dan analisis kebutuhan segmen UKM di Kota Bandung untuk produk AI agentic.',
     sales_id, 'pending-approval', 'high', CURRENT_DATE + 2, dummy_user, dummy_user),

    (t8, 'Proposal Partnership Bank BJB',
     'Siapkan proposal kerjasama dengan Bank BJB untuk implementasi AI agent di layanan nasabah.',
     sales_id, 'new', 'high', CURRENT_DATE + 20, dummy_user, dummy_user),

    (t9, 'Follow-up 25 Prospek Bulan Mei',
     'Lakukan follow-up terhadap 25 prospek yang masuk bulan Mei. Target konversi minimal 20%.',
     sales_id, 'in-progress', 'medium', CURRENT_DATE + 15, dummy_user, dummy_user),

    (t10, 'Laporan Penjualan April 2026',
     'Kompilasi dan analisis data penjualan April 2026. Bandingkan dengan target dan periode sebelumnya.',
     sales_id, 'completed', 'medium', CURRENT_DATE - 5, dummy_user, dummy_user)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- TASKS - Operations & Finance
  -- ============================================================
  INSERT INTO tasks (id, title, description, division_id, status, priority, due_date, assigned_to, created_by)
  VALUES
    (t11, 'Laporan Keuangan April 2026',
     'Finalisasi laporan keuangan bulan April 2026 termasuk neraca, laba rugi, dan arus kas.',
     ops_id, 'pending-approval', 'high', CURRENT_DATE + 1, dummy_user, dummy_user),

    (t12, 'Audit Internal Sistem Penggajian',
     'Audit internal proses penggajian dan benefit karyawan. Verifikasi kesesuaian dengan regulasi ketenagakerjaan.',
     ops_id, 'in-progress', 'high', CURRENT_DATE + 8, dummy_user, dummy_user)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- APPROVALS - Menuju CEO Office (perlu approval CEO)
  -- amount: DECIMAL(15,2) dalam IDR (tanpa "Rp" prefix)
  -- request_id: referensi ke task/dokumen terkait (text field)
  -- ============================================================
  INSERT INTO approvals (
    id, title, description, from_division_id, to_division_id,
    status, priority, request_type, amount, currency,
    approval_level, request_id, created_by
  )
  VALUES
    (a1,
     'Persetujuan Anggaran Kampanye Digital Q2 2026',
     'Permohonan anggaran Rp 85.000.000 untuk kampanye digital marketing Q2 2026 mencakup iklan Google Ads, Meta Ads, LinkedIn Ads, dan konten kreator. Timeline: 15 Mei - 30 Juni 2026.',
     sales_id, ceo_id,
     'pending', 'high', 'budget', 85000000.00, 'IDR',
     3, t6::text, dummy_user),

    (a2,
     'Approval Kontrak Kerjasama PT Solusi Digital Nusantara',
     'Persetujuan penandatanganan kontrak kerjasama implementasi sistem CRM senilai Rp 250.000.000 dengan PT Solusi Digital Nusantara untuk periode 12 bulan. Mencakup implementasi, training, dan support.',
     sales_id, ceo_id,
     'pending', 'high', 'contract', 250000000.00, 'IDR',
     3, NULL, dummy_user),

    (a3,
     'Persetujuan Pengadaan Server Cloud AWS',
     'Permohonan persetujuan pengadaan infrastruktur cloud AWS untuk kebutuhan deployment AI agent. Estimasi biaya Rp 45.000.000/bulan. Kontrak awal 12 bulan, dengan opsi perpanjangan.',
     ops_id, ceo_id,
     'pending', 'high', 'procurement', 45000000.00, 'IDR',
     3, NULL, dummy_user),

    (a4,
     'Laporan Keuangan April 2026 - Tanda Tangan Direksi',
     'Laporan keuangan konsolidasian April 2026 memerlukan tanda tangan Direktur Utama untuk keperluan audit dan pelaporan ke dewan komisaris. Revenue: Rp 1,2M | Profit: Rp 280jt.',
     ops_id, ceo_id,
     'pending', 'high', 'report', NULL, 'IDR',
     3, t11::text, dummy_user),

    (a5,
     'Persetujuan Rekrutmen 3 Sales Executive',
     'Permohonan persetujuan rekrutmen 3 posisi Sales Executive baru untuk ekspansi coverage Jawa Tengah. Total biaya rekrutmen dan onboarding estimasi Rp 30.000.000.',
     sales_id, ceo_id,
     'pending', 'medium', 'hiring', 30000000.00, 'IDR',
     3, NULL, dummy_user),

    (a6,
     'Revisi Kebijakan Work From Home Karyawan',
     'Usulan revisi kebijakan WFH: 3 hari kantor, 2 hari remote per minggu. Berlaku mulai Juni 2026 setelah persetujuan Direktur Utama. Survei karyawan: 87% setuju.',
     ops_id, ceo_id,
     'pending', 'medium', 'policy', NULL, 'IDR',
     3, NULL, dummy_user),

    -- Approvals yang sudah selesai (history)
    (a7,
     'Persetujuan Anggaran Operasional Mei 2026',
     'Anggaran operasional bulanan divisi Q2 2026 termasuk gaji, utilitas, dan biaya operasional rutin seluruh divisi.',
     ops_id, ceo_id,
     'approved', 'medium', 'budget', 320000000.00, 'IDR',
     3, NULL, dummy_user),

    (a8,
     'Partnership Program Pelatihan AI - Universitas Telkom',
     'Proposal kerjasama program magang dan penelitian bersama dengan Universitas Telkom Bandung selama 1 tahun akademik.',
     sales_id, ceo_id,
     'approved', 'low', 'other', NULL, 'IDR',
     3, NULL, dummy_user)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MESSAGES - CEO Office Mailbox
  -- ============================================================
  INSERT INTO messages (
    id, from_division_id, to_division_id, sender_id,
    subject, body, message_type, is_read, priority, created_at
  )
  VALUES
    (m1, sales_id, ceo_id, dummy_user,
     '🔴 URGENT: Approval Anggaran Kampanye Q2 Diperlukan Hari Ini',
     'Yth. Bapak Direktur Utama,\n\nMohon persetujuan segera untuk anggaran kampanye digital Q2 2026 sebesar Rp 85.000.000. Deadline launching kampanye adalah 15 Mei 2026.\n\nDetail rencana kampanye telah dilampirkan dalam sistem.\n\nTerima kasih,\nTim Sales & Marketing',
     'approval-request', FALSE, 'urgent', NOW() - INTERVAL '2 hours'),

    (m2, ops_id, ceo_id, dummy_user,
     'Laporan Keuangan April 2026 Siap untuk Ditandatangani',
     'Yth. Bapak Direktur Utama,\n\nLaporan keuangan April 2026 telah selesai diaudit internal dan siap untuk ditandatangani. Total aset perusahaan tumbuh 12% YoY.\n\nRingkasan: Revenue Rp 1,2M | Profit Rp 280jt | Cash Flow positif.\n\nSilakan jadwalkan waktu untuk review dan tanda tangan.\n\nHormat,\nDivisi Operasional & Keuangan',
     'task-notification', FALSE, 'high', NOW() - INTERVAL '5 hours'),

    (m3, ops_id, ceo_id, dummy_user,
     'Update: Pengadaan Infrastruktur Cloud AWS',
     'Bapak Direktur,\n\nProses evaluasi vendor cloud telah selesai. AWS memberikan proposal terbaik dengan biaya Rp 45jt/bulan dengan SLA 99.9% uptime.\n\nAlternatif: GCP Rp 52jt/bulan, Azure Rp 48jt/bulan.\n\nRekomendasi tim: AWS dengan kontrak 12 bulan untuk efisiensi biaya.\n\nMohon arahan selanjutnya.',
     'report-generated', FALSE, 'normal', NOW() - INTERVAL '1 day'),

    (m4, sales_id, ceo_id, dummy_user,
     'Laporan Prospecting Harian - 11 Mei 2026',
     'Ringkasan aktivitas prospecting hari ini:\n✅ 12 cold calls terlaksana\n✅ 3 meeting demo terjadwal\n✅ 2 proposal dikirim\n⭐ 1 deal senilai Rp 80jt hampir closing\n\nPipeline aktif: 34 prospek | Nilai total: Rp 1,8M',
     'report-generated', TRUE, 'normal', NOW() - INTERVAL '3 hours'),

    (m5, sales_id, ceo_id, dummy_user,
     'Konfirmasi Meeting dengan Bank BJB Minggu Depan',
     'Pak Adang,\n\nMeeting dengan VP Digital Banking BJB telah dikonfirmasi:\n📅 Senin, 18 Mei 2026 pukul 10.00 WIB\n📍 Kantor Pusat BJB, Jl. Asia Afrika Bandung\n\nAgenda: Presentasi solusi AI agent untuk customer service BJB.\n\nMohon kehadiran Bapak jika memungkinkan.',
     'general', TRUE, 'normal', NOW() - INTERVAL '6 hours'),

    -- Messages ke Sales & Marketing
    (m6, ceo_id, sales_id, dummy_user,
     'Arahan Strategi Penjualan Q2 2026',
     'Tim Sales & Marketing yang saya hormati,\n\nBerikut arahan strategis untuk Q2 2026:\n1. Fokus pada segmen enterprise (kontrak >Rp 100jt)\n2. Target minimum 5 demo per minggu\n3. Tingkatkan win rate dari 18% menjadi 25%\n4. Prioritas: sektor perbankan dan pendidikan\n\nSaya yakin tim kita mampu mencapai target ini.\n\nSalam,\nAdang A. Kunandar\nDirektur Utama',
     'general', FALSE, 'high', NOW() - INTERVAL '2 days'),

    -- Messages ke Operations & Finance
    (m7, ceo_id, ops_id, dummy_user,
     'Instruksi: Efisiensi Biaya Operasional 10%',
     'Tim Operasional & Keuangan,\n\nMohon identifikasi area efisiensi biaya operasional dengan target penghematan 10% mulai Q2 2026.\n\nPrioritaskan:\n- Review kontrak vendor non-kritis\n- Optimasi penggunaan cloud\n- Efisiensi konsumsi listrik\n\nLaporan rencana aksi diminta paling lambat 20 Mei 2026.\n\nTerima kasih.',
     'general', FALSE, 'high', NOW() - INTERVAL '1 day'),

    (m8, ops_id, sales_id, dummy_user,
     'Reminder: Submission Expense Report April 2026',
     'Kepada Tim Sales & Marketing,\n\nDiingatkan kembali bahwa deadline submission expense report bulan April 2026 adalah Jumat, 15 Mei 2026.\n\nHarap submit melalui sistem dengan melampirkan bukti transaksi yang sah.\n\nTerima kasih atas kerjasamanya.',
     'system-alert', FALSE, 'normal', NOW() - INTERVAL '4 hours'),

    (m9, ops_id, ops_id, dummy_user,
     'Notifikasi: Sistem Payroll Telah Diproses',
     'Gaji karyawan bulan Mei 2026 telah berhasil diproses dan akan masuk ke rekening masing-masing pada:\n\n💰 Tanggal transfer: 15 Mei 2026\n👥 Total karyawan: 47 orang\n💵 Total nilai payroll: Rp 892.000.000\n\nJika ada pertanyaan, hubungi HR Finance.',
     'system-alert', TRUE, 'normal', NOW() - INTERVAL '30 minutes')
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- REPORTS
  -- ============================================================
  INSERT INTO reports (
    id, title, division_id, report_type, status, content,
    generated_by, created_at
  )
  VALUES
    (r1, 'Laporan Kinerja Eksekutif Q1 2026',
     ceo_id, 'executive', 'complete',
     '{"period":"Q1 2026","revenue":"Rp 3.2M","growth":"18%","highlights":["Ekspansi ke 3 kota baru","Peluncuran 5 produk AI","MoU dengan 2 BUMN"]}',
     dummy_user, NOW() - INTERVAL '15 days'),

    (r2, 'Dashboard KPI Bulanan - April 2026',
     ceo_id, 'kpi', 'complete',
     '{"period":"April 2026","kpis":{"revenue_actual":"Rp 1.2M","revenue_target":"Rp 1.1M","achievement":"109%","nps":72,"employee_satisfaction":"87%"}}',
     dummy_user, NOW() - INTERVAL '5 days'),

    (r3, 'Laporan Penjualan April 2026',
     sales_id, 'sales', 'complete',
     '{"period":"April 2026","total_deals":23,"total_value":"Rp 2.1M","new_customers":8,"churned":1,"pipeline_value":"Rp 8.4M"}',
     dummy_user, NOW() - INTERVAL '7 days'),

    (r4, 'Analisis Prospecting - Minggu 1-2 Mei 2026',
     sales_id, 'prospecting', 'complete',
     '{"period":"1-11 Mei 2026","calls_made":127,"meetings_set":18,"proposals_sent":12,"demos_conducted":9,"conversion_rate":"19%"}',
     dummy_user, NOW() - INTERVAL '1 day'),

    (r5, 'Rencana Kampanye Digital Q2 2026',
     sales_id, 'marketing', 'processing',
     '{"status":"draft","channels":["Google Ads","Meta Ads","LinkedIn"],"budget":"Rp 85jt","target_impressions":"500.000"}',
     dummy_user, NOW() - INTERVAL '3 days'),

    (r6, 'Laporan Keuangan April 2026',
     ops_id, 'financial', 'complete',
     '{"period":"April 2026","revenue":"Rp 1.2M","expenses":"Rp 920jt","profit":"Rp 280jt","profit_margin":"23.3%","cash_position":"Rp 2.1M"}',
     dummy_user, NOW() - INTERVAL '4 days'),

    (r7, 'Laporan Operasional - SLA & Uptime April 2026',
     ops_id, 'operational', 'complete',
     '{"period":"April 2026","system_uptime":"99.7%","incidents":2,"resolved":2,"avg_resolution_time":"2.3 jam","customer_tickets":145,"resolved_tickets":141}',
     dummy_user, NOW() - INTERVAL '6 days'),

    (r8, 'Proyeksi Cash Flow Mei - Juli 2026',
     ops_id, 'financial', 'processing',
     '{"period":"Mei-Juli 2026","status":"draft","projection_may":"Rp 1.4M","projection_jun":"Rp 1.5M","projection_jul":"Rp 1.6M"}',
     dummy_user, NOW() - INTERVAL '2 days')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Seed data berhasil diinsert!';
  RAISE NOTICE '  CEO Office: Tasks=5, Approvals (incoming)=6+2, Messages=5';
  RAISE NOTICE '  Sales: Tasks=5, Messages=2';
  RAISE NOTICE '  Ops & Finance: Tasks=2, Messages=3';
  RAISE NOTICE '  Reports: 8 total';

END $$;
