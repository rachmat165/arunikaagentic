# Divisional Management System - API Endpoints

## Overview

This document describes the REST API endpoints for the Divisional Management System. All endpoints return JSON responses with the following format:

### Response Format

**Paginated List Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10,
  "timestamp": "2026-05-11T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-05-11T10:30:00.000Z"
}
```

## Endpoints

### Tasks

#### GET `/api/divisions/{divisionId}/tasks`

Fetch tasks for a specific division.

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `status` (optional) - Filter by status: `new`, `in-progress`, `pending-approval`, `completed`, `rejected`, `on-hold`
- `priority` (optional) - Filter by priority: `high`, `medium`, `low`

**Example Request:**
```bash
curl http://localhost:3000/api/divisions/ceo/tasks?page=1&limit=10&status=in-progress
```

**Response Fields:**
- `id` - Task ID
- `title` - Task title
- `description` - Task description
- `division_id` - Division ID
- `status` - Current task status
- `priority` - Task priority level
- `start_date` - Task start date
- `due_date` - Task due date
- `assigned_to` - User ID of assignee
- `assigned_by` - User ID of assigner
- `estimated_hours` - Estimated hours to complete
- `actual_hours` - Actual hours spent
- `completion_notes` - Notes on completion
- `tags` - Array of tags
- `attachment_urls` - Array of file URLs
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `completed_at` - Completion timestamp (if completed)

### Messages

#### GET `/api/divisions/{divisionId}/messages`

Fetch messages sent to a specific division.

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `unread_only` (optional, default: false) - Filter unread messages only
- `message_type` (optional) - Filter by type: `general`, `task-notification`, `approval-request`, `system-alert`, `report-generated`

**Example Request:**
```bash
curl http://localhost:3000/api/divisions/ceo/messages?unread_only=true&limit=20
```

**Response Fields:**
- `id` - Message ID
- `from_division_id` - Sender division ID
- `to_division_id` - Recipient division ID
- `sender_id` - Sender user ID
- `recipient_id` - Recipient user ID (optional)
- `subject` - Message subject
- `body` - Message body content
- `message_type` - Type of message
- `is_read` - Boolean indicating if message is read
- `is_archived` - Boolean indicating if message is archived
- `priority` - Message priority: `normal`, `high`, `urgent`
- `thread_id` - Thread ID (optional)
- `reply_to_id` - ID of message being replied to (optional)
- `attachment_urls` - Array of file URLs
- `read_at` - Timestamp when read (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Reports

#### GET `/api/divisions/{divisionId}/reports`

Fetch reports generated for a specific division.

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `status` (optional) - Filter by status: `processing`, `complete`, `failed`, `scheduled`
- `report_type` (optional) - Filter by type: `sales-performance`, `marketing-campaigns`, `financial`, `operational`, `compliance`

**Example Request:**
```bash
curl http://localhost:3000/api/divisions/sales/reports?report_type=sales-performance&status=complete
```

**Response Fields:**
- `id` - Report ID
- `division_id` - Division ID
- `title` - Report title
- `report_type` - Type of report
- `description` - Report description
- `content` - Report content (JSON object)
- `file_url` - URL to downloadable report file
- `file_size_bytes` - Size of report file
- `status` - Report generation status
- `frequency` - Report frequency: `one-time`, `daily`, `weekly`, `monthly`, `quarterly`, `yearly`
- `period_start` - Report period start date
- `period_end` - Report period end date
- `generated_by` - User ID who generated report
- `generated_at` - Generation timestamp
- `scheduled_for` - Scheduled generation time (if scheduled)
- `is_public` - Boolean indicating if report is public
- `metadata` - Additional metadata (JSON object)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Approvals

#### GET `/api/divisions/{divisionId}/approvals`

Fetch approval requests pending for a specific division.

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `status` (optional) - Filter by status: `pending`, `approved`, `rejected`, `revoked`, `expired`
- `request_type` (optional) - Filter by type: `task`, `budget`, `hiring`, `report`, `policy`, `other`
- `approval_level` (optional) - Filter by level: `1` (first), `2` (director), `3` (CEO)

**Example Request:**
```bash
curl http://localhost:3000/api/divisions/ceo/approvals?status=pending&approval_level=3
```

**Response Fields:**
- `id` - Approval ID
- `request_type` - Type of request being approved
- `request_id` - ID of related request
- `from_division_id` - Division requesting approval
- `to_division_id` - Division that must approve
- `approver_id` - User ID of approver
- `approval_level` - Level in approval workflow
- `title` - Approval request title
- `description` - Approval request description
- `details` - Additional details (JSON object)
- `amount` - Amount (for budget approvals)
- `currency` - Currency code
- `status` - Current approval status
- `approval_comment` - Approver's approval comment
- `rejection_reason` - Reason for rejection (if rejected)
- `approved_at` - Approval timestamp
- `rejected_at` - Rejection timestamp
- `approver_notes` - Additional approver notes
- `expires_at` - Expiration timestamp
- `priority` - Request priority: `normal`, `high`, `urgent`
- `attachment_urls` - Array of file URLs
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `404 Not Found` - Division not found
- `500 Internal Server Error` - Server error

## Division IDs

The system recognizes the following division IDs:

- `ceo` - CEO Office
- `sales` - Sales & Marketing Division
- `ops` - Operations & Finance Division

## Usage Examples

### Fetch all pending tasks for CEO Office:
```bash
curl http://localhost:3000/api/divisions/ceo/tasks?status=pending
```

### Fetch unread high-priority messages for Sales division:
```bash
curl http://localhost:3000/api/divisions/sales/messages?unread_only=true&priority=high
```

### Fetch completed financial reports for Operations division:
```bash
curl http://localhost:3000/api/divisions/ops/reports?report_type=financial&status=complete
```

### Fetch pending approvals awaiting CEO approval:
```bash
curl http://localhost:3000/api/divisions/ceo/approvals?status=pending&approval_level=3
```

## Database

The API connects to a PostgreSQL database. Ensure the `DATABASE_URL` environment variable is set with your database connection string:

```
DATABASE_URL=postgres://user:password@localhost:5432/arunika_agentic
```

See `.env.local.example` for additional configuration options.
