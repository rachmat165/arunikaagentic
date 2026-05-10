# 🚀 ARUNIKA CENTRAL HUB - SETUP INSTRUCTIONS

**Complete Infrastructure Setup Guide**  
**Date**: 2026-05-09  
**Status**: Ready for execution (Tasks 3-5 scripts prepared)

---

## 📋 PREREQUISITE: TASK 2 MUST BE COMPLETE

Before running ANY of the automation scripts, you MUST first complete **Task 2**:

**Action Required**:
1. Obtain actual GCP service account JSON keys
2. Place them in: `config/gcp-service-account.json` and `config/gcp-gmail-sa.json`
3. Verify the private_key field contains actual RSA key material

**See**: `TASK-2-QUICK-CHECKLIST.md` (5-10 minutes to complete)

---

## 🔧 INSTALLATION

### Step 1: Install Python Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# Or install specific packages:
pip install google-auth google-auth-oauthlib google-api-python-client gspread
```

### Step 2: Verify Task 2 Completion

```bash
# Run this to test your GCP credentials
python scripts/test-apis.py
```

**Expected Output**:
```
✅ Drive API: CONNECTED
✅ Gmail API: CONNECTED
✅ Sheets API: CONNECTED
✅ Gspread: AUTHENTICATED

🎉 ALL TESTS PASSED!
```

If you see errors, complete Task 2 first.

---

## 🎯 EXECUTE REMAINING TASKS

### Task 3: Google Drive Setup

```bash
python scripts/setup-task-3-google-drive.py
```

**What it does**:
- Creates folder structure in your shared drive
- Creates README.txt file
- Prepares for data organization

**Manual Steps Needed**:
1. Create the shared drive manually in Google Drive UI
2. Share it with service accounts (Editor role)
3. Run the script and provide the shared drive ID

**Time**: 10-15 minutes

---

### Task 4: Enable APIs & Configure

**This must be done manually in GCP Console**:

1. Go to: https://console.cloud.google.com/apis/library
2. Enable these APIs:
   - **Google Drive API**: search → "Google Drive API" → Enable
   - **Gmail API**: search → "Gmail API" → Enable
   - **Google Sheets API**: search → "Google Sheets API" → Enable
3. Create OAuth Consent Screen:
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Select "Internal"
   - Fill in app info: corsec@arunika2045.com
   - Save

**Time**: 5-10 minutes

---

### Task 5: Create Metrics Dashboard

```bash
python scripts/setup-task-5-metrics-sheet.py
```

**What it does**:
- Creates Google Sheets spreadsheet: "Arunika-Central-Hub-Metrics"
- Creates 4 sheets: Daily-Metrics, Instance-Status, Alerts-Log, Cost-Tracking
- Sets up headers and initial data
- Optionally moves to shared drive

**Time**: 5 minutes

---

## ✅ VERIFICATION & TESTING

### After all tasks complete, run tests:

```bash
# Test APIs again
python scripts/test-apis.py

# Test monitoring script
python scripts/central-hub-monitor.py
```

**Expected Output**:
```
✅ Monitor initialized successfully
✅ Logged metrics for 2026-05-09
✅ Updated Arunika-Central-Hub status to Initializing
✅ Logged alert: INFO (Low)
```

---

## 📊 WHAT YOU'LL HAVE AFTER SETUP

✅ **Google Cloud Project**
- Project: Arunika-Central-Hub
- 2 service accounts with full permissions
- APIs enabled for automation

✅ **Google Drive**
- Shared drive: Arunika-Central-Hub
- Organized folder structure (01-05)
- README documentation
- Service accounts with Editor access

✅ **Google Sheets**
- Metrics dashboard with 4 sheets
- Configured headers and initial data
- Ready for programmatic updates

✅ **Monitoring System**
- central-hub-monitor.py ready to use
- Can log metrics, status, and alerts
- Integrates with your spreadsheet

✅ **Documentation**
- All setup guides completed
- Reference docs in place
- Ready for next phase

---

## 🔄 AUTOMATION AVAILABLE

After setup, you can automate metrics collection:

```bash
# Log daily metrics (run daily)
python -c "from scripts.central_hub_monitor import CentralHubMonitor; m = CentralHubMonitor(); m.log_metric('2026-05-10', 100, 95, 2, '$5.00')"

