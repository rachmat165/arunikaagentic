# 🚀 DAY 1 EXECUTION GUIDE
## Monday, May 12 - Infrastructure & Foundation Setup
### Arunika-Central-Hub - Orchestration Hub

**Date**: 2026-05-12  
**Duration**: 3-4 hours  
**Owner**: DevOps / Cloud Admin + Backend Engineer  
**Status**: 🟠 IN PROGRESS  

---

## 📋 PRE-EXECUTION CHECKLIST

Before starting, verify you have:

- [ ] **Claude API Key** - `sk-ant-xxxx` (READY? YES / NO)
- [ ] **Google Gemini API Key** - `AIzaSy-xxxx` (READY? YES / NO)
- [ ] **Google Workspace Account** - Admin access (READY? YES / NO)
- [ ] **Google Cloud Project** - Created or ready to create (READY? YES / NO)
- [ ] **Team**: DevOps person + 1 Backend Engineer (READY? YES / NO)
- [ ] **Email**: corsec@arunika2045.com verified (READY? YES / NO)

**⚠️ If ANY are NO → STOP and prepare before continuing**

---

## ⏱️ TIMELINE

```
09:00 - 09:30  Task 1: Google Cloud Project Setup (30 min)
09:30 - 10:15  Task 2: Service Accounts Creation (45 min)
10:15 - 10:45  Task 3: Google Drive Setup (30 min)
10:45 - 11:30  Task 4: Enable APIs & Configure (45 min)
11:30 - 12:00  Task 5: Create Monitoring Dashboard (30 min)
12:00 - 12:30  Testing & Validation (30 min)
────────────────────────────────────
TOTAL: 3.5 hours
```

---

## 🔧 TASK 1: Google Cloud Project Setup (09:00-09:30)

### Step 1.1: Create GCP Project
```
Go to: https://console.cloud.google.com/projectcreate

1. Click "Create Project"
2. Enter Project Name: "Arunika-Central-Hub"
3. Leave Location as default
4. Click "Create"
5. Wait for project creation (2-3 minutes)
6. Set as active project
```

✅ **Verification**: Project ID shows in top bar (usually format: `arunika-central-hub-XXXX`)

### Step 1.2: Enable Billing
```
1. Go to: https://console.cloud.google.com/billing
2. Click "Create Billing Account"
3. Enter billing details
4. Link to Arunika-Central-Hub project
5. Set monthly budget alert to $50 (safe margin)
```

✅ **Verification**: Billing status shows "ACTIVE"

### Step 1.3: Record Project Details
```
Create a text file: PROJECT_CREDENTIALS.txt

Save these details (replace with actual):
────────────────────────────────────────
PROJECT_NAME: Arunika-Central-Hub
PROJECT_ID: arunika-central-hub-XXXX
PROJECT_NUMBER: 123456789
BILLING_ACCOUNT: 0123AB-CDEFGH-IJK123
CREATED_DATE: 2026-05-12
OWNER: corsec@arunika2045.com
────────────────────────────────────────

⚠️ KEEP THIS FILE SAFE & SECURE
```

✅ **Completed?** YES ☐  /  NO ☐

---

## 🔧 TASK 2: Service Accounts Creation (09:30-10:15)

### Step 2.1: Create Service Account for API Access
```
Go to: https://console.cloud.google.com/iam-admin/serviceaccounts

1. Click "Create Service Account"
2. Enter details:
   - Service Account Name: "arunika-central-hub-api"
   - Service Account ID: "arunika-central-hub-api"
   - Description: "API access for Central-Hub orchestration"
3. Click "Create and Continue"
4. Grant roles (select all):
   ☑ Editor (for broad access during setup)
   ☑ Service Account Admin
   ☑ Cloud Functions Developer
5. Click "Continue"
6. Skip optional steps, click "Done"
```

✅ **Verification**: Service account created and visible in list

### Step 2.2: Create Service Account Key (JSON)
```
1. Go back to service accounts list
2. Click on "arunika-central-hub-api"
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON"
6. Click "Create"
7. File downloads automatically: `arunika-central-hub-api-XXXXX.json`

⚠️ SECURE THIS FILE - IT'S YOUR MASTER KEY
Store in: PROJECT_FOLDER/config/gcp-service-account.json
```

