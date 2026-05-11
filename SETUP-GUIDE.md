# Arunika Agentic AI - Divisional Management System Setup Guide

## Overview

This guide walks you through setting up the Divisional Management System for Arunika Agentic AI with real API integration connected to a PostgreSQL database.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ installed and running
- Git configured with GitHub SSH/HTTPS access
- A text editor or IDE (VS Code recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/rachmat165/arunikaagentic.git
cd "Arunika Agentic Ai"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the environment template and configure your database connection:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update:

```env
DATABASE_URL=postgres://username:password@localhost:5432/arunika_agentic
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Setup Database

#### Step 4a: Create Database

```bash
psql -U postgres
CREATE DATABASE arunika_agentic;
\q
```

#### Step 4b: Run Migrations

```bash
psql -U postgres -d arunika_agentic -f database-migrations.sql
```

This will:
- Create all 10 required tables
- Pre-populate divisions: CEO Office, Sales & Marketing, Operations & Finance
- Setup indexes and constraints
- Create audit logging triggers
- Create database views for dashboards

### 5. Verify Database Connection

Start the development server to test the connection:

```bash
npm run dev
```

The server should start without database connection errors.

### 6. Test API Endpoints

With the development server running, test the API endpoints:

```bash
# Fetch tasks for CEO division
curl http://localhost:3000/api/divisions/ceo/tasks?limit=10

# Fetch messages for Sales division
curl http://localhost:3000/api/divisions/sales/messages?limit=10

# Fetch reports for Operations division
curl http://localhost:3000/api/divisions/ops/reports?limit=10

# Fetch approvals for CEO division
curl http://localhost:3000/api/divisions/ceo/approvals?limit=10
```

All endpoints should return a successful response (even if the `data` array is empty initially).

## Project Structure

```
├── app/
│   ├── api/
│   │   └── divisions/
│   │       └── [divisionId]/
│   │           ├── tasks/
│   │           │   └── route.ts          # Tasks API endpoint
│   │           ├── messages/
│   │           │   └── route.ts          # Messages API endpoint
│   │           ├── reports/
│   │           │   └── route.ts          # Reports API endpoint
│   │           └── approvals/
│   │               └── route.ts          # Approvals API endpoint
│   └── divisional-management/
│       └── page.tsx                      # Main page for division management
│
├── components/
│   ├── sidebar.tsx                       # Integrated sidebar with division menu
│   └── DivisionalContent.tsx             # Main content area with Tasks, Mailbox, Reports, Approvals
│
├── lib/
│   ├── database.ts                       # PostgreSQL connection pool and utilities
│   └── types.ts                          # TypeScript type definitions for all data models
│
├── database-migrations.sql               # Complete database schema and initial data
├── API-ENDPOINTS.md                      # API endpoint documentation
├── SETUP-GUIDE.md                        # This file
├── .env.local.example                    # Environment variable template
└── config/
    └── config.template.json              # Config file template
```

## Division IDs

The system includes three divisions. Use these IDs in API calls:

- **CEO Office** - ID: `ceo`
- **Sales & Marketing Division** - ID: `sales`
- **Operations & Finance Division** - ID: `ops`

## API Endpoints

Four main endpoints serve divisional data:

### Tasks Endpoint
```
GET /api/divisions/{divisionId}/tasks?page=1&limit=10&status=in-progress&priority=high
```
Fetch tasks for a division with optional filtering by status and priority.

### Messages Endpoint
```
GET /api/divisions/{divisionId}/messages?page=1&limit=10&unread_only=true
```
Fetch inter-division messages with unread filter support.

### Reports Endpoint
```
GET /api/divisions/{divisionId}/reports?page=1&limit=10&status=complete&report_type=sales-performance
```
Fetch generated reports with filtering by status and report type.

### Approvals Endpoint
```
GET /api/divisions/{divisionId}/approvals?page=1&limit=10&status=pending&approval_level=3
```
Fetch pending approvals with multi-level workflow support.

For complete API documentation, see [API-ENDPOINTS.md](API-ENDPOINTS.md).

## Database Tables

The system uses 10 tables:

1. **divisions** - Organization divisions
2. **tasks** - Tasks assigned within divisions
3. **messages** - Inter-division communication
4. **reports** - Generated reports
5. **approvals** - Multi-level approval workflows
6. **task_assignments** - Task assignment tracking
7. **notification_preferences** - User notification settings
8. **approval_workflows** - Approval workflow definitions
9. **audit_log** - Change audit trail
10. **templates** - Reusable templates for tasks and reports

## Development Workflow

### Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

### Run Type Checking
```bash
npx tsc --noEmit
```

## Adding Data to the Database

### Insert Sample Task
```sql
INSERT INTO tasks (
  id, title, description, division_id, status, priority, due_date, created_at, updated_at
) VALUES (
  gen_random_uuid()::text,
  'Sample Task',
  'This is a sample task',
  'ceo',
  'new',
  'high',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
);
```

### Insert Sample Message
```sql
INSERT INTO messages (
  id, from_division_id, to_division_id, sender_id, subject, body, message_type, is_read, is_archived, priority, created_at, updated_at
) VALUES (
  gen_random_uuid()::text,
  'sales',
  'ceo',
  'user-123',
  'Sales Update',
  'Monthly sales report attached',
  'task-notification',
  false,
  false,
  'high',
  NOW(),
  NOW()
);
```

## Troubleshooting

### Database Connection Error

**Error:** "DATABASE_URL environment variable is not set"

**Solution:** Ensure `.env.local` exists and contains the DATABASE_URL:
```
DATABASE_URL=postgres://user:password@localhost:5432/arunika_agentic
```

### Port Already in Use

**Error:** "Error: listen EADDRINUSE: address already in use :::3000"

**Solution:** Kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PostgreSQL Connection Refused

**Error:** "Error: connect ECONNREFUSED 127.0.0.1:5432"

**Solution:** Start PostgreSQL service:
```bash
# macOS
brew services start postgresql

# Windows (Services)
net start PostgreSQL

# Linux
sudo service postgresql start
```

### TypeScript Errors

**Error:** Type errors in components

**Solution:** Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Git Operations

### Push Implementation to GitHub

Run the provided script:
```bash
./push-api-implementation.bat
```

Or manually:
```bash
git add app/api/ components/ lib/ .env.local.example config/ API-ENDPOINTS.md
git commit -m "Implement API routes for divisional management system"
git push origin main
```

### View Git Log

```bash
git log --oneline -10
```

## Next Steps

1. **Populate with Real Data** - Add actual division, task, and approval data to the database
2. **Implement Authentication** - Add user authentication to the system
3. **Add Write Operations** - Implement POST/PUT endpoints for creating and updating data
4. **Create Admin Dashboard** - Build admin interface for system management
5. **Setup Notifications** - Implement real-time notifications for messages and approvals
6. **Deploy to Production** - Configure and deploy to production environment

## Support and Documentation

- **API Documentation:** See [API-ENDPOINTS.md](API-ENDPOINTS.md)
- **Database Schema:** See [database-migrations.sql](database-migrations.sql)
- **Type Definitions:** See [lib/types.ts](lib/types.ts)
- **Database Utilities:** See [lib/database.ts](lib/database.ts)

## License

This project is part of PT. Arunika Teknologi Global.

**Contact:** corsec@arunika2045.com
