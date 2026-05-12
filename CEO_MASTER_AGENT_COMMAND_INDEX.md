# INDEKS MASTER — SISTEM PERINTAH CEO KE AGENT DIVISI
## PT. Arunika Teknologi Global | Arunika Agentic System

**CEO:** Adang A. Kunandar | corsec@arunika2045.com  
**Dashboard:** http://localhost:3000/approval  
**Dibuat:** 12 Mei 2026 | Versi 1.0  

---

## DOKUMEN DALAM SISTEM INI

| # | Dokumen | Isi | Untuk Siapa |
|---|---|---|---|
| 1 | `CEO_ALUR_PERSETUJUAN_LENGKAP.md` | Panduan lengkap alur approve/revisi/tolak | CEO |
| 2 | `CEO_PROMPT_OPERATIONS_AGENT.md` | Semua prompt & perintah untuk Operations | Operations Agent |
| 3 | `CEO_PROMPT_SALES_MARKETING_AGENT.md` | Semua prompt & perintah untuk Sales & Marketing | Sales & Marketing Agent |
| 4 | `CEO_PROMPT_FINANCE_AGENT.md` | Semua prompt & perintah untuk Finance | Finance Agent |
| 5 | `CEO_MASTER_AGENT_COMMAND_INDEX.md` | Dokumen ini — indeks & quick reference | Semua |

---

## QUICK REFERENCE: JADWAL TUGAS HARIAN AGENT

```
07:30 WIB  Finance Agent     → Rekap posisi keuangan harian
08:00 WIB  CEO               → Review rekap keuangan di dashboard
09:00 WIB  Sales & Marketing → Generate konten sosmed harian
09:00 WIB  Finance Agent     → Proses invoice masuk
09:30 WIB  Operations Agent  → Laporan status operasional harian
09:30 WIB  Sales & Marketing → Laporan prospek harian
10:00 WIB  Semua Agent       → Semua task sudah masuk approval queue
10:00 WIB  CEO               → Review & approve batch task pagi
           (target selesai sebelum 12:00 WIB)
```

---

## QUICK REFERENCE: 3 KEPUTUSAN CEO

```
✅ APPROVE    → Lanjut eksekusi / distribusi / publikasi
📝 REVISI     → Agent perbaiki berdasarkan instruksi CEO, resubmit
❌ TOLAK      → Dihentikan, task baru jika diperlukan
```

---

## QUICK REFERENCE: KODE TASK ID

| Divisi | Prefix Task | Contoh |
|---|---|---|
| Operations | TASK-OPS-XXX | TASK-OPS-001 |
| Sales & Marketing | TASK-SM-XXX | TASK-SM-001 |
| Finance | TASK-FIN-XXX | TASK-FIN-001 |
| Perintah Approve | APPROVE-[DIV]-X | APPROVE-OPS-A |
| Perintah Revisi | REVISI-[DIV]-XXX | REVISI-FIN-001 |
| Perintah Khusus | KHUSUS-[DIV]-XXX | KHUSUS-SM-001 |

---

## QUICK REFERENCE: BATAS WEWENANG AGENT

| Agent | Bisa Tanpa CEO | WAJIB Approval CEO |
|---|---|---|
| Operations | Draft laporan, update database internal | Kirim ke eksternal, buat komitmen, ubah SOP |
| Sales & Marketing | Riset, draft konten/email | Posting sosmed, kirim email, outreach prospek |
| Finance | Buat laporan, rekonsiliasi | Pembayaran apapun, kirim laporan keuangan |

---

## CARA AGENT SUBMIT KE APPROVAL QUEUE

Setiap agent submit melalui API:
```
POST /api/approvals/submit
Headers: x-agent-id: [operations/sales-marketing/finance]-agentic
Body: {
  "task_id": "TASK-[DIV]-[NOMOR]",
  "task_type": "[tipe task]",
  "task_title": "[judul task]",
  "output_data": { ...hasil kerja... },
  "priority": "URGENT/HIGH/NORMAL/LOW"
}
```

---

## CARA CEO MELIHAT & APPROVE

1. Buka: http://localhost:3000/approval
2. Pilih task dari daftar pending
3. Baca output agent
4. Pilih: APPROVE / REVISI / TOLAK
5. (Jika Revisi) Tulis instruksi spesifik
6. Klik CONFIRM

---

*Semua dokumen dalam sistem ini adalah dokumen operasional resmi*
*PT. Arunika Teknologi Global | corsec@arunika2045.com | arunika2045.com*
*Jl. Calung No. 7, Kota Bandung, Jawa Barat, Indonesia*