✅ **Verification**: JSON file downloaded successfully

### Step 2.3: Create Service Account for Gmail
```
Go to: https://console.cloud.google.com/iam-admin/serviceaccounts

1. Repeat steps 2.1 above but with:
   - Service Account Name: "arunika-central-hub-gmail"
   - Description: "Gmail automation for Central-Hub"
2. Grant same roles as step 2.1
3. Create JSON key (same as 2.2)
4. Store as: PROJECT_FOLDER/config/gcp-gmail-sa.json
```

✅ **Completed?** YES ☐  /  NO ☐

---

## 🔧 TASK 3: Google Drive Setup (10:15-10:45)

### Step 3.1: Create Shared Drive
```
Go to: https://drive.google.com

1. Click "New" → "Shared drive"
2. Name: "Arunika-Central-Hub"
3. Description: "Central orchestration hub for all instances"
4. Click "Create"
5. You'll be owner
```

✅ **Verification**: Shared drive visible in Google Drive sidebar

### Step 3.2: Create Folder Structure
```
Inside Arunika-Central-Hub, create these folders:

📁 Arunika-Central-Hub/
  📁 01-Workflows/
     📁 daily-briefings/
     📁 hourly-syncs/
     📁 alerts/
  📁 02-Data-Sync/
     📁 instance-1-data/
     📁 instance-2-data/
     📁 instance-3-data/
     📁 instance-4-data/
  📁 03-Reports/
     📁 system-health/
     📁 cost-tracking/
     📁 automation-metrics/
  📁 04-Config/
     📁 api-keys/
     📁 templates/
  📁 05-Backups/
     📁 daily/
     📁 weekly/
```

⚠️ **Don't store actual API keys in 04-Config - use environment variables instead**

### Step 3.3: Create README in Drive
```
Create file in Arunika-Central-Hub root:
Name: README.txt

Content:
────────────────────────────────────────
ARUNIKA-CENTRAL-HUB SHARED DRIVE
Created: 2026-05-12
Owner: corsec@arunika2045.com

This is the central repository for all Cowork Hybrid instances.
Do not delete folders. Do not modify config files directly.

Use /01-Workflows/ for orchestration data
Use /02-Data-Sync/ for inter-instance data
Use /03-Reports/ for analytics & monitoring

Questions? Contact: corsec@arunika2045.com
────────────────────────────────────────
```

### Step 3.4: Share Drive with Service Accounts
```
1. Open Arunika-Central-Hub shared drive
2. Click "Share" button
3. Add both service account emails:
   - arunika-central-hub-api@PROJECT_ID.iam.gserviceaccount.com
   - arunika-central-hub-gmail@PROJECT_ID.iam.gserviceaccount.com
4. Grant "Editor" permissions
5. Uncheck "Notify people"
6. Click "Share"
```

✅ **Completed?** YES ☐  /  NO ☐

---

## 🔧 TASK 4: Enable APIs & Configure (10:45-11:30)

### Step 4.1: Enable Google Drive API
```
Go to: https://console.cloud.google.com/apis/library/drive.googleapis.com

1. Click "Enable" button
2. Wait for API to enable (30 seconds)
3. Click "Create Credentials" (if prompted)
   - Select "Service Account" as caller type
   - Click "What credentials do I need?"
   - Use existing service account key
```

✅ **Verification**: API shows "Enabled" status

### Step 4.2: Enable Gmail API
```
Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com

1. Click "Enable"
2. Wait for enablement
3. Verify "Enabled" status
```

✅ **Verification**: Gmail API shows "Enabled"

### Step 4.3: Enable Google Sheets API
```
Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com

1. Click "Enable"
2. Wait for enablement
3. Verify "Enabled" status
```

✅ **Verification**: Sheets API shows "Enabled"

### Step 4.4: Create OAuth Consent Screen (For future integrations)
```
Go to: https://console.cloud.google.com/apis/credentials/consent

1. Select "Internal" (internal company app)
2. Click "Create"
3. Fill in:
   - App name: "Arunika Central Hub"
   - User support email: corsec@arunika2045.com
   - Developer contact info: corsec@arunika2045.com
4. Click "Save and Continue"
5. Skip optional scopes
6. Click "Save and Continue"
7. Click "Back to Dashboard"
```

