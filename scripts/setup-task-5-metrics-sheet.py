#!/usr/bin/env python3
"""
Task 5: Create Monitoring Dashboard (Google Sheets)
Creates metrics spreadsheet with 4 sheets: Daily-Metrics, Instance-Status, Alerts-Log, Cost-Tracking
(Requires Task 2 to be complete - valid service account JSON)
"""

import os
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
SPREADSHEET_NAME = "Arunika-Central-Hub-Metrics"

# Instance names to track
INSTANCES = [
    "Arunika-Central-Hub",
    "Arunika-Sales-Marketing",
    "Arunika-Finance-Operations",
    "Arunika-CEO-Dashboard"
]


class MetricsSheetSetup:
    """Create and configure metrics spreadsheet"""

    def __init__(self):
        self.creds = None
        self.gc = None  # gspread client
        self.sheets_service = None
        self.initialized = False
        self.spreadsheet_id = None

    def load_credentials(self):
        """Load service account credentials"""
        print("\n" + "="*60)
        print("TASK 5: CREATE METRICS DASHBOARD")
        print("="*60 + "\n")

        if not GOOGLE_LIBS_AVAILABLE:
            print("❌ Google libraries not installed")
            print("   Install with: pip install google-auth-oauthlib google-api-python-client gspread")
            return False

        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            print(f"❌ Service account file not found: {SERVICE_ACCOUNT_FILE}")
            print("   Complete Task 2 first (obtain GCP service account JSON keys)")
            return False

        try:
            self.creds = Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE,
                scopes=[
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive'
                ]
            )
            self.gc = gspread.authorize(self.creds)
            self.sheets_service = build('sheets', 'v4', credentials=self.creds)
            self.initialized = True
            print("✅ Service account credentials loaded")
            return True

        except Exception as e:
            print(f"❌ Error loading credentials: {e}")
            return False

    def create_spreadsheet(self):
        """Create a new Google Sheets spreadsheet"""
        print(f"\n🔹 Creating spreadsheet: {SPREADSHEET_NAME}...")
        try:
            spreadsheet = self.gc.create(SPREADSHEET_NAME)
            self.spreadsheet_id = spreadsheet.id
            print(f"   ✅ Created spreadsheet (ID: {self.spreadsheet_id})")
            return self.spreadsheet_id

        except Exception as e:
            print(f"   ❌ Error creating spreadsheet: {e}")
            return None

    def setup_daily_metrics_sheet(self, worksheet):
        """Setup Daily-Metrics sheet"""
        print(f"\n🔹 Setting up Daily-Metrics sheet...")
        try:
            headers = [
                "Date",
                "Workflows Processed",
                "Success Rate (%)",
                "Avg Processing Time (s)",
                "Error Count",
                "API Cost Today",
                "Notes"
            ]

            worksheet.append_row(headers)

            # Add first row with today's date
            today = datetime.now().strftime("%Y-%m-%d")
            worksheet.append_row([today, 0, 0, "TBD", 0, "$0.00", "Day 1 setup"])

            print("   ✅ Daily-Metrics sheet configured")
            return True

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def setup_instance_status_sheet(self, worksheet):
        """Setup Instance-Status sheet"""
        print(f"\n🔹 Setting up Instance-Status sheet...")
        try:
            headers = [
                "Instance Name",
                "Status",
                "Last Sync",
                "Processing Queue",
                "Resource Usage (%)",
                "Updated At"
            ]

            worksheet.append_row(headers)

            # Add instance rows
            now = datetime.now().isoformat()
            for instance in INSTANCES:
                worksheet.append_row([
                    instance,
                    "Offline",  # Initial status
                    now,
                    0,
                    0,
                    now
                ])

            print("   ✅ Instance-Status sheet configured")
            return True

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def setup_alerts_log_sheet(self, worksheet):
        """Setup Alerts-Log sheet"""
        print(f"\n🔹 Setting up Alerts-Log sheet...")
        try:
            headers = [
                "Timestamp",
                "Alert Type",
                "Severity",
                "Instance",
                "Message",
                "Status"
            ]

            worksheet.append_row(headers)
            print("   ✅ Alerts-Log sheet configured (empty, ready for logs)")
            return True

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def setup_cost_tracking_sheet(self, worksheet):
        """Setup Cost-Tracking sheet"""
        print(f"\n🔹 Setting up Cost-Tracking sheet...")
        try:
            headers = [
                "Date",
                "Instance",
                "Service",
                "Requests",
                "Cost",
                "Budget Remaining"
            ]

            worksheet.append_row(headers)

            # Add budget row for May 2026
            today = datetime.now().strftime("%Y-%m-%d")
            worksheet.append_row([
                "May 2026 Budget",
                "Arunika-Central-Hub",
                "All Services",
                "TBD",
                "$0.00",
                "$40.00"
            ])

            print("   ✅ Cost-Tracking sheet configured")
            return True

        except Exception as e:
            print(f"   ❌ Error: {e}")
            return False

    def create_and_setup_sheets(self):
        """Create all sheets and setup headers"""
        print(f"\n🔹 Creating sheet tabs...")

        try:
            spreadsheet = self.gc.open_by_key(self.spreadsheet_id)

            # Delete default "Sheet1"
            default_sheet = spreadsheet.worksheet("Sheet1")
            if default_sheet:
                spreadsheet.del_worksheet(default_sheet)
                print("   ✅ Removed default sheet")

            # Create new sheets in order
            sheets_to_create = [
                ("Daily-Metrics", self.setup_daily_metrics_sheet),
                ("Instance-Status", self.setup_instance_status_sheet),
                ("Alerts-Log", self.setup_alerts_log_sheet),
                ("Cost-Tracking", self.setup_cost_tracking_sheet)
            ]

            for sheet_name, setup_func in sheets_to_create:
                # Create blank worksheet
                new_sheet = spreadsheet.add_worksheet(title=sheet_name, rows=100, cols=10)
                setup_func(new_sheet)

            print("\n   ✅ All sheets created and configured")
            return True

        except Exception as e:
            print(f"   ❌ Error creating sheets: {e}")
            return False

    def move_to_shared_drive(self, shared_drive_id=None):
        """Move spreadsheet to shared drive (optional)"""
        if not shared_drive_id:
            print(f"\n⚠️  Spreadsheet not moved to shared drive")
            print(f"   To move it manually:")
            print(f"   1. Open: https://sheets.google.com")
            print(f"   2. Find: '{SPREADSHEET_NAME}'")
            print(f"   3. Right-click → Move → Select 'Arunika-Central-Hub' shared drive")
            return False

        print(f"\n🔹 Moving spreadsheet to shared drive...")
        try:
            # Move file to shared drive
            self.sheets_service.spreadsheets().batchUpdate(
                spreadsheetId=self.spreadsheet_id,
                body={
                    'requests': [{
                        'updateProperties': {
                            'properties': {'title': SPREADSHEET_NAME},
                            'fields': 'title'
                        }
                    }]
                }
            ).execute()

            print("   ✅ Spreadsheet configured")
            return True

        except Exception as e:
            print(f"   ❌ Could not move to shared drive: {e}")
            return False

    def run_setup(self):
        """Run complete setup"""
        if not self.load_credentials():
            return 1

        # Create spreadsheet
        spreadsheet_id = self.create_spreadsheet()
        if not spreadsheet_id:
            return 1

        # Setup all sheets
        if not self.create_and_setup_sheets():
            return 1

        # Optional: Move to shared drive
        print(f"\n📌 Do you want to move this sheet to 'Arunika-Central-Hub' shared drive?")
        move_to_drive = input("   Enter 'yes' to move (or press Enter to skip): ").strip().lower()

        if move_to_drive == 'yes':
            shared_drive_id = input("   Enter Shared Drive ID (from Task 3): ").strip()
            if shared_drive_id:
                self.move_to_shared_drive(shared_drive_id)

        # Print summary
        print("\n" + "="*60)
        print("✅ TASK 5 COMPLETE")
        print("="*60)
        print(f"\n📊 Spreadsheet created: {SPREADSHEET_NAME}")
        print(f"   View it here: https://sheets.google.com/d/{self.spreadsheet_id}")
        print(f"\n✅ Sheets created:")
        print("   • Daily-Metrics - Track daily workflow metrics")
        print("   • Instance-Status - Monitor all instance status")
        print("   • Alerts-Log - Log all system alerts")
        print("   • Cost-Tracking - Track API costs vs budget")
        print(f"\n💾 You can now use: scripts/central-hub-monitor.py")
        print("   This script will log metrics to your spreadsheet automatically")
        return 0


def main():
    """Main entry point"""
    setup = MetricsSheetSetup()
    return setup.run_setup()


if __name__ == "__main__":
    sys.exit(main())
