#!/usr/bin/env python3
"""
Task 3: Google Drive Setup Automation
Creates shared drive, folder structure, and README
(Requires Task 2 to be complete - valid service account JSON)
"""

import os
import json
import sys
from datetime import datetime

try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    import gspread
    GOOGLE_LIBS_AVAILABLE = True
except ImportError:
    GOOGLE_LIBS_AVAILABLE = False

SERVICE_ACCOUNT_FILE = "config/gcp-service-account.json"

# Folder structure to create
FOLDER_STRUCTURE = {
    "01-Workflows": {
        "daily-briefings": {},
        "hourly-syncs": {},
        "alerts": {}
    },
    "02-Data-Sync": {
        "instance-1-data": {},
        "instance-2-data": {},
        "instance-3-data": {},
        "instance-4-data": {}
    },
    "03-Reports": {
        "system-health": {},
        "cost-tracking": {},
        "automation-metrics": {}
    },
    "04-Config": {
        "api-keys": {},
        "templates": {}
    },
    "05-Backups": {
        "daily": {},
        "weekly": {}
    }
}

README_CONTENT = """ARUNIKA-CENTRAL-HUB SHARED DRIVE
Created: {date}
Owner: corsec@arunika2045.com

This is the central repository for all Cowork Hybrid instances.

STRUCTURE:
/01-Workflows/ - Orchestration data (daily briefings, hourly syncs, alerts)
/02-Data-Sync/ - Inter-instance data transfers
/03-Reports/ - Analytics, monitoring, cost tracking
/04-Config/ - Configuration templates (NO LIVE API KEYS)
/05-Backups/ - Daily and weekly backups

IMPORTANT:
• Do not delete folders
• Do not modify config files directly
• Store actual API keys in environment variables, NOT in 04-Config
• Use service accounts for programmatic access

Questions? Contact: corsec@arunika2045.com
"""


class GoogleDriveSetup:
    """Automate Google Drive shared drive and folder creation"""

    def __init__(self):
        self.creds = None
        self.drive_service = None
        self.sheets_service = None
        self.initialized = False
        self.shared_drive_id = None

    def load_credentials(self):
        """Load and verify service account credentials"""
        print("\n" + "="*60)
        print("TASK 3: GOOGLE DRIVE SETUP")
        print("="*60 + "\n")

        if not GOOGLE_LIBS_AVAILABLE:
            print("❌ Google libraries not installed")
            print("   Install with: pip install google-auth-oauthlib google-api-python-client")
            return False

        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            print(f"❌ Service account file not found: {SERVICE_ACCOUNT_FILE}")
            print("   Complete Task 2 first (obtain GCP service account JSON keys)")
            return False

        try:
            self.creds = Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE,
                scopes=['https://www.googleapis.com/auth/drive']
            )
            self.drive_service = build('drive', 'v3', credentials=self.creds)
            self.sheets_service = build('sheets', 'v4', credentials=self.creds)
            self.initialized = True
            print("✅ Service account credentials loaded")
            return True

        except Exception as e:
            print(f"❌ Error loading credentials: {e}")
            return False

    def create_shared_drive(self, drive_name="Arunika-Central-Hub"):
        """Create a new shared drive"""
        print(f"\n🔹 Creating shared drive: {drive_name}...")
        try:
            # Note: Creating shared drives via service account requires domain-wide delegation
            # This is a limitation - might need manual creation
            print("   ⚠️  Note: Shared drives typically require manual creation")
            print("   Please create manually via Google Drive UI:")
            print(f"   1. Go to https://drive.google.com")
            print(f"   2. Click 'New' → 'Shared drive'")
            print(f"   3. Name: '{drive_name}'")
            print(f"   4. Share with service accounts (Editor role)")
            print("\n   Alternative: Service account can only access existing shared drives")
            return False

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def create_folder(self, parent_id, folder_name):
        """Create a folder in Google Drive"""
        try:
            file_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_id]
            }
            folder = self.drive_service.files().create(
                body=file_metadata,
                fields='id'
            ).execute()

            print(f"   ✅ Created folder: {folder_name}")
            return folder.get('id')

        except Exception as e:
            print(f"   ❌ Error creating folder {folder_name}: {e}")
            return None

    def create_folder_structure(self, parent_id):
        """Recursively create folder structure"""
        print(f"\n🔹 Creating folder structure...")

        for folder_name, subfolders in FOLDER_STRUCTURE.items():
            print(f"\n   📁 {folder_name}/")
            folder_id = self.create_folder(parent_id, folder_name)

            if folder_id and subfolders:
                for subfolder_name in subfolders.keys():
                    self.create_folder(folder_id, subfolder_name)
                    print(f"      📁 {subfolder_name}/")

    def create_readme(self, parent_id):
        """Create README file in the shared drive"""
        print(f"\n🔹 Creating README.txt...")
        try:
            readme_text = README_CONTENT.format(date=datetime.now().strftime("%Y-%m-%d"))

            file_metadata = {
                'name': 'README.txt',
                'mimeType': 'text/plain',
                'parents': [parent_id]
            }

            self.drive_service.files().create(
                body=file_metadata,
                media_body=readme_text.encode(),
                fields='id'
            ).execute()

            print("   ✅ Created README.txt")
            return True

        except Exception as e:
            print(f"   ❌ Error creating README: {e}")
            return False

    def share_with_service_accounts(self, drive_id, service_account_email_1, service_account_email_2):
        """Share drive with service accounts"""
        print(f"\n🔹 Sharing with service accounts...")
        try:
            # Note: Sharing requires manual action or domain admin setup
            print("   ⚠️  Note: Sharing with service accounts requires manual action:")
            print(f"   1. Open the shared drive")
            print(f"   2. Click 'Share' button")
            print(f"   3. Add these service account emails:")
            print(f"      • {service_account_email_1}")
            print(f"      • {service_account_email_2}")
            print(f"   4. Grant 'Editor' role")
            print(f"   5. Uncheck 'Notify people'")
            print(f"   6. Click 'Share'")
            return False

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def run_setup(self):
        """Run the complete setup"""
        if not self.load_credentials():
            return 1

        print("\n📋 SETUP CHECKLIST:")
        print("   [ ] Shared drive created manually via Google Drive UI")
        print("   [ ] Service accounts shared with Editor role")
        print("   [ ] Ready to create folder structure")

        # Since shared drive creation requires manual action, provide instructions
        shared_drive_id = input("\n📌 Enter the Shared Drive ID (or press Enter to skip): ").strip()

        if not shared_drive_id:
            print("\n⚠️  Skipping automated folder creation")
            print("   You can:")
            print("   1. Create folders manually in Google Drive UI")
            print("   2. Or re-run this script with the shared drive ID")
            return 1

        try:
            # Verify drive exists
            drive_info = self.drive_service.files().get(fileId=shared_drive_id).execute()
            print(f"\n✅ Connected to drive: {drive_info.get('name')}")

            # Create folder structure
            self.create_folder_structure(shared_drive_id)

            # Create README
            self.create_readme(shared_drive_id)

            print("\n" + "="*60)
            print("✅ TASK 3 COMPLETE")
            print("="*60)
            print("\nShared drive structure created successfully!")
            print("\nNext Steps:")
            print("   1. Verify folders appear in Google Drive")
            print("   2. Ensure service accounts have access")
            print("   3. Proceed to Task 4: Enable APIs")
            return 0

        except Exception as e:
            print(f"\n❌ Error: {e}")
            return 1


def main():
    """Main entry point"""
    setup = GoogleDriveSetup()
    return setup.run_setup()


if __name__ == "__main__":
    sys.exit(main())
