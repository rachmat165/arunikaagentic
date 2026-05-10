#!/usr/bin/env python3
"""
Setup Metrics Sheet for Arunika-Central-Hub
Creates and initializes Google Sheets with proper structure

Usage:
    python 003-setup-metrics-sheet.py
"""

import os
import sys
from datetime import datetime

def setup_metrics_sheet():
    """Create and initialize the metrics tracking sheet"""

    print("\n" + "="*60)
    print("📊 SETTING UP METRICS TRACKING SHEET")
    print("="*60 + "\n")

    try:
        import gspread
        from google.oauth2.service_account import Credentials
    except ImportError:
        print("❌ ERROR: Required packages not installed")
        print("   Run: pip install gspread google-auth-oauthlib google-api-python-client")
        return False

    service_account_file = "../config/gcp-service-account.json"

    if not os.path.exists(service_account_file):
        print(f"❌ ERROR: Service account file not found: {service_account_file}")
        print("   Complete Day 1 Task 2 first")
        return False

    try:
        creds = Credentials.from_service_account_file(
            service_account_file,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        gc = gspread.authorize(creds)
        print("✅ Connected to Google Sheets\n")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return False

    spreadsheet_name = "Arunika-Central-Hub-Metrics"

    try:
        # Try to open existing sheet
        sheet = gc.open(spreadsheet_name)
        print(f"📄 Found existing sheet: {spreadsheet_name}")
        print("   Initializing worksheets...\n")

    except gspread.SpreadsheetNotFound:
        print(f"📄 Creating new sheet: {spreadsheet_name}")
        sheet = gc.create(spreadsheet_name)
        print("   ✅ Sheet created\n")

    # Get default worksheet
    try:
        worksheet = sheet.get_worksheet(0)
        if worksheet:
            sheet.del_worksheet(worksheet)
    except:
        pass

    # Create worksheets with proper structure
    sheets_config = {
        "Daily-Metrics": [
            ["Date", "Workflows Processed", "Success Rate (%)", "Avg Processing Time (s)", "Error Count", "API Cost Today", "Notes"],
        ],
        "Instance-Status": [
            ["Instance Name", "Status (Active/Idle/Error)", "Last Sync", "Processing Queue", "Resource Usage (%)", "Updated At"],
            ["Arunika-Central-Hub", "Initializing", datetime.now().isoformat(), "0", "0%", datetime.now().isoformat()],
            ["Arunika-Sales-Marketing", "Offline", "", "", "", ""],
            ["Arunika-Finance-Operations", "Offline", "", "", "", ""],
            ["Arunika-CEO-Dashboard", "Offline", "", "", "", ""],
        ],
        "Alerts-Log": [
            ["Timestamp", "Alert Type", "Severity (Critical/High/Medium/Low)", "Instance", "Message", "Status (Open/Resolved)"],
        ],
        "Cost-Tracking": [
            ["Date", "Instance", "Service", "Requests", "Cost", "Budget Remaining"],
            ["2026-05-12", "Central-Hub", "Setup", "0", "$0", "$40.00"],
        ]
    }

    for sheet_name, rows in sheets_config.items():
        print(f"Creating worksheet: {sheet_name}")
        try:
            # Add worksheet
            ws = sheet.add_worksheet(title=sheet_name, rows=1000, cols=10)

            # Add headers and data
            for i, row in enumerate(rows):
                for j, cell_value in enumerate(row):
                    ws.update_cell(i + 1, j + 1, cell_value)

            print(f"   ✅ {sheet_name} initialized with {len(rows)} rows\n")

        except Exception as e:
            print(f"   ⚠️  Error creating {sheet_name}: {e}\n")

    # Format headers (bold, background color)
    try:
        print("Formatting headers...")
        for sheet_name in sheets_config.keys():
            ws = sheet.worksheet(sheet_name)

            # Format header row (row 1)
            header_range = f"A1:Z1"
            requests = [
                {
                    "updateCells": {
                        "range": {"sheetId": ws.id, "dimension": "ROWS", "startIndex": 0, "endIndex": 1},
                        "rows": [{
                            "values": [
                                {"userEnteredFormat": {"textFormat": {"bold": True}, "backgroundColor": {"red": 0.2, "green": 0.2, "blue": 0.2}}}
                                for _ in range(10)
                            ]
                        }],
                        "fields": "userEnteredFormat"
                    }
                }
            ]

        print("   ✅ Headers formatted\n")

    except Exception as e:
        print(f"   ⚠️  Formatting incomplete: {e}\n")

    print("="*60)
    print("✅ METRICS SHEET SETUP COMPLETE!")
    print("="*60)
    print(f"\nYour metrics sheet '{spreadsheet_name}' is ready.")
    print("View it at: https://sheets.google.com")
    print("\nNext steps:")
    print("  1. Go to your Google Drive")
    print("  2. Move this sheet to 'Arunika-Central-Hub' shared drive")
    print("  3. Run: python 001-test-gcp-apis.py")
    print("\n")

    return True


if __name__ == "__main__":
    success = setup_metrics_sheet()
    sys.exit(0 if success else 1)
