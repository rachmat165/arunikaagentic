#!/usr/bin/env python3
"""
Arunika Central Hub Monitoring System
Logs metrics to Google Sheets

Usage:
    python 002-central-hub-monitor.py --log-metrics
    python 002-central-hub-monitor.py --update-status <instance> <status>
"""

import os
import json
import sys
import argparse
from datetime import datetime

class CentralHubMonitor:
    """Monitor and log Central Hub metrics"""

    def __init__(self, spreadsheet_name="Arunika-Central-Hub-Metrics"):
        """Initialize monitor with Google Sheets connection"""

        self.spreadsheet_name = spreadsheet_name
        self.service_account_file = "../config/gcp-service-account.json"

        if not os.path.exists(self.service_account_file):
            raise FileNotFoundError(f"Service account file not found: {self.service_account_file}")

        try:
            import gspread
            from google.oauth2.service_account import Credentials

            creds = Credentials.from_service_account_file(
                self.service_account_file,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            self.gc = gspread.authorize(creds)
            print(f"✅ Connected to Google Sheets")

        except Exception as e:
            raise RuntimeError(f"Failed to initialize Google Sheets: {e}")

    def log_metrics(self, workflows=0, success_rate=0, error_count=0, cost=0, notes=""):
        """Log daily metrics to spreadsheet"""

        try:
            sheet = self.gc.open(self.spreadsheet_name)
            ws = sheet.worksheet("Daily-Metrics")

            row = [
                datetime.now().strftime("%Y-%m-%d"),
                workflows,
                success_rate,
                "N/A",  # Processing time (TBD)
                error_count,
                cost,
                notes or "Day 1 setup"
            ]

            ws.append_row(row)
            print(f"✅ Logged metrics for {row[0]}")
            return True

        except Exception as e:
            print(f"❌ Error logging metrics: {e}")
            return False

    def update_instance_status(self, instance_name, status, notes=""):
        """Update instance status in spreadsheet"""

        try:
            sheet = self.gc.open(self.spreadsheet_name)
            ws = sheet.worksheet("Instance-Status")

            # Get all rows
            all_values = ws.get_all_values()
            row_index = None

            # Find instance row
            for i, row in enumerate(all_values):
                if row and row[0] == instance_name:
                    row_index = i + 1  # +1 for 1-based indexing
                    break

            if row_index:
                ws.update_cell(row_index, 2, status)  # Status column
                ws.update_cell(row_index, 3, datetime.now().isoformat())  # Last sync
                print(f"✅ Updated {instance_name} status to {status}")
                return True
            else:
                print(f"⚠️  Instance '{instance_name}' not found in status sheet")
                return False

        except Exception as e:
            print(f"❌ Error updating status: {e}")
            return False

    def log_alert(self, alert_type, severity, instance, message):
        """Log alert to alerts log"""

        try:
            sheet = self.gc.open(self.spreadsheet_name)
            ws = sheet.worksheet("Alerts-Log")

            row = [
                datetime.now().isoformat(),
                alert_type,
                severity,
                instance,
                message,
                "Open"
            ]

            ws.append_row(row)
            print(f"✅ Logged {severity} alert: {message}")
            return True

        except Exception as e:
            print(f"❌ Error logging alert: {e}")
            return False

    def get_status(self):
        """Get current system status"""

        try:
            sheet = self.gc.open(self.spreadsheet_name)

            # Get instance statuses
            ws_status = sheet.worksheet("Instance-Status")
            instances = ws_status.get_all_records()

            # Get recent metrics
            ws_metrics = sheet.worksheet("Daily-Metrics")
            metrics = ws_metrics.get_all_records()

            print("\n" + "="*60)
            print("📊 ARUNIKA-CENTRAL-HUB: SYSTEM STATUS")
            print("="*60 + "\n")

            print("Instance Status:")
            for inst in instances:
                status = inst.get('Status (Active/Idle/Error)', 'Unknown')
                print(f"  • {inst.get('Instance Name', 'Unknown')}: {status}")

            if metrics:
                latest = metrics[-1]
                print(f"\nLatest Metrics ({latest.get('Date', 'N/A')}):")
                print(f"  • Workflows: {latest.get('Workflows Processed', 0)}")
                print(f"  • Success Rate: {latest.get('Success Rate (%)', 0)}%")
                print(f"  • Errors: {latest.get('Error Count', 0)}")
                print(f"  • Cost: ${latest.get('API Cost Today', 0)}")

            print("\n" + "="*60 + "\n")
            return True

        except Exception as e:
            print(f"❌ Error getting status: {e}")
            return False


def main():
    """Main entry point"""

    parser = argparse.ArgumentParser(description="Arunika Central Hub Monitor")
    parser.add_argument("--log-metrics", action="store_true", help="Log current metrics")
    parser.add_argument("--update-status", nargs=2, metavar=("instance", "status"), help="Update instance status")
    parser.add_argument("--log-alert", nargs=4, metavar=("type", "severity", "instance", "message"), help="Log alert")
    parser.add_argument("--status", action="store_true", help="Get system status")

    args = parser.parse_args()

    try:
        monitor = CentralHubMonitor()

        if args.status:
            monitor.get_status()

        elif args.log_metrics:
            monitor.log_metrics(
                workflows=0,
                success_rate=0,
                error_count=0,
                cost=0,
                notes="Day 1: Infrastructure setup"
            )

        elif args.update_status:
            instance, status = args.update_status
            monitor.update_instance_status(instance, status)

        elif args.log_alert:
            alert_type, severity, instance, message = args.log_alert
            monitor.log_alert(alert_type, severity, instance, message)

        else:
            # Default: Show status
            monitor.get_status()

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
