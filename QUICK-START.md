# ⚡ QUICK START - REMAINING TASKS

## Status: Task 2 ✅ | Tasks 3-5 Ready ⏳

---

## TASK 3 - Google Drive Setup (5 minutes)

### Step 1: Create Shared Drive (Manual - 3 minutes)
```
1. Go to: https://drive.google.com
2. Click "New" → "Shared drive"
3. Name it: Arunika-Central-Hub
4. Click Create
5. Copy the shared drive ID from the URL (format: 0A...)
```

### Step 2: Share with Service Account (1 minute)
```
1. Open the shared drive
2. Click "Share" button
3. Add email: arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com
4. Give "Editor" role
5. Share
```

### Step 3: Run Automation (1 minute)
```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"
python scripts/setup-task-3-google-drive.py --drive-id <YOUR_SHARED_DRIVE_ID>
```

---

## TASK 4 - Enable APIs (2 minutes)

### Quick Option: Google Cloud Console
```
1. Go to: https://console.cloud.google.com
2. Select project: arunika-central-hub
3. Search and enable these 4 APIs:
   ✓ Google Drive API
   ✓ Google Gmail API
   ✓ Google Sheets API
   ✓ Google Cloud API
4. Wait for each to show "Enabled" (usually instant)
```

### Advanced Option: Command Line
```bash
gcloud services enable drive.googleapis.com gmail.googleapis.com \
  sheets.googleapis.com --project=arunika-central-hub
```

---

## TASK 5 - Metrics Dashboard (2 minutes)

### After Task 4 APIs are enabled, run:
```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"
python scripts/setup-task-5-metrics-sheet.py
```

---

## VERIFY EVERYTHING WORKS

### Run Tests
```bash
python scripts/test-apis.py
```

### Expected Output
```
✅ Service account credentials loaded successfully
✅ Google Drive API: PASSED
✅ Gmail API: PASSED
✅ Sheets API: PASSED
✅ Gspread: AUTHENTICATED
```

---

## FILES CREATED

After completing all tasks, you'll have:

**Config Files:**
- ✅ `config/api-keys.json` - All API keys
- ✅ `config/gcp-service-account.json` - API auth
- ✅ `config/gcp-gmail-sa.json` - Gmail auth

**In Google Drive (Arunika-Central-Hub):**
- ✅ `/01-Workflows/` - Orchestration
- ✅ `/02-Data-Sync/` - Inter-instance data
- ✅ `/03-Reports/` - Metrics & monitoring
- ✅ `/04-Config/` - Configuration templates
- ✅ `/05-Backups/` - Daily/weekly backups
- ✅ `README.md` - Documentation

**Metrics Sheet:**
- ✅ Arunika-Central-Hub-Metrics - Live tracking

---

## TROUBLESHOOTING

**"Shared drive not found"**
→ Verify drive ID is correct (starts with 0A)

**"403 Forbidden" errors**
→ Did you enable the APIs in Task 4? Wait 1-2 minutes for propagation

**"Permission denied" on drive**
→ Make sure service account has Editor role on the shared drive

**Script won't run**
→ Are you in the right directory? Use full path:
  `cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"`

---

## TOTAL TIME: ~10 minutes

✅ Manual tasks: ~5 minutes  
✅ Automated tasks: ~5 minutes  
✅ Verification: ~1 minute

---

## Need Help?

- Full setup guide: See `COMPLETE-SETUP-GUIDE.md`
- Infrastructure status: See `INFRASTRUCTURE-STATUS.md`
- Contact: corsec@arunika2045.com

---

**Ready? Start with Task 3 Step 1 above! 🚀**