# Update instance status (run on demand)
python -c "from scripts.central_hub_monitor import CentralHubMonitor; m = CentralHubMonitor(); m.update_instance_status('Arunika-Central-Hub', 'Active', 42, 65)"

# Schedule with cron (Linux/Mac) or Task Scheduler (Windows)
# See: operations/scheduling-guide.md
```

---

## ⚠️ TROUBLESHOOTING

### "Test APIs shows errors"
→ Task 2 not complete or private_key field is invalid  
→ See: TASK-2-QUICK-CHECKLIST.md

### "Script says 'Shared drives require manual creation'"
→ This is expected - create the shared drive in Google Drive UI first  
→ Then provide the drive ID to the script

### "Permission denied on spreadsheet"
→ Service account doesn't have Sheets API enabled  
→ Go to: https://console.cloud.google.com/apis/library  
→ Search "Google Sheets API" and click Enable

### "Can't find my spreadsheet ID"
→ Open Google Sheets  
→ ID is in the URL: https://sheets.google.com/d/**{SPREADSHEET_ID}**/edit

---

## 📞 QUICK REFERENCE

| Task | Script | Time | Manual Steps |
|------|--------|------|--------------|
| 1 | N/A (GCP Console) | 30 min | All manual |
| 2 | N/A (GCP Console + Manual) | 10 min | Copy JSON keys |
| 3 | `setup-task-3-google-drive.py` | 10 min | Create shared drive |
| 4 | N/A (GCP Console) | 10 min | Enable APIs |
| 5 | `setup-task-5-metrics-sheet.py` | 5 min | None |
| Testing | `test-apis.py` + `central-hub-monitor.py` | 5 min | None |
| **TOTAL** | | **~70 min** | |

---

## 🎯 NEXT STEPS AFTER SETUP

1. **Schedule monitoring script**
   - Run `central-hub-monitor.py` daily to log metrics
   - See: operations/scheduling-guide.md

2. **Configure alerts**
   - Set up email notifications for errors
   - See: config/alerts-configuration.md

3. **Deploy automation workflows**
   - Use the metrics dashboard to track 4 instances
   - Start automation workflows
   - See: DAY-01-EXECUTION-GUIDE.md

4. **Integrate with Claude/Gemini**
   - Connect to API endpoints for intelligent processing
   - See: Day 2 setup guide

---

## 📝 DOCUMENTATION MAP

```
Project Root/
├── SETUP-INSTRUCTIONS.md (this file)
├── TASK-2-QUICK-CHECKLIST.md ← START HERE
├── README-TASK-2-BLOCKER.md
├── DAY-01-EXECUTION-GUIDE.md
├── DAY-01-TASK-STATUS.md
│
├── config/
│   ├── gcp-service-account.json (⚠️ Add private key here)
│   ├── gcp-gmail-sa.json (⚠️ Add private key here)
│   └── GCP_KEYS_SETUP_GUIDE.md
│
├── scripts/
│   ├── test-apis.py ← Run first
│   ├── setup-task-3-google-drive.py
│   ├── setup-task-5-metrics-sheet.py
│   └── central-hub-monitor.py
│
└── requirements.txt
```

---

## ✨ SUCCESS CRITERIA

You're done when:

- [ ] Task 2: GCP keys in JSON files ✅
- [ ] Task 3: Google Drive shared drive created with folders ✅
- [ ] Task 4: APIs enabled in GCP console ✅
- [ ] Task 5: Metrics spreadsheet created ✅
- [ ] `python scripts/test-apis.py` shows all PASSED ✅
- [ ] `python scripts/central-hub-monitor.py` runs without errors ✅
- [ ] You can access the metrics spreadsheet ✅

---

## 🚀 YOU'RE READY!

All automation infrastructure is in place. Your Arunika Central Hub is ready for:
- Workflow orchestration
- Multi-instance management
- Automated metrics tracking
- Alert monitoring
- Cost tracking

**Next**: Start the automation workflows (Day 2 onwards)

---

**Questions?**  
See the documentation files listed above or review GCP console logs for detailed error messages.
