#!/bin/bash

# Get access token from service account
SA_FILE="config/gcp-service-account.json"

# Extract the private key and other needed values
PRIVATE_KEY=$(grep '"private_key"' "$SA_FILE" | sed 's/.*"private_key": "\(.*\)".*/\1/')
CLIENT_EMAIL=$(grep '"client_email"' "$SA_FILE" | sed 's/.*"client_email": "\(.*\)".*/\1/')
PROJECT_ID=$(grep '"project_id"' "$SA_FILE" | sed 's/.*"project_id": "\(.*\)".*/\1/')

echo "Service Account Email: $CLIENT_EMAIL"
echo "Project ID: $PROJECT_ID"
echo "Attempting to create shared drive..."
