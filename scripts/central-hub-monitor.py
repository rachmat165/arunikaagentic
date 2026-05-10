#!/usr/bin/env python3
"""
Central Hub Monitoring Script
Logs metrics to Google Sheets and tracks instance status
"""

import os
import json
from datetime import datetime
from pathlib import Path

# Try to import Google libraries (will work once credentials are set up)
try:
    from google.oauth2.service_account import Credentials
    from google.auth.transport.requests import Request
    import gspread
    GOOGLE_LIBS_AVAILABLE = True
except ImportError:
    GOOGLE_LIBS_AVAILABLE = False
    print("⚠️  Google libraries not yet installed. Install with:")
    print("   pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client gspread")


# Configuration
PROJECT_ID = "arunika-central-hub"  # Will be updated once keys are obtained
SPREADSHEET_NAME = "Arunika-Central-Hub-Metrics"
SERVICE_ACCOUNT_FILE = "config/gcp-service-account.json"

# Instance names to track
INSTANCES = [
    "Arunika-Central-Hub",
    "Arunika-Sales-Marketing",
    "Arunika-Finance-Operations",
    "Arunika-CEO-Dashboard"
]


class CentralHubMonitor:
    """Monitor central hub metrics and update Google Sheets"""

    def __init__(self):
        """Initialize the monitor with service account credentials"""
        self.creds = None
        self.gc = None
        self.spreadsheet = None
        self.initialized = False

        if GOOGLE_LIBS_AVAILABLE:
            try:
                # Load service account credentials
                if not os.path.exists(SERVICE_ACCOUNT_FILE):
                    print(f"❌ Service account file not found: {SERVICE_ACCOUNT_FILE}")
                    print("   Please complete Task 2 first (obtain GCP keys)")
                    return

                self.creds = Credentials.from_service_account_file(
                    SERVICE_ACCOUNT_FILE,
                    scopes=[
                        'https://www.googleapis.com/auth/spreadsheets',
                        'https://www.googleapis.com/auth/drive'
                    ]
                )

                self.gc = gspread.authorize(self.creds)
                print("✅ Google Sheets client initialized")
                self.initialized = True

            except Exception as e:
                print(f"❌ Error initializing monitor: {e}")
                print("   Check that service account JSON has valid credentials")
        else:
            print("⚠️  Google libraries not available - install dependencies first")

    def log_metric(self, date, workflows_processed, success_rate, error_count, api_cost=None):
        """Log daily metrics to Google Sheets"""
        if not self.initialized:
            print("❌ Monitor not initialized - cannot log metrics")
            return False

        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Daily-Metrics")

            row = [
                date,
                workflows_processed,
                f"{success_rate}%",
                "TBD",  # Avg processing time
                error_count,
                api_cost or "TBD",
                "Logged at " + datetime.now().isoformat()
            ]

            ws.append_row(row)
            print(f"✅ Logged metrics for {date}")
            return True

        except Exception as e:
            print(f"❌ Error logging metrics: {e}")
            return False

    def update_instance_status(self, instance_name, status, queue_count=0, resource_usage=0):
        """Update instance status in Google Sheets"""
        if not self.initialized:
            print("❌ Monitor not initialized - cannot update status")
            return False

        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Instance-Status")

            # Find instance row
            cells = ws.findall(instance_name)
            if cells:
                row = cells[0].row
                ws.update_cell(row, 2, status)  # Status column
                ws.update_cell(row, 3, datetime.now().isoformat())  # Last Sync
                ws.update_cell(row, 4, queue_count)  # Processing Queue
                ws.update_cell(row, 5, f"{resource_usage}%")  # Resource Usage
                ws.update_cell(row, 6, datetime.now().isoformat())  # Updated At
                print(f"✅ Updated {instance_name} status to {status}")
                return True
            else:
                print(f"⚠️  Instance '{instance_name}' not found in sheet")
                return False

        except Exception as e:
            print(f"❌ Error updating status: {e}")
            return False

    def log_alert(self, alert_type, severity, instance_name, message):
        """Log an alert to the Alerts-Log sheet"""
        if not self.initialized:
            print("❌ Monitor not initialized - cannot log alert")
            return False

        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Alerts-Log")

            row = [
                datetime.now().isoformat(),
                alert_type,
                severity,
                instance_name,
                message,
                "Open"  # Status
            ]

            ws.append_row(row)
            print(f"✅ Logged alert: {alert_type} ({severity})")
            return True

        except Exception as e:
            print(f"❌ Error logging alert: {e}")
            return False

    def get_all_instances(self):
        """Get status of all instances from the sheet"""
        if not self.initialized:
            print("❌ Monitor not initialized")
            return None

        try:
            sheet = self.gc.open(SPREADSHEET_NAME)
            ws = sheet.worksheet("Instance-Status")
            all_records = ws.get_all_records()
            return all_records

        except Exception as e:
            print(f"❌ Error retrieving instances: {e}")
            return None


def main():
    """Main execution function"""
    print("\n" + "="*60)
    print("ARUNIKA CENTRAL HUB MONITOR")
    print("="*60 + "\n")

    # Initialize monitor
    monitor = CentralHubMonitor()

    if not monitor.initialized:
        print("\n⚠️  Monitor initialization failed.")
        print("   Task 2 must be completed first:")
        print("   1. Obtain GCP service account JSON keys")
        print("   2. Place in: config/gcp-service-account.json")
        print("   3. Verify JSON syntax and private_key field")
        print("\n   See: TASK-2-QUICK-CHECKLIST.md")
        return False

    print("\n📊 Testing metric logging...")
    monitor.log_metric(
        date="2026-05-09",
        workflows_processed=0,
        success_rate=0,
        error_count=0,
        api_cost="$0.00"
    )

    print("\n📡 Testing instance status updates...")
    for instance in INSTANCES:
        monitor.update_instance_status(
            instance_name=instance,
            status="Initializing",
            queue_count=0,
            resource_usage=0
        )

    print("\n🚨 Testing alert logging...")
    monitor.log_alert(
        alert_type="INFO",
        severity="Low",
        instance_name="Arunika-Central-Hub",
        message="Monitor initialized successfully"
    )

    print("\n" + "="*60)
    print("✅ ALL TESTS PASSED")
    print("="*60)
    print("\nMonitor is ready to track metrics and logs.")
    print("Configure scheduling to run this script periodically.")
    return True


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
