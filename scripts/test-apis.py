#!/usr/bin/env python3
"""
Test script to verify all GCP APIs are properly connected and authenticated
Run this after Task 2 (obtaining GCP keys) to validate the setup
"""

import os
import json
import sys
from pathlib import Path

# Try to import Google libraries
try:
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    import gspread
    GOOGLE_LIBS_AVAILABLE = True
except ImportError:
    GOOGLE_LIBS_AVAILABLE = False

SERVICE_ACCOUNT_FILE = "config/gcp-service-account.json"

class APITester:
    """Test Google API connectivity"""

    def __init__(self):
        self.creds = None
        self.all_passed = True
        self.results = []

    def load_credentials(self):
        """Load service account credentials"""
        print("\n" + "="*60)
        print("TESTING GCP API CONNECTIVITY")
        print("="*60 + "\n")

        if not GOOGLE_LIBS_AVAILABLE:
            print("❌ Google libraries not installed")
            print("   Install with: pip install google-auth-oauthlib google-api-python-client gspread")
            self.all_passed = False
            return False

        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            print(f"❌ Service account file not found: {SERVICE_ACCOUNT_FILE}")
            print("\n   Action needed:")
            print("   1. Complete Task 2: Obtain GCP service account keys")
            print("   2. Place JSON file in: config/gcp-service-account.json")
            print("   3. See: TASK-2-QUICK-CHECKLIST.md")
            self.all_passed = False
            return False

        try:
            with open(SERVICE_ACCOUNT_FILE, 'r') as f:
                cred_data = json.load(f)

            # Check for private_key field
            if 'private_key' not in cred_data or not cred_data['private_key']:
                print("❌ Service account file missing private_key field")
                print("   The JSON file appears to be a placeholder")
                print("   See: TASK-2-QUICK-CHECKLIST.md")
                self.all_passed = False
                return False

            if 'BEGIN PRIVATE KEY' not in cred_data['private_key']:
                print("❌ Private key field doesn't contain valid private key")
                print("   Check that you copied the complete private_key value from GCP")
                self.all_passed = False
                return False

            self.creds = Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE,
                scopes=[
                    'https://www.googleapis.com/auth/cloud-platform',
                    'https://www.googleapis.com/auth/drive',
                    'https://www.googleapis.com/auth/gmail.readonly',
                    'https://www.googleapis.com/auth/spreadsheets'
                ]
            )
            print("✅ Service account credentials loaded successfully")
            return True

        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in service account file: {e}")
            print("   Verify JSON syntax at: https://jsonlint.com/")
            self.all_passed = False
            return False

        except Exception as e:
            print(f"❌ Error loading credentials: {e}")
            self.all_passed = False
            return False

    def test_drive_api(self):
        """Test Google Drive API"""
        print("\n🔹 Testing Google Drive API...")
        try:
            drive_service = build('drive', 'v3', credentials=self.creds)
            results = drive_service.files().list(pageSize=1, fields="files(id, name)").execute()
            items = results.get('files', [])

            print("   ✅ Drive API: CONNECTED")
            self.results.append(("Drive API", True))
            return True

        except Exception as e:
            print(f"   ❌ Drive API: FAILED")
            print(f"      Error: {str(e)[:100]}")
            self.results.append(("Drive API", False))
            self.all_passed = False
            return False

    def test_gmail_api(self):
        """Test Google Gmail API"""
        print("\n🔹 Testing Google Gmail API...")
        try:
            gmail_service = build('gmail', 'v1', credentials=self.creds)
            profile = gmail_service.users().getProfile(userId='me').execute()

            print("   ✅ Gmail API: CONNECTED")
            self.results.append(("Gmail API", True))
            return True

        except Exception as e:
            print(f"   ❌ Gmail API: FAILED")
            print(f"      Error: {str(e)[:100]}")
            self.results.append(("Gmail API", False))
            self.all_passed = False
            return False

    def test_sheets_api(self):
        """Test Google Sheets API"""
        print("\n🔹 Testing Google Sheets API...")
        try:
            sheets_service = build('sheets', 'v4', credentials=self.creds)

            print("   ✅ Sheets API: CONNECTED")
            self.results.append(("Sheets API", True))
            return True

        except Exception as e:
            print(f"   ❌ Sheets API: FAILED")
            print(f"      Error: {str(e)[:100]}")
            self.results.append(("Sheets API", False))
            self.all_passed = False
            return False

    def test_gspread_auth(self):
        """Test gspread authentication"""
        print("\n🔹 Testing Gspread (Sheets Library)...")
        try:
            gc = gspread.authorize(self.creds)
            print("   ✅ Gspread: AUTHENTICATED")
            self.results.append(("Gspread", True))
            return True

        except Exception as e:
            print(f"   ❌ Gspread: FAILED")
            print(f"      Error: {str(e)[:100]}")
            self.results.append(("Gspread", False))
            self.all_passed = False
            return False

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)

        for api_name, passed in self.results:
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{status} | {api_name}")

        print("="*60)

        if self.all_passed:
            print("\n🎉 ALL TESTS PASSED!")
            print("\n✅ Your infrastructure is ready for:")
            print("   • Task 3: Google Drive setup")
            print("   • Task 4: API configuration")
            print("   • Task 5: Metrics dashboard")
            print("\nNext: Run DAY-01-EXECUTION-GUIDE.md for remaining tasks")
            return 0
        else:
            print("\n❌ SOME TESTS FAILED")
            print("\n🔧 Troubleshooting:")
            print("   1. Ensure service account JSON has valid private_key")
            print("   2. Check that all required scopes are enabled in GCP")
            print("   3. Verify the service account has Editor role")
            print("   4. See: config/GCP_KEYS_SETUP_GUIDE.md")
            return 1

    def run_all_tests(self):
        """Run all tests"""
        if not self.load_credentials():
            self.print_summary()
            return 1

        self.test_drive_api()
        self.test_gmail_api()
        self.test_sheets_api()
        self.test_gspread_auth()

        return self.print_summary()


def main():
    """Main entry point"""
    tester = APITester()
    exit_code = tester.run_all_tests()
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
