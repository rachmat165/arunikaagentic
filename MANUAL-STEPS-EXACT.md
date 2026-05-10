# 🔴 MANUAL STEPS YANG HARUS DILAKUKAN (Tidak Bisa Otomasi)

## TASK 3: Buat Shared Drive (2 menit)

### Step 1: Buka Google Drive
```
https://drive.google.com
```

### Step 2: Klik "New" → "Shared drive"
![Klik tombol New di kiri]

### Step 3: Isi nama
```
Name: Arunika-Central-Hub
```

### Step 4: Klik "Create"

### Step 5: Tunggu sampai dibuat, lalu COPY shared drive ID dari URL
```
URL akan seperti: https://drive.google.com/drive/u/0/folders/0A...
ID adalah: 0A... (copy bagian setelah /folders/)
```

### Step 6: Share dengan service account
1. Buka shared drive yang baru dibuat
2. Klik "Share" button
3. Add email: `arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com`
4. Give role: **Editor**
5. Klik "Share"

---

## TASK 4: Enable APIs di GCP Console (3 menit)

### Step 1: Buka GCP Console
```
https://console.cloud.google.com
```

### Step 2: Pilih project
```
Klik project dropdown → arunika-central-hub
```

### Step 3: Buka APIs Library
```
Di sidebar kiri: APIs & Services → Library
```

### Step 4: Enable API #1 - Google Drive API
```
1. Search: "Google Drive API"
2. Click the result
3. Klik "Enable"
4. Tunggu sampai "Enabled"
```

### Step 5: Enable API #2 - Gmail API
```
1. Search: "Gmail API"
2. Click the result
3. Klik "Enable"
4. Tunggu sampai "Enabled"
```

### Step 6: Enable API #3 - Google Sheets API
```
1. Search: "Google Sheets API"
2. Click the result
3. Klik "Enable"
4. Tunggu sampai "Enabled"
```

### Step 7: Verify APIs are enabled
```
Jika semua berwarna "Enabled" di kanan, selesai!
```

---

## DONE? Mari jalankan automation!

Setelah selesai, buka terminal dan jalankan:

```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"

# Task 3b: Setup Drive structure
python scripts/setup-task-3-google-drive.py --drive-id <SHARED_DRIVE_ID>

# Task 5: Create Metrics
python scripts/setup-task-5-metrics-sheet.py

# Verify
python scripts/test-apis.py
```

---

**Total waktu manual: 5 menit**
**Total waktu automation: 5 menit**
