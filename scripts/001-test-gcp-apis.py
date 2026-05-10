#!/usr/bin/env python3
"""
GCP API Connectivity Test
Tests all APIs needed for Arunika-Central-Hub

Usage:
    python 001-test-gcp-apis.py

Requirements:
    pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client gspread
"""

import os
import sys
import json
from datetime import datetime

def test_gcp_setup():
    """Test GCP API connectivity"""

    print("\n" + "="*60)
    print("🔍 ARUNIKA-CENTRAL-HUB: GCP API CONNECTIVITY TEST")
    print("="*60 + "\n")

    # Check service account file
    service_account_file = "../config/gcp-service-account.json"

    if not os.path.exists(service_account_file):
        print("❌ ERROR: Service account file not found!")
        print(f"   Expected location: {service_account_file}")
        print("   Follow Day 1 Task 2 to create this file")
        return False

    print(f"✅ Service account file found: {service_account_file}\n")

    try:
        from google.oauth2.service_account import Credentials
        from googleapiclient.discovery import build
        import gspread
    except ImportError:
        print("❌ ERROR: Required packages not installed")
        print("   Run: pip install google-auth-oauthlib google-api-python-client gspread")
        return False

    # Load credentials
    try:
        creds = Credentials.from_service_account_file(
            service_account_file,
            scopes=[
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/gmail.modify',
                'https://www.googleapis.com/auth/spreadsheets',
            ]
        )
        print("✅ Credentials loaded successfully\n")
    except Exception as e:
        print(f"❌ ERROR loading credentials: {e}")
        return False

    results = {
        "timestamp": datetime.now().isoformat(),
        "tests": {}
    }

    # Test 1: Drive API
    print("Testing Google Drive API...")
    try:
        drive_service = build('drive', 'v3', credentials=creds)
        files = drive_service.files().list(pageSize=1).execute()
        print("   ✅ Drive API: CONNECTED")
        results["tests"]["drive_api"] = "PASSED"
    except Exception as e:
        print(f"   ❌ Drive API: FAILED - {str(e)[:80]}")
        results["tests"]["drive_api"] = "FAILED"

    # Test 2: Gmail API
    print("Testing Google Gmail API...")
    try:
        gmail_service = build('gmail', 'v1', credentials=creds)
        profile = gmail_service.users().getProfile(userId='me').execute()
        email = profile.get('emailAddress', 'unknown')
        print(f"   ✅ Gmail API: CONNECTED (Email: {email})")
        results["tests"]["gmail_api"] = "PASSED"
    except Exception as e:
        print(f"   ❌ Gmail API: FAILED - {str(e)[:80]}")
        results["tests"]["gmail_api"] = "FAILED"

    # Test 3: Sheets API
    print("Testing Google Sheets API...")
    try:
        sheets_service = build('sheets', 'v4', credentials=creds)
        print("   ✅ Sheets API: CONNECTED")
        results["tests"]["sheets_api"] = "PASSED"
    except Exception as e:
        print(f"   ❌ Sheets API: FAILED - {str(e)[:80]}")
        results["tests"]["sheets_api"] = "FAILED"

    # Test 4: Gspread (spreadsheet library)
    print("Testing Gspread library...")
    try:
        gc = gspread.authorize(creds)
        print("   ✅ Gspread: INITIALIZED")
        results["tests"]["gspread"] = "PASSED"
    except Exception as e:
        print(f"   ❌ Gspread: FAILED - {str(e)[:80]}")
        results["tests"]["gspread"] = "FAILED"

    # Summary
    print("\n" + "="*60)
    passed = sum(1 for test in results["tests"].values() if test == "PASSED")
    total = len(results["tests"])

    if passed == total:
        print(f"✅ ALL TESTS PASSED! ({passed}/{total})")
        print("="*60)
        print("\n🎉 Your GCP setup is ready!")
        print("   Next: Run Day 1 Task 5 - Create Monitoring Dashboard")
        return True
    else:
        print(f"⚠️  SOME TESTS FAILED ({passed}/{total} passed)")
        print("="*60)
        print("\nPlease fix the failing tests before continuing.")
        return False

if __name__ == "__main__":
    success = test_gcp_setup()
    sys.exit(0 if success else 1)