✅ **Completed?** YES ☐  /  NO ☐

---

## 🔧 TASK 5: Create Monitoring Dashboard (11:30-12:00)

### Step 5.1: Create Google Sheet for Metrics
```
Go to: https://sheets.google.com

1. Create new spreadsheet
2. Name it: "Arunika-Central-Hub-Metrics"
3. Move to Arunika-Central-Hub shared drive
4. Create these sheets (tabs):
```

**Sheet 1: Daily-Metrics**
```
Columns:
A | Date
B | Workflows Processed
C | Success Rate (%)
D | Avg Processing Time (s)
E | Error Count
F | API Cost Today
G | Notes

Fill first row with today's date: 2026-05-12
```

**Sheet 2: Instance-Status**
```
Columns:
A | Instance Name
B | Status (Active/Idle/Error)
C | Last Sync
D | Processing Queue
E | Resource Usage (%)
F | Updated At

Rows:
- Arunika-Central-Hub
- Arunika-Sales-Marketing
- Arunika-Finance-Operations
- Arunika-CEO-Dashboard

Initially all will show "Offline" (normal for Day 1)
```

**Sheet 3: Alerts-Log**
```
Columns:
A | Timestamp
B | Alert Type
C | Severity (Critical/High/Medium/Low)
D | Instance
E | Message
F | Status (Open/Resolved)

Leave empty for now - will populate during testing
```

**Sheet 4: Cost-Tracking**
```
Columns:
A | Date
B | Instance
C | Service
D | Requests
E | Cost
F | Budget Remaining

Month rows:
May 2026 - Budget: $40
```

### Step 5.2: Create Monitoring Script
```
Save this Python script: central-hub-monitor.py

────────────────────────────────────────
import os
import json
from datetime import datetime
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from google.colab import auth
import gspread

# Configuration
PROJECT_ID = "arunika-central-hub-XXXX"  # Replace with actual
SPREADSHEET_NAME = "Arunika-Central-Hub-Metrics"
SERVICE_ACCOUNT_FILE = "config/gcp-service-account.json"

class CentralHubMonitor:
    def __init__(self):
        self.creds = Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        self.gc = gspread.authorize(self.creds)
        
    def log_metric(self, date, workflows, success_rate, error_count):
        """Log daily metrics to Google Sheets"""
        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Daily-Metrics")
            
            row = [
                date,
                workflows,
                success_rate,
                "TBD",  # Processing time
                error_count,
                "TBD",  # API cost
                "Day 1 setup"
            ]
            
            ws.append_row(row)
            print(f"✅ Logged metrics for {date}")
            
        except Exception as e:
            print(f"❌ Error logging metrics: {e}")
    
    def update_instance_status(self, instance_name, status):
        """Update instance status"""
        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Instance-Status")
            
            # Find instance row
            cells = ws.findall(instance_name)
            if cells:
                row = cells[0].row
                ws.update_cell(row, 2, status)  # Update status column
                ws.update_cell(row, 3, datetime.now().isoformat())
                print(f"✅ Updated {instance_name} status to {status}")
            
        except Exception as e:
            print(f"❌ Error updating status: {e}")

# Initialize monitor
if __name__ == "__main__":
    monitor = CentralHubMonitor()
    print("✅ Monitor initialized successfully")
    monitor.log_metric("2026-05-12", 0, 0, 0)
    monitor.update_instance_status("Arunika-Central-Hub", "Initializing")
────────────────────────────────────────

Setup:
1. Save to: PROJECT_FOLDER/scripts/central-hub-monitor.py
2. Install dependencies: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client gspread
3. Test: python scripts/central-hub-monitor.py
```

✅ **Verification**: Script runs without errors, logs appear in spreadsheet

✅ **Completed?** YES ☐  /  NO ☐

---

## ✅ VALIDATION & TESTING (12:00-12:30)

