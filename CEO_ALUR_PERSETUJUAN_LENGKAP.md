# ALUR PERSETUJUAN CEO — PANDUAN LENGKAP
## PT. Arunika Teknologi Global | Arunika Agentic System

**Direktur Utama:** Adang A. Kunandar  
**Email CEO:** corsec@arunika2045.com  
**Dashboard:** http://localhost:3000/approval  
**Versi:** 1.0 | Tanggal: 12 Mei 2026  

---

## OVERVIEW SISTEM

CEO Agent berperan sebagai **pusat keputusan** dari seluruh output Agent Divisi. Setiap hasil kerja agent divisi WAJIB melalui persetujuan CEO sebelum:
- Dipublikasikan / dikirimkan ke pihak luar
- Dilanjutkan ke tahap/tugas berikutnya
- Dieksekusi (transfer dana, penandatanganan, outreach ke klien)

```
AGENT DIVISI → SUBMIT OUTPUT → CEO REVIEW → KEPUTUSAN → ACTION
```

---

## DAFTAR AGENT DIVISI & TUGAS HARIAN

| Agent | ID | Email | Tugas Harian |
|---|---|---|---|
| Operations Agent | `operations-agentic` | direktur.operasional@arunika2045.com | Proposal, SOP, laporan operasional |
| Sales & Marketing Agent | `sales-marketing-agentic` | direktur.marketing@arunika2045.com | Konten sosmed, prospek, email campaign |
| Finance Agent | `finance-agentic` | direktur.finance@arunika2045.com | Invoice, rekonsiliasi, laporan keuangan |

---

## ALUR KERJA LENGKAP

### FASE 1 — AGENT DIVISI MENJALANKAN TUGAS HARIAN

Setiap hari, masing-masing agent divisi menjalankan tugas sesuai jadwal:

```
08:00 WIB  → Finance Agent: Proses invoice & rekonsiliasi semalam
09:00 WIB  → Sales & Marketing Agent: Generate konten sosmed harian
09:30 WIB  → Operations Agent: Buat laporan status & proposal baru
10:00 WIB  → Semua agent submit hasil ke Approval Queue
```

Setelah tugas selesai, agent **otomatis submit** output ke sistem dengan format:

```json
{
  "task_id": "TASK-2026-05-12-OPS-001",
  "source_agentic": "operations-agentic",
  "task_type": "daily_report",
  "task_title": "Laporan Operasional Harian — 12 Mei 2026",
  "output_data": { ...hasil kerja agent... },
  "next_task_suggestion": "submit_to_client",
  "priority": "high"
}
```

---

### FASE 2 — CEO MENERIMA NOTIFIKASI

CEO mendapat notifikasi melalui:
- **Dashboard** → Badge merah di menu `/approval` menampilkan jumlah pending
- **Email** → Notifikasi otomatis ke corsec@arunika2045.com
- **Summary Harian** → Rangkuman di halaman utama dashboard jam 08:00 WIB

---

### FASE 3 — CEO MEMBUKA DASHBOARD PERSETUJUAN

**URL:** http://localhost:3000/approval

CEO akan melihat:
1. **Daftar Pending** — semua output yang menunggu review, diurutkan prioritas
2. **Detail Task** — klik task untuk lihat output lengkap agent
3. **Panel Aksi** — 3 tombol keputusan + form perintah

---

### FASE 4 — CEO MELAKUKAN REVIEW

Untuk setiap task, CEO membaca:
- Judul & sumber task (dari divisi mana)
- Output/hasil kerja agent
- Rekomendasi next step dari agent
- Waktu menunggu (jam/hari)
- Riwayat revisi sebelumnya (jika ada)

---

### FASE 5 — CEO MEMBUAT KEPUTUSAN (3 Pilihan)

---

#### ✅ KEPUTUSAN 1: APPROVE

**Kapan digunakan:** Output sudah sesuai standar, siap dieksekusi/dipublikasikan

**Langkah CEO:**
1. Baca output agent dengan teliti
2. Klik tombol **[✅ APPROVE & LANJUTKAN]**
3. (Opsional) Isi kolom **"Perintah ke Agent Berikutnya"** jika ada instruksi tambahan
4. Klik **[CONFIRM APPROVE]**

