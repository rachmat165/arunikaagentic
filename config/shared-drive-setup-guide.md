# Google Drive Shared Drive Setup Guide

## Status: Manual Creation Required

Due to environment constraints with the automated creation methods, the Google Drive Shared Drive "Arunika-Central-Hub" needs to be created manually through the Google Drive web interface.

## Manual Creation Steps:

### Step 1: Create the Shared Drive
1. Go to https://drive.google.com/drive/u/0/shared-drives
2. Click the "+ Baru" (New) button in the left sidebar
3. Look for "Shared Drive" or "Team Drive" option (may be under "Lainnya" / More)
4. Enter the name: **Arunika-Central-Hub**
5. Click "Buat" (Create) button

### Step 2: Share with Service Account
1. Once created, open the shared drive
2. Click "Bagikan" (Share) button
3. Add the service account email:
   ```
   arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com
   ```
4. Grant **Editor** role
5. Click "Bagikan" (Share)

### Step 3: Get the Shared Drive ID
1. The shared drive ID will be visible in the URL: 
   ```
   https://drive.google.com/drive/folders/0A...
   ```
2. Copy the ID (format: 0A...) 
3. Create/update `config/shared-drive-id.txt` with this ID

## Automated Creation Attempts:
- Python SDK: Failed due to sandbox network restrictions
- REST API: Failed due to sandbox network restrictions
- Web UI automation: Requires interactive browser dialog that doesn't respond to standard click events

## Next Steps:
Once the shared drive is created:
1. Update `config/shared-drive-id.txt` with the drive ID
2. Run `scripts/setup-task-3-google-drive.py` to set up automation
3. Run `scripts/setup-task-5-metrics-sheet.py` to create metrics dashboard

## Service Account Permissions:
The service account has been granted the following API access:
- Google Drive API (v3) - Enabled
- Google Sheets API (v3) - Enabled  
- Gmail API (v1) - Enabled
- Cloud Resource Manager API - Enabled

This allows the automation scripts to programmatically:
- Create and manage folders/files in the shared drive
- Create and update metrics spreadsheets
- Send automated emails via Gmail

## References:
- API Documentation: https://developers.google.com/drive/api/v3/about-shared-drives
- Service Account: arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com
- Project ID: arunika-central-hub
