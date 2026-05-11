/**
 * POST /api/admin/real-seed
 * Hapus semua data mock, insert data real dari scheduled tasks 11 Mei 2026
 */
import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST() {
  const results: string[] = [];

  try {
    await query('SELECT 1 as ping');
    results.push('✅ Koneksi DB: OK');

    // ─── 1. HAPUS SEMUA DATA LAMA ─────────────────────────────────
    await query(`TRUNCATE TABLE audit_log, task_assignments, notification_preferences,
                 approval_workflows, approvals, messages, reports, tasks, divisions
                 RESTART IDENTITY CASCADE`);
    results.push('🗑️ Data lama dihapus semua');

    // ─── 2. INSERT DIVISIONS ──────────────────────────────────────
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await query(`
      INSERT INTO divisions (name, slug, description, icon, status, sort_order)
      VALUES
        ('CEO Office', 'ceo-office', 'Direktur Utama — Adang A. Kunandar | Pengambilan keputusan strategis & approval eksekutif', '👔', 'active', 1),
        ('Sales & Marketing Division', 'sales-marketing', 'Prospecting & Engagement Yayasan Pendidikan | Foundation Targets: 5 aktif', '💼', 'active', 2),
        ('Operations & Finance Division', 'ops-finance', 'Monitoring biaya API, infrastruktur GCP, dan operasional harian', '🏢', 'active', 3)
      ON CONFLICT (slug) DO NOTHING
    `);
    results.push('✅ Divisions: 3 records');

    const divRows = await query(`SELECT id, slug FROM divisions WHERE slug IN ('ceo-office','sales-marketing','ops-finance')`);
    const divMap: Record<string, string> = {};
    divRows.rows.forEach((r: any) => { divMap[r.slug] = r.id; });
    const ceoId = divMap['ceo-office'];
    const salesId = divMap['sales-marketing'];
    const opsId = divMap['ops-finance'];
    const sysUser = '00000000-0000-0000-0000-000000000001';

    // ─── 3. TASKS REAL ────────────────────────────────────────────

    // CEO Tasks
    const ceoTasks = [
      ['🔴 ESKALASI: GCP JSON Keys Blocker — Download Manual Sekarang',
       'Blocker hari ke-2 yang belum terselesaikan. Perlu download JSON keys dari GCP Console untuk 2 service accounts:\n1. arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com\n2. arunika-central-hub-gmail@arunika-central-hub.iam.gserviceaccount.com\n\nUpdate file: config/gcp-service-account.json & config/gcp-gmail-sa.json\nEstimasi: 5-10 menit. Blok Week 1 May 12 jika tidak diselesaikan hari ini.',
       'pending-approval', 'high', 0],
      ['Review & Approval: 5 Foundation Prospect — Sales & Marketing Report 11 Mei',
       'Submission ID: APS-2026-05-11-001\nSales & Marketing telah mengidentifikasi 5 yayasan pendidikan high-potential:\n🔴 P1: Yayasan Kader Bangsa (65 sekolah ekspansi 2030)\n🟠 P2: Al Firdaus Semesta (3 kampus, Cambridge)\n🟠 P3: Bunda Mulia (PAUD-SMA, Cambridge)\n🟡 P4: Indonesia Heritage Foundation (CBHE network)\n🟡 P5: BINUS School Semarang (Bina Nusantara Group)\n\nDecision needed: Approve priority ranking & strategi outreach.',
       'pending-approval', 'high', 0],
      ['Konfirmasi Eksekusi Week 1 — May 12 Launch (Cowork Hybrid)',
       'Jika GCP Keys blocker selesai hari ini, Week 1 execution (May 12-16) dapat dimulai besok pagi.\nTarget: 70% automation infrastructure\nProbabilitas on-time: 50% saat ini (dari 75%)\nAction: Brief tim Week 1, konfirmasi jadwal.',
       'in-progress', 'high', 1],
      ['Approve Strategi Outreach CEO-Level — Dirgayuza Setiawan (Kader Bangsa)',
       'Rekomendasi Sales: CEO melakukan outreach langsung ke Dirgayuza Setiawan (Chairman YPKBI).\nYayasan ini berencana ekspansi 65 boarding school baru sampai 2030 — kandidat terbesar untuk implementasi ERP Arunika.\nAction needed: Setujui atau modifikasi pendekatan outreach.',
       'new', 'high', 2],
      ['Review Daily Status Report — Project Cowork Hybrid 11 Mei 2026',
       'Status keseluruhan: 🟠 YELLOW — On track dengan critical blocker aktif.\n- Infrastructure: 40% complete (2/5 tasks)\n- Sales pipeline: ✅ GREEN — 5 target aktif\n- Finance/Ops: ✅ GREEN — on budget $40/month\n- Go-live June 9: AT RISK jika GCP tidak selesai hari ini\nDays remaining: 29 hari ke go-live.',
       'in-progress', 'medium', 0],
    ];

    for (const [title, desc, status, priority, dayOffset] of ceoTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
      `, [title, desc, ceoId, status, priority, dayOffset, sysUser]);
    }
    results.push('✅ CEO Tasks: 5 records');

    // Sales & Marketing Tasks
    const salesTasks = [
      ['✅ Prospecting Selesai: Yayasan Pendidikan Kader Bangsa Indonesia (YPKBI)',
       'PRIORITY 1 - VERY HIGH\nKetua: Dirgayuza Setiawan | Email: info@kaderbangsa.foundation\nOpportunity: Ekspansi 65 boarding school baru by 2030 + IB curriculum partnership\nRekomendasi: CEO-level outreach untuk solusi expansion support\nQuality Score: 95/100 | Market Reach: 65 sekolah',
       'completed', 'high', 0],
      ['✅ Prospecting Selesai: Yayasan Al Firdaus — Semesta Bilingual Boarding School',
       'PRIORITY 2 - HIGH\nWebsite: semesta.sch.id | Kontak: info@semesta.sch.id | (62-24) 76916060\nCurriculum: Cambridge International | 3-campus system di Semarang\nRekomendasi: Multi-campus integration pitch\nQuality Score: 95/100 | Market Reach: 12 sekolah',
       'completed', 'high', 0],
      ['✅ Prospecting Selesai: Yayasan Pendidikan Bunda Mulia',
       'PRIORITY 3 - HIGH\nKepala: Rita Djoko Susanto | Email: smpbundamulia@yahoo.com | (62-21) 6329005\nCurriculum: Cambridge International | Jenjang: PAUD-SMA\nRekomendasi: Schedule dengan Kepala Yayasan Rita Djoko Susanto\nQuality Score: 95/100 | Market Reach: 8 sekolah',
       'completed', 'high', 0],
      ['✅ Prospecting Selesai: Indonesia Heritage Foundation (IHF)',
       'PRIORITY 4 - MEDIUM-HIGH\nFounder: Dr. Ratna Megawangi & Dr. Sofyan Djalil | Website: ihf.or.id | Depok, Jawa Barat\nModel: Character-Based Holistic Education (CBHE) network\nRekomendasi: Research decision-maker contacts lebih lanjut\nQuality Score: 90/100 | Market Reach: 25 sekolah',
       'completed', 'medium', 0],
      ['✅ Prospecting Selesai: BINUS School Semarang (Bina Nusantara Group)',
       'PRIORITY 5 - MEDIUM-HIGH\nWebsite: semarang.binus.sch.id | Organisasi: Bina Nusantara Group (konglomerat besar)\nOpportunity: Enterprise-wide implementation di seluruh group\nRekomendasi: Engage di level corporate group\nQuality Score: 90/100 | Market Reach: 20 sekolah',
       'completed', 'medium', 0],
      ['Outreach Week 1 (12-16 Mei): Initial Contact Yayasan Kader Bangsa',
       'Setelah approval CEO, eksekusi initial outreach ke Dirgayuza Setiawan (YPKBI).\nTarget: Set meeting/call untuk presentasi solusi Arunika.\nMaterial: Executive_Brief_Foundation_Prospecting.docx sudah siap.\nTimeline engagement: 2-4 minggu ke product demo.',
       'new', 'high', 1],
      ['Prepare Presentation: Multi-Campus Integration Pitch — Al Firdaus & Bunda Mulia',
       'Persiapkan presentasi khusus untuk Priority 2 & 3.\nFokus: Solusi manajemen multi-kampus dan integrasi sistem sekolah.\nTarget jadwal: Week 2 (19-23 Mei 2026).',
       'new', 'high', 8],
    ];

    for (const [title, desc, status, priority, dayOffset] of salesTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
      `, [title, desc, salesId, status, priority, dayOffset, sysUser]);
    }
    results.push('✅ Sales Tasks: 7 records');

    // Ops & Finance Tasks
    const opsTasks = [
      ['✅ Daily Finance Report: API Token & Credit Usage — 11 Mei 2026',
       'Report harian penggunaan API:\n• Firecrawl API (fc-bd687bec30344608bcae35f1b3eabb5f): 5 calls — Prospecting 5 yayasan\n• Microsoft Graph API: 4 instances aktif, OneDrive sync OK\n• Claude API: Automated tasks 4 scheduled runs\n\nTotal Monthly Budget: $40/bulan (vs $30,000 manual labor)\nROI: 74,900% | Cost per automation: $0.0046',
       'completed', 'medium', 0],
      ['Monitoring: Cowork Hybrid Infrastructure — GCP Service Accounts',
       'Task 2 GCP: 90% selesai — BLOCKED karena JSON keys belum di-download\nService accounts yang membutuhkan keys:\n1. arunika-central-hub-api (untuk Drive/Sheets)\n2. arunika-central-hub-gmail (untuk Gmail sync)\n\nDampak: Task 3 (Shared Drive), Task 5 (Metrics Dashboard) tertunda.\nEskalasi ke CEO sudah dikirim.',
       'in-progress', 'high', 0],
      ['Analisis Budget: Cowork Hybrid 4 Instances — Q2 2026',
       'Proyeksi biaya bulanan:\n• Central-Hub: $10/month\n• Sales-Marketing: $10/month\n• Finance-Operations: $10/month\n• CEO-Dashboard: $10/month\n• Total: $40/month\n\nSavings vs manual: $29,960/month\nTarget Q2: Track actual vs projection.',
       'new', 'medium', 7],
      ['Setup Monitoring Dashboard — Post GCP Keys Resolution',
       'Setelah GCP JSON keys resolved (Task 2), deploy metrics dashboard:\n• System health per division\n• API usage real-time\n• Budget burn rate\n• Automation success rate\nTergantung pada: Resolusi GCP blocker oleh CEO',
       'new', 'medium', 1],
    ];

    for (const [title, desc, status, priority, dayOffset] of opsTasks) {
      await query(`
        INSERT INTO tasks (title, description, division_id, status, priority, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + ($6::integer * INTERVAL '1 day'), $7::uuid)
      `, [title, desc, opsId, status, priority, dayOffset, sysUser]);
    }
    results.push('✅ Ops Tasks: 4 records');

    // ─── 4. APPROVALS REAL ────────────────────────────────────────

    const approvals = [
      // Sales → CEO
      ['APS-2026-05-11-001: Approval Foundation Prospect Selection & Priority Ranking',
       'Sales & Marketing telah menyelesaikan daily prospecting dan mengidentifikasi 5 yayasan pendidikan high-potential hari ini (11 Mei 2026).\n\nPriority ranking:\n🔴 P1: Yayasan Kader Bangsa — 65 school expansion by 2030 (VERY HIGH)\n🟠 P2: Al Firdaus Semesta — 3-campus Cambridge system (HIGH)\n🟠 P3: Bunda Mulia — PAUD-SMA Cambridge, Rita Djoko Susanto (HIGH)\n🟡 P4: Indonesia Heritage Foundation — CBHE network (MEDIUM-HIGH)\n🟡 P5: BINUS School Semarang — Bina Nusantara Group (MEDIUM-HIGH)\n\nTotal market reach: 130+ sekolah di seluruh Indonesia.\nQuality Score rata-rata: 93/100\n\nDecision diperlukan: Approve priority ranking ini untuk memulai outreach Week 1 (May 12).',
       salesId, ceoId, 'pending', 'high', 'other', null],

      ['Persetujuan Strategi Outreach CEO-Level: Dirgayuza Setiawan — YPKBI',
       'Rekomendasi Tim Sales: CEO (Adang A. Kunandar) melakukan outreach langsung ke:\n\nNama: Dirgayuza Setiawan\nJabatan: Chairman & Co-Founder, Yayasan Pendidikan Kader Bangsa Indonesia\nEmail: info@kaderbangsa.foundation\n\nAlasan pendekatan CEO-level:\n• Rencana ekspansi 65 boarding school baru by 2030\n• IB curriculum partnership aktif\n• International funding available\n• Keputusan strategis butuh executive-to-executive engagement\n\nAction: CEO approval untuk authorize outreach mulai Week 1 (May 12).',
       salesId, ceoId, 'pending', 'high', 'other', null],

      ['Persetujuan Alokasi Sumber Daya Sales — Engagement 5 Foundation Targets',
       'Untuk mengeksekusi outreach strategy kepada 5 foundation targets, Sales membutuhkan:\n\n• Account Manager: Assignment untuk 5 prospek (2-3 meeting each)\n• Travel Budget: Priority 1-3 di Jakarta & Semarang\n• Timeline: 2-4 minggu engagement cycle mulai 12 Mei\n\nEstimated budget untuk travel & meetings: Rp 15.000.000\n\nRincian:\n- Jakarta (Kader Bangsa, Bunda Mulia): 2x trip\n- Semarang (Al Firdaus Semesta, BINUS): 2x trip\n- Depok (IHF): 1x trip',
       salesId, ceoId, 'pending', 'medium', 'budget', 15000000],

      // Ops → CEO — GCP Escalation
      ['🔴 ESKALASI KRITIS: GCP JSON Keys Blocker — Day 2, Week 1 Terancam',
       'Blocker yang dilaporkan 10 Mei 2026 MASIH BELUM TERSELESAIKAN per 11 Mei 2026 09:00.\n\nDampak:\n• Task 3 (Shared Drive Setup) — BLOCKED\n• Task 5 (Metrics Dashboard) — BLOCKED\n• Week 1 execution (May 12) — AT RISK\n• Go-live June 9 — MEDIUM RISK\n\nApa yang perlu dilakukan (5-10 menit):\n1. Buka: https://console.cloud.google.com/iam-admin/serviceaccounts\n2. Download JSON key: arunika-central-hub-api\n3. Download JSON key: arunika-central-hub-gmail\n4. Update file:\n   • config/gcp-service-account.json\n   • config/gcp-gmail-sa.json\n\nSetiap hari delay = 1 hari berkurang dari buffer 2 minggu.\n\nJika tidak diselesaikan hari ini: Week 1 slip, cascade delay ke semua tasks berikutnya.',
       opsId, ceoId, 'pending', 'high', 'other', null],

      // Sales → CEO — Week 1 sales engagement
      ['Konfirmasi: Sales Engagement Plan Week 1 (12-16 Mei) — Tarakanita & BINUS',
       'Sales siap memulai engagement dengan 5 foundation targets mulai Senin 12 Mei.\n\nRencana Week 1:\n• Senin-Selasa (12-13 Mei): Initial contact Tarakanita via phone + email\n• Rabu (14 Mei): Follow-up BINUS Group di level korporat\n• Kamis-Jumat (15-16 Mei): Jadwal meeting Bunda Mulia\n\nSemua materi presentasi dan brief sudah disiapkan:\n• Foundation_Prospecting_Report.xlsx (7.3 KB)\n• Executive_Brief_Foundation_Prospecting.docx (40 KB)\n\nCEO approval needed untuk konfirmasi eksekusi rencana ini.',
       salesId, ceoId, 'pending', 'medium', 'other', null],
    ];

    for (const [title, desc, fromDiv, toDiv, status, priority, reqType, amount] of approvals) {
      await query(`
        INSERT INTO approvals (title, description, from_division_id, to_division_id, status, priority, request_type, amount, currency, approval_level, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'IDR', 3, $9::uuid)
      `, [title, desc, fromDiv, toDiv, status, priority, reqType, amount, sysUser]);
    }
    results.push('✅ Approvals: 5 records (semua pending, real dari hari ini)');

    // ─── 5. MESSAGES REAL ─────────────────────────────────────────

    const messages = [
      [salesId, ceoId,
       '[DAILY] Sales & Marketing Report — Foundation Prospecting 11 Mei 2026',
       'Yth. Bapak Direktur Utama,\n\nBerikut laporan harian Sales & Marketing hari ini:\n\n✅ SELESAI: Identifikasi 5 yayasan pendidikan high-potential\n\n🔴 P1: Yayasan Kader Bangsa (YPKBI) — 65 sekolah ekspansi 2030\n   Kontak: Dirgayuza Setiawan | info@kaderbangsa.foundation\n   → Rekomendasi: CEO-level outreach SEGERA\n\n🟠 P2: Yayasan Al Firdaus Semesta — Cambridge, 3 kampus\n   Kontak: info@semesta.sch.id\n\n🟠 P3: Yayasan Bunda Mulia — Cambridge PAUD-SMA\n   Kontak: Rita Djoko Susanto\n\n🟡 P4: Indonesia Heritage Foundation (IHF)\n🟡 P5: BINUS School Semarang\n\nTotal market reach: 130+ sekolah\nQuality Score: 93/100 rata-rata\n\nLampiran:\n📎 Arunika_Foundation_Prospecting_Daily_Report.xlsx (7.3 KB)\n📎 Executive_Brief_Foundation_Prospecting.docx (40 KB)\n\nMohon review dan approval untuk memulai outreach Week 1 (12 Mei).\n\nHormat kami,\nDivisi Sales & Marketing\nPT. Arunika Teknologi Global',
       'approval-request', false, 'urgent'],

      [opsId, ceoId,
       '🔴 ESKALASI URGENT: GCP Keys Blocker Day 2 — Week 1 Terancam',
       'Yth. Bapak Direktur Utama,\n\nEskalasi blocker kritis yang perlu tindakan SEGERA:\n\n❌ GCP JSON Keys belum di-download (Day 2 of blocker)\n❌ Deadline 10 Mei terlewat\n❌ Week 1 execution 12 Mei dalam risiko\n\nAPA YANG DIPERLUKAN (5-10 menit):\n1. Buka GCP Console:\n   https://console.cloud.google.com/iam-admin/serviceaccounts\n2. Download JSON untuk:\n   • arunika-central-hub-api\n   • arunika-central-hub-gmail\n3. Update file di config/\n\nDAMPAK JIKA TIDAK DISELESAIKAN HARI INI:\n• Task 3, 5 tetap blocked\n• Week 1 slip → Cascade delay\n• Buffer tersisa: 13 hari (berkurang 1/hari)\n• Go-live June 9: HIGH RISK\n\nSemua 4 GCP APIs sudah enabled. Hanya butuh JSON keys.\n\nHormat kami,\nOps & Finance Division',
       'system-alert', false, 'urgent'],

      [opsId, ceoId,
       'Daily Finance Report: API & Token Usage — 11 Mei 2026',
       'Laporan penggunaan token & kredit harian:\n\n📊 FIRECRAWL API (corser@arunika2045.com)\n• Calls hari ini: 5 (prospecting 5 yayasan)\n• Key: fc-bd687bec30344608bcae35f1b3eabb5f\n• Status: ✅ Operational\n\n📊 MICROSOFT GRAPH API\n• Instances aktif: 4\n• OneDrive sync: ✅ Normal\n• File operations hari ini: 12\n\n📊 CLAUDE API (Anthropic)\n• Scheduled tasks dijalankan: 4\n• Status: ✅ Semua berhasil\n\n💰 BIAYA OPERASIONAL\n• Budget bulanan: $40/month (4 instances)\n• YTD actual: On track\n• ROI proyeksi: 74,900%\n• Savings/bulan: $29,960 vs manual\n\nStatus: ✅ DALAM ANGGARAN',
       'report-generated', true, 'normal'],

      [opsId, ceoId,
       'Daily Status Report: Cowork Hybrid Project — 11 Mei 2026',
       'Status Proyek Cowork Hybrid 4 Instances:\n\n🟠 OVERALL: YELLOW — On Track dengan Critical Blocker\n\n📊 Progress:\n• Infrastructure: 40% (2/5 tasks)\n• Sales Pipeline: ✅ 5 targets aktif\n• Days to go-live: 29 hari (June 9)\n\n✅ Yang sudah selesai:\n• Task 1: GCP Setup (100%)\n• Task 4: APIs Enabled (Google Drive, Gmail, Sheets, Cloud Resource Manager)\n\n🟠 Yang masih blocked:\n• Task 2: Service Account Keys (90% — perlu JSON download)\n• Task 3: Shared Drive (0% — tunggu Task 2)\n• Task 5: Metrics Dashboard (0% — tunggu Task 2)\n\n📈 Week 1 (May 12-16):\n• Probability on-time: 50% (turun dari 75%)\n• Requires: GCP blocker resolved TODAY\n\nReport lengkap: Daily_Status_Report_2026-05-11.md',
       'report-generated', false, 'high'],

      [salesId, ceoId,
       'Submission: Approval Centre — APS-2026-05-11-001',
       'Formal submission untuk CEO approval:\n\nID: APS-2026-05-11-001\nDikirim: 11 Mei 2026, 09:45 AM\n\n3 ITEM MEMBUTUHKAN APPROVAL:\n\n1️⃣ Foundation Selection & Priority Ranking\n   → 5 yayasan teridentifikasi, apakah ranking disetujui?\n\n2️⃣ Outreach Strategy & Authorization\n   → CEO-level outreach ke Kader Bangsa (Dirgayuza Setiawan)\n   → Sales team engagement ke Priority 2-5\n\n3️⃣ Resource Allocation\n   → Account manager assignment\n   → Travel budget ~Rp 15jt untuk Priority 1-3\n   → Engagement timeline: May 12 mulai\n\nApproval window: Hari ini (urgent, Week 1 starts May 12)\n\nChecklist data:\n✅ Contact information verified\n✅ Leadership positions confirmed\n✅ Partnership potential assessed\n✅ Quality assurance: 95/100 passed',
       'approval-request', false, 'urgent'],

      [ceoId, salesId,
       'Arahan Strategis: Prioritaskan Yayasan Kader Bangsa & Bunda Mulia',
       'Tim Sales & Marketing,\n\nUntuk Week 1 (12-16 Mei), fokuskan pada:\n\n1. KADER BANGSA — Saya akan handle langsung setelah approve outreach\n2. BUNDA MULIA — Jadwalkan demo dengan Rita Djoko Susanto, ASAP\n3. AL FIRDAUS — Siapkan multi-campus integration pitch\n\nPastikan semua materi presentasi customize per yayasan.\nJangan pakai template generic — mereka nilai profesionalisme.\n\nWait for my approval sebelum mulai contact.\n\nAdang A. Kunandar\nDirektur Utama\nPT. Arunika Teknologi Global',
       'general', false, 'high'],

      [opsId, salesId,
       'Reminder: Budget Request untuk Travel Meetings — Submit ke CEO',
       'Tim Sales,\n\nUntuk bisa mulai outreach ke yayasan-yayasan di Jakarta, Semarang, dan Depok, perlu submit budget request ke CEO.\n\nEstimasi:\n• Jakarta trip (2x): Rp 4.000.000\n• Semarang trip (2x): Rp 6.000.000\n• Depok trip (1x): Rp 2.000.000\n• Meeting expenses: Rp 3.000.000\n• Total: Rp 15.000.000\n\nSubmission sudah dikirim via Approval Centre (APS-2026-05-11-001).\nTunggu approval CEO sebelum booking travel.\n\nOps & Finance',
       'system-alert', true, 'normal'],
    ];

    for (const [fromDiv, toDiv, subject, body, msgType, isRead, priority] of messages) {
      await query(`
        INSERT INTO messages (from_division_id, to_division_id, sender_id, subject, body, message_type, is_read, priority)
        VALUES ($1, $2, $3::uuid, $4, $5, $6, $7, $8)
      `, [fromDiv, toDiv, sysUser, subject, body, msgType, isRead, priority]);
    }
    results.push('✅ Messages: 7 records (semua dari aktivitas hari ini)');

    // ─── 6. REPORTS REAL ──────────────────────────────────────────

    const reports = [
      [salesId, 'Division Report: Daily Foundation Prospecting — 11 Mei 2026', 'sales-performance', 'complete',
       '{"date":"2026-05-11","total_prospects":5,"high_priority":3,"combined_market_reach":"130+ schools","quality_score_avg":93,"prospects":[{"rank":"P1","name":"Yayasan Kader Bangsa","value":"Very High","schools":65},{"rank":"P2","name":"Al Firdaus Semesta","value":"High","schools":12},{"rank":"P3","name":"Bunda Mulia","value":"High","schools":8},{"rank":"P4","name":"IHF","value":"Medium-High","schools":25},{"rank":"P5","name":"BINUS School","value":"Medium-High","schools":20}],"status":"Ready for CEO Approval"}'],

      [salesId, 'Executive Brief: Foundation Prospecting Strategy — Mei 2026', 'marketing-campaigns', 'complete',
       '{"date":"2026-05-11","document":"Executive_Brief_Foundation_Prospecting.docx","size_kb":40,"target_market":"Yayasan pendidikan multi-sekolah Indonesia","recommended_approach":"CEO-level outreach P1, Sales team P2-5","timeline_week1":"May 12-16: Initial contact Kader Bangsa & Bunda Mulia","pipeline_value":"High — 130+ schools total addressable market"}'],

      [ceoId, 'Daily Status Report: Cowork Hybrid Project — 11 Mei 2026', 'operational', 'complete',
       '{"date":"2026-05-11","overall_status":"YELLOW","infrastructure_progress":"40%","tasks_complete":2,"tasks_blocked":3,"blocker":"GCP JSON Keys Day 2","sales_status":"GREEN — 5 targets","days_to_golive":29,"golive_date":"2026-06-09","week1_probability":"50%","budget_status":"On track — $40/month","team_readiness":"100%"}'],

      [opsId, 'API Token & Credit Usage Report — 11 Mei 2026', 'financial', 'complete',
       '{"date":"2026-05-11","firecrawl_calls":5,"firecrawl_key":"fc-bd687bec...","msgraph_instances":4,"claude_scheduled_runs":4,"monthly_budget_usd":40,"monthly_savings_usd":29960,"roi_percent":74900,"cost_per_automation_usd":0.0046,"status":"On Budget"}'],

      [opsId, 'Budget Projection: Cowork Hybrid Operational Cost Q2 2026', 'financial', 'processing',
       '{"period":"Q2 2026 (Apr-Jun)","monthly_cost":{"central_hub":10,"sales_marketing":10,"finance_ops":10,"ceo_dashboard":10,"total":40},"vs_manual_labor":30000,"savings_monthly":29960,"breakeven":"Already profitable","processes_automated_monthly":8750}'],

      [ceoId, 'Phase 1 Implementation Status Report — Arunika Agentic AI', 'operational', 'complete',
       '{"date":"2026-05-11","phase":"Phase 1 Complete","components":{"prospecting_data_table":"created","api_endpoint":"created","prospecting_view_component":"created","divisional_integration":"complete"},"total_prospects_in_db":5,"api_endpoint":"GET /api/divisions/[divisionId]/prospecting","next_phase":"Phase 2 — Gmail Sync Service (May 12)"}'],
    ];

    for (const [divId, title, rptType, status, content] of reports) {
      await query(`
        INSERT INTO reports (division_id, title, report_type, status, content, generated_by)
        VALUES ($1, $2, $3, $4, $5::jsonb, $6::uuid)
      `, [divId, title, rptType, status, content, sysUser]);
    }
    results.push('✅ Reports: 6 records (semua real dari hari ini)');

    // ─── 7. FINAL COUNT ──────────────────────────────────────────
    const counts = await query(`
      SELECT
        (SELECT COUNT(*) FROM tasks) as tasks,
        (SELECT COUNT(*) FROM approvals) as approvals,
        (SELECT COUNT(*) FROM messages) as messages,
        (SELECT COUNT(*) FROM reports) as reports,
        (SELECT COUNT(*) FROM divisions) as divisions
    `);

    return NextResponse.json({
      success: true,
      message: '🎉 Data real dari Cowork Scheduled Tasks 11 Mei 2026 berhasil diinsert!',
      results,
      counts: counts.rows[0],
    });

  } catch (error: any) {
    console.error('Real seed error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      results,
    }, { status: 500 });
  }
}