**Yang terjadi setelah APPROVE:**
```
1. Status task → "approved"
2. Agent divisi menerima notifikasi: "APPROVED ✅"
3. Jika ada next_task: agent otomatis lanjut ke tugas berikutnya
4. Jika ada perintah CEO: agent eksekusi perintah tersebut
5. Log masuk ke audit trail
6. Task diarsipkan dengan status COMPLETED
```

**Contoh perintah CEO saat APPROVE:**
```
"Approved. Langsung kirim konten ini ke LinkedIn dan Instagram.
 Jadwalkan posting pukul 11:00 WIB hari ini."
```

---

#### 📝 KEPUTUSAN 2: MINTA REVISI

**Kapan digunakan:** Output perlu diperbaiki sebelum bisa dilanjutkan

**Langkah CEO:**
1. Identifikasi bagian yang perlu diperbaiki
2. Klik tombol **[📝 MINTA REVISI]**
3. Isi kolom **"Instruksi Perbaikan"** dengan perintah yang spesifik
4. Tentukan **deadline revisi** (default: 2 jam)
5. Klik **[KIRIM INSTRUKSI]**

**Yang terjadi setelah MINTA REVISI:**
```
1. Status task → "revision_requested"
2. Agent divisi menerima instruksi perbaikan dari CEO
3. Agent mengerjakan revisi berdasarkan instruksi CEO
4. Agent resubmit hasil revisi ke queue
5. CEO mendapat notifikasi: "Revisi siap direview"
6. CEO review ulang (kembali ke Fase 4)
7. Maksimal revisi: 3 kali (setelah itu auto-escalate)
```

**Format instruksi revisi yang baik:**
```
BAGIAN YANG PERLU DIPERBAIKI:
- [Sebutkan bagian spesifik]

YANG HARUS DIUBAH:
- [Instruksi perubahan yang jelas]

STANDAR YANG DIHARAPKAN:
- [Kriteria penerimaan]

DEADLINE REVISI: [waktu]
```

---

#### ❌ KEPUTUSAN 3: TOLAK

**Kapan digunakan:** Output tidak sesuai, pendekatan salah, atau tidak relevan lagi

**Langkah CEO:**
1. Klik tombol **[❌ TOLAK]**
2. Isi kolom **"Alasan Penolakan"** (wajib diisi)
3. (Opsional) Berikan arahan untuk pendekatan baru
4. Klik **[CONFIRM TOLAK]**

**Yang terjadi setelah TOLAK:**
```
1. Status task → "rejected"
2. Agent divisi menerima notifikasi penolakan + alasan
3. Task diarsipkan (tidak dilanjutkan)
4. Jika ada arahan baru: agent buat task baru dari awal
5. Log penolakan masuk audit trail
```

---

### FASE 6 — ROUTING OTOMATIS

Setelah APPROVE, sistem otomatis melakukan routing berdasarkan tipe task:

| Task Type | Next Action Otomatis |
|---|---|
| `social_media_content` | Post ke LinkedIn/Instagram/Twitter |
| `email_campaign` | Send email ke mailing list |
| `prospect_analysis` | Kirim brief ke Sales Manager |
| `invoice_processing` | Update status invoice di sistem |
| `financial_report` | Distribute ke stakeholder terkait |
| `proposal` | Kirim ke klien/internal dept |
| `sop_document` | Publish ke knowledge base |

---

## STATUS TASK & KODE WARNA

| Status | Kode | Warna | Arti |
|---|---|---|---|
| Menunggu Review | `pending` | 🟡 Kuning | Belum dibaca CEO |
| Dalam Review | `under_review` | 🔵 Biru | CEO sedang baca |
| Disetujui | `approved` | 🟢 Hijau | Approved, dieksekusi |
| Minta Revisi | `revision_requested` | 🟠 Oranye | Agent sedang revisi |
| Revisi Dikirim | `revision_resubmitted` | 🔵 Biru | Menunggu review ulang |
| Ditolak | `rejected` | 🔴 Merah | Tidak dilanjutkan |
| Selesai | `completed` | ⚫ Abu | Archived |

