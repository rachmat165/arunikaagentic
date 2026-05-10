# ⚡ DAY 1 QUICK REFERENCE
## Monday, May 12 - Quick Checklist & Commands

**Start Time**: 09:00 AM  
**Duration**: 3-4 hours  
**Location**: Google Cloud Console + Google Drive + Terminal

---

## 📋 QUICK CHECKLIST

### Pre-Flight (5 minutes)
- [ ] Claude API key ready (`sk-ant-xxxx`)
- [ ] Gemini API key ready (`AIzaSy-xxxx`)
- [ ] Gmail/Drive admin access confirmed
- [ ] 2 people available (DevOps + Backend engineer)
- [ ] GCP console open: https://console.cloud.google.com

### Task 1: GCP Project (30 minutes)
```
1. Go to: https://console.cloud.google.com/projectcreate
2. Click "Create Project"
3. Name: "Arunika-Central-Hub"
4. Click "Create"
5. Wait for creation (2-3 min)
6. Note PROJECT_ID: arunika-central-hub-XXXX
```
**Status**: ☐ DONE

### Task 2: Service Accounts (45 minutes)
```
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. "Create Service Account"
3. Name: "arunika-central-hub-api"
4. Grant: "Editor" role
5. Create JSON key
6. Save to: config/gcp-service-account.json

REPEAT for Gmail:
1. Create second service account: "arunika-central-hub-gmail"
2. Save as: config/gcp-gmail-sa.json
```
**Status**: ☐ DONE

### Task 3: Google Drive (30 minutes)
```
1. Go to: https://drive.google.com
2. Click "New" → "Shared drive"
3. Name: "Arunika-Central-Hub"
4. Create folders:
   - 01-Workflows/
   - 02-Data-Sync/
   - 03-Reports/
   - 04-Config/
   - 05-Backups/
5. Share with service accounts (Editor role)
```
**Status**: ☐ DONE

### Task 4: Enable APIs (45 minutes)
```
Enable these APIs:
1. https://console.cloud.google.com/apis/library/drive.googleapis.com
2. https://console.cloud.google.com/apis/library/gmail.googleapis.com
3. https://console.cloud.google.com/apis/library/sheets.googleapis.com

For each: Click "Enable" and wait
```
**Status**: ☐ DONE

### Task 5: Metrics Sheet (30 minutes)
```
Run from terminal:
$ cd scripts
$ pip install gspread google-auth-oauthlib google-api-python-client
$ python 003-setup-metrics-sheet.py
```
**Status**: ☐ DONE

### Testing (30 minutes)
```
Run from terminal:
$ python 001-test-gcp-apis.py

Expected:
✅ Drive API: CONNECTED
✅ Gmail API: CONNECTED
✅ Sheets API: CONNECTED
✅ ALL TESTS PASSED!
```
**Status**: ☐ DONE

---

## 🚀 QUICK COMMANDS

### Before Day 1
```bash
# Install dependencies
pip install gspread google-auth-oauthlib google-api-python-client

# Create config directory
mkdir -p config
mkdir -p scripts
```

### During Day 1
```bash
# Navigate to project
cd scripts

# Test APIs (after Task 4)
python 001-test-gcp-apis.py

# Setup metrics sheet (after Task 5)
python 003-setup-metrics-sheet.py

# View system status
python 002-central-hub-monitor.py --status

# Log first metrics
python 002-central-hub-monitor.py --log-metrics

# Update Central Hub status
python 002-central-hub-monitor.py --update-status "Arunika-Central-Hub" "Online"
```

---

## 📊 FILES TO CREATE

**By end of Day 1, you'll have:**
```
Arunika Agentic Ai/
├─ config/
│  ├─ gcp-service-account.json (KEEP SECURE!)
│  └─ gcp-gmail-sa.json (KEEP SECURE!)
├─ scripts/
│  ├─ 001-test-gcp-apis.py
│  ├─ 002-central-hub-monitor.py
│  └─ 003-setup-metrics-sheet.py
└─ docs/
   └─ PROJECT_CREDENTIALS.txt (reference only)
```

---

## ⏰ TIMELINE

| Time | Task | Duration | Status |
|------|------|----------|--------|
| 09:00-09:30 | Task 1: GCP Project | 30 min | ☐ |
| 09:30-10:15 | Task 2: Service Accounts | 45 min | ☐ |
| 10:15-10:45 | Task 3: Google Drive | 30 min | ☐ |
| 10:45-11:30 | Task 4: Enable APIs | 45 min | ☐ |
| 11:30-12:00 | Task 5: Metrics Sheet | 30 min | ☐ |
| 12:00-12:30 | Testing & Validation | 30 min | ☐ |
| **TOTAL** | | **3.5 hours** | |

---

## ⚡ QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| API not enabled | Wait 2 min, then refresh the API page |
| Service account not found | Create new following Task 2 steps |
| Permission denied on Drive | Re-share with service account email, grant Editor |
| JSON key missing | Create new key in service account detail page |
| Python import error | Run `pip install` commands (see above) |
| Test fails | Check service account JSON is in correct location |

---

## 💡 PRO TIPS

**Tip 1**: Keep multiple browser tabs open (Dashboard, APIs, Drive) to save time

**Tip 2**: After Task 2, save service account emails:
```
arunika-central-hub-api@PROJECT_ID.iam.gserviceaccount.com
arunika-central-hub-gmail@PROJECT_ID.iam.gserviceaccount.com
```

**Tip 3**: Python scripts can be run multiple times - they're safe to re-run

**Tip 4**: Check the detailed guide (`DAY-01-EXECUTION-GUIDE.md`) if you get stuck

**Tip 5**: All APIs have a 30-second activation delay - be patient!

---

## 📞 QUICK HELP

**Question**: Where's my PROJECT_ID?  
**Answer**: Top of https://console.cloud.google.com - shows as `arunika-central-hub-XXXX`

**Question**: Where do I save JSON keys?  
**Answer**: In your project folder under `config/` directory

**Question**: Can I skip any tasks?  
**Answer**: No - Task 1-4 are all required. Task 5 depends on all others.

**Question**: What if I close my browser?  
**Answer**: All progress is saved in Google Cloud - just log back in and continue

**Question**: How do I know if tests passed?  
**Answer**: Run `python 001-test-gcp-apis.py` - you'll see ✅ or ❌

---

## ✅ SUCCESS CRITERIA

By end of Day 1, you should have:

✅ GCP Project created  
✅ 2 Service accounts configured  
✅ Google Drive shared drive setup  
✅ 5 folders created  
✅ 3 APIs enabled (Drive, Gmail, Sheets)  
✅ Metrics tracking sheet created  
✅ Monitoring scripts working  
✅ All tests passing  

**If all 8 are done → Day 1 COMPLETE! 🎉**

---

## 🚀 READY TO START?

1. **Print this page** (or keep it open in a second monitor)
2. **Open Google Cloud Console**: https://console.cloud.google.com
3. **Start with Task 1**
4. **Follow checklist above**
5. **Check off each task as you complete**

**Questions?** Reference the detailed guide: `DAY-01-EXECUTION-GUIDE.md`

---

**Let's automate! 🚀 Starting at 09:00 AM on May 12, 2026**

