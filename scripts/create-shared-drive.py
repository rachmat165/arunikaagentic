#!/usr/bin/env python3
"""
Create a Google Drive Shared Drive using the Google Drive API.
This script creates a shared drive and shares it with the service account.
"""

import json
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
SERVICE_ACCOUNT_FILE = 'config/gcp-service-account.json'
SHARED_DRIVE_NAME = 'Arunika-Central-Hub'

def authenticate():
    """Authenticate using the service account."""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/drive']
        )
        return credentials
    except Exception as e:
        print(f"Authentication error: {e}")
        sys.exit(1)

def create_shared_drive(service, drive_name):
    """Create a new shared drive."""
    try:
        request_body = {
            'name': drive_name
        }
        response = service.drives().create(body=request_body, fields='id').execute()
        return response.get('id')
    except HttpError as e:
        print(f"Error creating shared drive: {e}")
        sys.exit(1)

def share_drive_with_service_account(service, drive_id, service_account_email):
    """Share the shared drive with the service account."""
    try:
        permission = {
            'type': 'user',
            'emailAddress': service_account_email,
            'role': 'organizer'
        }
        service.permissions().create(
            fileId=drive_id,
            body=permission,
            supportsAllDrives=True,
            fields='id'
        ).execute()
        print(f"Shared drive '{drive_id}' shared with {service_account_email} as organizer")
    except HttpError as e:
        print(f"Error sharing shared drive: {e}")
        sys.exit(1)

def main():
    """Main function."""
    print(f"Creating shared drive: {SHARED_DRIVE_NAME}")

    # Authenticate
    credentials = authenticate()
    service = build('drive', 'v3', credentials=credentials)

    # Get service account email
    with open(SERVICE_ACCOUNT_FILE) as f:
        sa_data = json.load(f)
        service_account_email = sa_data['client_email']

    # Create shared drive
    print(f"Authenticating with service account: {service_account_email}")
    drive_id = create_shared_drive(service, SHARED_DRIVE_NAME)
    print(f"Successfully created shared drive with ID: {drive_id}")

    # Share with service account
    share_drive_with_service_account(service, drive_id, service_account_email)

    # Save the drive ID to a file for reference
    config_data = {
        'shared_drive_id': drive_id,
        'shared_drive_name': SHARED_DRIVE_NAME,
        'service_account_email': service_account_email
    }

    with open('config/shared-drive-config.json', 'w') as f:
        json.dump(config_data, f, indent=2)

    print(f"\nShared drive configuration saved to config/shared-drive-config.json")
    print(json.dumps(config_data, indent=2))

if __name__ == '__main__':
    main()
