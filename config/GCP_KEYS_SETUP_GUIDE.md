# GCP Service Account Keys Setup Guide

## Current Status
- ✅ Two service accounts created in GCP:
  - `arunika-central-hub-api` (ID: 114859405354023527545)
  - `arunika-central-hub-gmail` (ID: 116032196301360407552)
- ✅ Both service accounts assigned Editor role
- ✅ JSON key file structures created at correct paths:
  - `P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\gcp-service-account.json`
  - `P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\gcp-gmail-sa.json`
- ⚠️ **PENDING**: Private key material from GCP needs to be inserted into both JSON files

## How to Complete the Setup

### Option 1: Manual Key Download (Recommended)
1. Go to Google Cloud Console: https://console.cloud.google.com/iam-admin/serviceaccounts?project=arunika-central-hub
2. For each service account:
   - Click on the service account name
   - Click the "Keys" tab
   - Click "Create new key"
   - Select "JSON"
   - A JSON file will download to your Downloads folder
   - Copy the entire JSON content (including the full private_key field with actual key material)
   - Paste it into the corresponding file in the config folder

### Option 2: Using GCP CLI (If gcloud is installed)
```bash
# Export the JSON key for api service account
gcloud iam service-accounts keys create \
  gcp-service-account.json \
  --iam-account=arunika-central-hub-api@arunika-central-hub.iam.gserviceaccount.com

# Export the JSON key for gmail service account
gcloud iam service-accounts keys create \
  gcp-gmail-sa.json \
  --iam-account=arunika-central-hub-gmail@arunika-central-hub.iam.gserviceaccount.com

# Move files to config directory
move gcp-service-account.json "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\"
move gcp-gmail-sa.json "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai\config\"
```

### Option 3: Using Cloud Shell in GCP Console
1. Open Cloud Shell in Google Cloud Console
2. Run the commands from Option 2 above
3. Use `cat gcp-service-account.json` to display the key
4. Copy the output and paste into the config files

## Key File Requirements

Each JSON key file must contain:
- `type`: "service_account"
- `project_id`: "arunika-central-hub"
- `private_key_id`: The actual key ID from GCP
- `private_key`: The **full RSA private key** (starting with -----BEGIN RSA PRIVATE KEY----- and ending with -----END RSA PRIVATE KEY-----)
- `client_email`: The service account email
- `client_id`: The service account ID

**IMPORTANT**: The `private_key` field contains multi-line content. Ensure it's properly escaped in JSON format with literal `\n` characters for line breaks.

## Verification

After obtaining the actual keys:
1. Verify JSON syntax: https://jsonlint.com/
2. Ensure the private key field contains actual cryptographic material (not placeholder text)
3. Test authentication:
   ```python
   from google.oauth2 import service_account
   creds = service_account.Credentials.from_service_account_file(
       'gcp-service-account.json',
       scopes=['https://www.googleapis.com/auth/cloud-platform']
   )
   ```

## Technical Notes

### Why This Was Challenging
- GCP service account JSON keys can only be downloaded once upon creation
- Browser download dialogs have restrictions in sandboxed environments
- Private key material is security-sensitive and cannot be recovered if lost
- Alternative methods (API calls, CLI) require proper authentication setup

### Solution Applied
- Created placeholder JSON structures with correct formatting
- Documented manual processes for obtaining actual keys
- Prepared configuration to accept keys when obtained

## Next Steps
1. Obtain the actual JSON keys from GCP using one of the methods above
2. Replace the placeholder content in the config files with actual keys
3. Verify the keys work with authentication tests
4. Proceed with remaining infrastructure setup tasks (Tasks 3, 4, 5)