---

## ATURAN & KEBIJAKAN PERSETUJUAN

### SLA (Service Level Agreement) Review:
| Prioritas | Batas Waktu Review CEO |
|---|---|
| URGENT (keuangan/krisis) | Maksimal 1 jam |
| HIGH (deadline klien) | Maksimal 3 jam |
| NORMAL (operasional harian) | Maksimal 24 jam |
| LOW (laporan internal) | Maksimal 48 jam |

### Batas Revisi:
- Maksimal **3 kali revisi** per task
- Jika revisi ke-3 masih ditolak → **CEO review langsung** dengan agent atau task di-reset

### Delegasi (jika CEO tidak available):
- Backup approver: COO / Direktur Operasional
- Harus ada notifikasi delegasi ke sistem
- Delegasi hanya untuk task dengan prioritas NORMAL dan LOW

---

## CONTOH SKENARIO LENGKAP

### Skenario A: Konten Sosmed Disetujui

```
09:00 WIB → Sales & Marketing Agent generate konten LinkedIn
09:15 WIB → Agent submit ke approval queue
09:20 WIB → CEO mendapat notifikasi di dashboard
09:25 WIB → CEO buka dashboard, baca konten
09:28 WIB → CEO klik APPROVE, tambah perintah:
             "Bagus. Posting sekarang. Tambahkan hashtag #Arunika2045"
09:29 WIB → Sistem route ke LinkedIn API → konten dipublikasikan
09:30 WIB → Agent terima konfirmasi → task COMPLETED
```

### Skenario B: Laporan Keuangan Perlu Revisi

```
08:00 WIB → Finance Agent selesai proses invoice bulanan
08:10 WIB → Agent submit laporan ke approval queue
10:00 WIB → CEO review, temukan angka tidak konsisten
10:05 WIB → CEO klik MINTA REVISI, tulis instruksi:
             "Kolom total di Tabel 3 tidak cocok dengan Tabel 1.
              Periksa invoice #INV-2026-089 dan #INV-2026-091.
              Resubmit dalam 2 jam."
10:06 WIB → Finance Agent terima instruksi, mulai perbaikan
11:45 WIB → Finance Agent resubmit laporan yang sudah direvisi
11:50 WIB → CEO review ulang → APPROVE
11:52 WIB → Laporan didistribusikan ke stakeholder
```

### Skenario C: Proposal Ditolak

```
09:30 WIB → Operations Agent submit proposal kerjasama
11:00 WIB → CEO review, nilai pendekatan tidak tepat sasaran
11:05 WIB → CEO klik TOLAK, tulis alasan:
             "Proposal ini terlalu general. Target klien yang salah.
              Fokuskan ke segmen pendidikan K-12, bukan universitas.
              Buat ulang dengan framework value proposition yang berbeda."
11:06 WIB → Operations Agent terima penolakan + arahan
11:10 WIB → Agent mulai buat proposal baru dari awal (task baru)
14:00 WIB → Agent submit proposal baru → masuk approval queue
```

---

## CHECKLIST CEO SEBELUM MEMBUAT KEPUTUSAN

Sebelum APPROVE, pastikan:
- [ ] Output sudah sesuai dengan brief/tujuan awal
- [ ] Tidak ada kesalahan data/fakta
- [ ] Tone dan brand voice sudah tepat
- [ ] Tidak ada informasi sensitif yang tidak perlu dibagikan
- [ ] Next action sudah jelas (jika ada)

Sebelum MINTA REVISI, pastikan instruksi:
- [ ] Spesifik (bukan "perbaiki saja")
- [ ] Actionable (agent bisa langsung kerjakan)
- [ ] Memiliki deadline yang jelas
- [ ] Tidak ambigu

Sebelum TOLAK, pastikan:
- [ ] Alasan penolakan jelas dan objektif
- [ ] Ada arahan untuk pendekatan baru (jika diperlukan)
- [ ] Tidak membatalkan kerja yang masih bisa diselamatkan

---

*Dokumen ini adalah panduan operasional untuk CEO Agentic System PT. Arunika Teknologi Global*  
*Dibuat: 12 Mei 2026 | corsec@arunika2045.com*