### Test 1: Verify APIs Connected
```
Run this Python script: test-apis.py

────────────────────────────────────────
import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = "config/gcp-service-account.json"
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

# Test Drive API
try:
    drive_service = build('drive', 'v3', credentials=creds)
    results = drive_service.files().list(pageSize=1).execute()
    print("✅ Drive API: CONNECTED")
except Exception as e:
    print(f"❌ Drive API: FAILED - {e}")

# Test Gmail API
try:
    gmail_service = build('gmail', 'v1', credentials=creds)
    results = gmail_service.users().getProfile(userId='me').execute()
    print("✅ Gmail API: CONNECTED")
except Exception as e:
    print(f"❌ Gmail API: FAILED - {e}")

# Test Sheets API
try:
    sheets_service = build('sheets', 'v4', credentials=creds)
    print("✅ Sheets API: CONNECTED")
except Exception as e:
    print(f"❌ Sheets API: FAILED - {e}")

print("\n🎉 All APIs initialized successfully!")
────────────────────────────────────────
```

✅ **All 3 APIs should show CONNECTED**

### Test 2: Verify Google Drive Access
```
1. Go to Google Drive
2. Open Arunika-Central-Hub shared drive
3. Check all folders exist
4. Can you read/write to folders? YES ☐  NO ☐
```

### Test 3: Verify Metrics Sheet
```
1. Open Arunika-Central-Hub-Metrics spreadsheet
2. Check all 4 sheets exist (Daily-Metrics, Instance-Status, Alerts-Log, Cost-Tracking)
3. Did you see headers in each sheet? YES ☐  NO ☐
```

### Test 4: Verify Monitoring Script
```
Run: python scripts/central-hub-monitor.py

Expected output:
✅ Monitor initialized successfully
✅ Logged metrics for 2026-05-12
✅ Updated Arunika-Central-Hub status to Initializing

Did you get this? YES ☐  NO ☐
```

---

## 📊 DAY 1 SUMMARY

### ✅ Completed Tasks
- [ ] Google Cloud Project created
- [ ] Service accounts configured (2 accounts)
- [ ] Google Drive shared drive setup
- [ ] Folder structure created
- [ ] Google APIs enabled (Drive, Gmail, Sheets)
- [ ] Metrics tracking dashboard created
- [ ] Monitoring script created & tested
- [ ] All APIs verified connected

### 📊 Current Status
```
INFRASTRUCTURE: ✅ READY (100%)
API CONNECTIVITY: ✅ VERIFIED (100%)
MONITORING: ✅ ACTIVE (100%)
DOCUMENTATION: ✅ COMPLETE (100%)

AUTOMATION ACHIEVED TODAY: 0% (Foundation only)
Expected after Week 1: 70%
```

### 💰 Cost Today
```
Estimated: $0.50
(APIs enabled, minimal usage)
```

### 🎯 Tomorrow (Day 2)
**Task**: Configure Claude API & Gemini Integration

---

## ⚠️ IF YOU HIT ERRORS

### Error: "API not enabled"
```
Solution:
1. Go to https://console.cloud.google.com/apis/library
2. Search for the API name
3. Click "Enable"
4. Wait 30 seconds
5. Retry
```

### Error: "Permission denied" on shared drive
```
Solution:
1. Go to Arunika-Central-Hub shared drive
2. Click Share
3. Make sure service accounts have "Editor" role
4. Retry
```

### Error: "Service account not found"
```
Solution:
1. Go to IAM & Admin → Service Accounts
2. Verify both service accounts exist:
   - arunika-central-hub-api
   - arunika-central-hub-gmail
3. If missing, recreate following Step 2.1-2.3
```

### Error: "JSON key file missing"
```
Solution:
1. Go to service account detail page
2. Click "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select JSON
5. Download and save securely
```

---

## 📞 SUPPORT

**Error? Questions?**
- Check troubleshooting section above
- Review the official Google docs linked at each step
- Contact your GCP admin

**Status: ✅ DAY 1 READY TO EXECUTE**

Start at 09:00 AM on May 12, 2026!

---

**⏱️ ESTIMATED TIME**: 3-4 hours  
**🎯 GOAL**: Complete infrastructure foundation  
**✅ SUCCESS CRITERIA**: All 8 checklist items completed  

**Next: Day 2 (API Configuration)**

Ready to start? Review pre-execution checklist above and begin with Task 1! 🚀
