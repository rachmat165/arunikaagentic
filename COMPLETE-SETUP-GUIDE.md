# 🎯 ARUNIKA CENTRAL HUB - COMPLETE SETUP GUIDE

**Status:** Task 2 ✅ Complete | Tasks 3-5 Ready to Execute

---

## 📋 CURRENT PROGRESS

### ✅ Task 2: GCP Service Account Keys (COMPLETE)
- API service account configured
- Gmail service account configured  
- Python credentials verified and working
- Test result: Credentials authenticated ✓

---

## 🚀 REMAINING TASKS (Tasks 3-5)

### Task 3: Google Drive Setup
**Status:** Ready (requires manual shared drive creation)

**What it does:**
- Creates central shared drive repository
- Builds 5-layer folder structure (Workflows, Data-Sync, Reports, Config, Backups)
- Sets up workflow automation paths
- Creates README documentation

**Prerequisites:**
1. Create shared drive manually in Google Drive:
   - Go to https://drive.google.com
   - Click "New" → "Shared drive"
   - Name: `Arunika-Central-Hub`
   - Share with service accounts (Editor role)

2. Note the shared drive ID from URL (format: `0A...`)

**Execute when ready:**
```bash
cd /sessions/friendly-upbeat-noether/mnt/"Arunika Agentic Ai"
python scripts/setup-task-3-google-drive.py --drive-id <YOUR_SHARED_DRIVE_ID>
```

---

### Task 4: Enable GCP APIs
**Status:** Manual GCP Console setup required

**APIs to Enable (in GCP Console):**
1. Google Drive API
2. Google Gmail API  
3. Google Sheets API
4. Google Cloud API (if not auto-enabled)

**Steps:**
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Select project: `arunika-central-hub`
3. For each API:
   - Search for API name
   - Click "Enable"
   - Wait for enablement (usually immediate)
4. Verify service account has Editor role

**Alternative (via gcloud CLI):**
```bash
gcloud services enable drive.googleapis.com gmail.googleapis.com sheets.googleapis.com \
  --project=arunika-central-hub
```

---

### Task 5: Metrics Dashboard
**Status:** Ready (requires Task 4 completion)

**What it does:**
- Creates metrics tracking sheet
- Enables real-time monitoring
- Sets up automation metrics dashboard
- Integrates with central hub

**Execute when ready:**
```bash
cd /sessions/friendly-upbeat-noether/mnt/"Arunika Agentic Ai"
python scripts/setup-task-5-metrics-sheet.py
```

---

## 🔄 QUICK EXECUTION SEQUENCE

```
1. [MANUAL] Create Shared Drive in Google Drive UI
   └─ Note the shared drive ID

2. [AUTOMATED] Run Task 3 Google Drive Setup
   python scripts/setup-task-3-google-drive.py --drive-id <ID>

3. [MANUAL] Enable APIs in GCP Console
   └─ Or use: gcloud services enable ...

4. [AUTOMATED] Run Task 5 Metrics Dashboard  
   python scripts/setup-task-5-metrics-sheet.py

5. [VERIFY] Test complete infrastructure
   python scripts/test-apis.py  (should all pass ✓)
```

---

## 📁 KEY FILES REFERENCE

| File | Purpose | Status |
|------|---------|--------|
| `config/api-keys.json` | API credentials | ✅ Ready |
| `config/gcp-service-account.json` | GCP API service account | ✅ Ready |
| `config/gcp-gmail-sa.json` | GCP Gmail service account | ✅ Ready |
| `scripts/test-apis.py` | Verify all APIs connected | ✅ Ready |
| `scripts/setup-task-3-google-drive.py` | Create Drive structure | ⏳ Ready |
| `scripts/setup-task-5-metrics-sheet.py` | Create metrics sheet | ⏳ Ready |

---

## ⚠️ IMPORTANT NOTES

- **API Keys Security:** All keys are configured and verified
- **Service Accounts:** Both API and Gmail accounts authenticated
- **Drive Access:** Requires manual shared drive creation (GCP limitation)
- **API Enablement:** Manual console action needed (takes 30 seconds per API)
- **Domain Delegation:** If issues arise, may need domain-wide delegation setup

---

## 🎓 TROUBLESHOOTING

**If Task 3 fails:**
- Verify shared drive exists and is named correctly
- Ensure service account has Editor role on shared drive
- Check service account email: `arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com`

**If Task 5 fails:**
- Ensure APIs are enabled (Task 4)
- Verify spreadsheets API has been enabled
- Check service account permissions

**If tests still show 403 errors:**
- Allow 1-2 minutes after enabling APIs (propagation delay)
- Verify service account has project Editor role
- Check API quotas in GCP Console

---

## 📞 CONTACT

**Owner:** corsec@arunika2045.com  
**Project:** Arunika Central Hub  
**Created:** 2026-05-09

