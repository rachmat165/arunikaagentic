# Database Setup Guide - Arunika Agentic AI

## Current Status
The database setup script has been prepared, but PostgreSQL is not currently running or not accepting TCP connections on `localhost:5432`.

## Prerequisites
Before running the database setup, ensure that:

1. **PostgreSQL is installed** on your Windows machine
   - Download from: https://www.postgresql.org/download/windows/
   - Default installation includes `psql` command-line tool
   - Default credentials: user=`postgres`, password=`postgres`

2. **PostgreSQL service is running**
   - Check Services: Press `Win+R`, type `services.msc`
   - Look for "PostgreSQL" service
   - If stopped, right-click and select "Start"

3. **Port 5432 is accessible**
   - PostgreSQL must be listening on localhost:5432
   - Check in PostgreSQL configuration: `C:\Program Files\PostgreSQL\XX\data\postgresql.conf`

## Setup Methods

### Method 1: Using the Batch File (Recommended)

1. Open Command Prompt
2. Navigate to the project directory:
   ```cmd
   cd P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\"Arunika Agentic Ai"
   ```
3. Run the batch file:
   ```cmd
   setup-database.bat
   ```
4. Wait for all 3 steps to complete successfully

### Method 2: Using PowerShell

1. Open PowerShell
2. Navigate to the project directory:
   ```powershell
   cd 'P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai'
   ```
3. Execute the commands:
   ```powershell
   psql -U postgres -c "CREATE DATABASE arunika_agentic;"
   psql -U postgres -d arunika_agentic -f database-migrations.sql
   psql -U postgres -d arunika_agentic -c "SELECT COUNT(*) as division_count FROM divisions;"
   ```

### Method 3: Using pgAdmin GUI

1. Open pgAdmin (installed with PostgreSQL)
2. Connect to the PostgreSQL server (localhost:5432)
3. Create a new database named `arunika_agentic`
4. Open Query Tool and execute the SQL from `database-migrations.sql`
5. Verify by running: `SELECT COUNT(*) FROM divisions;`

## Troubleshooting

### PostgreSQL Not Running
**Symptom:** Connection refused error
**Solution:**
1. Check if PostgreSQL service is running: `services.msc`
2. Start the service if stopped
3. Verify port 5432: Open pgAdmin and check connection

### Permission Denied Error
**Symptom:** FATAL: Ident authentication failed
**Solution:**
- Ensure you're using the correct credentials (postgres/postgres by default)
- Check `pg_hba.conf` for authentication settings

### Database Already Exists
**Symptom:** ERROR: database "arunika_agentic" already exists
**Solution:**
- This is fine - skip to running migrations
- Or drop and recreate: `psql -U postgres -c "DROP DATABASE IF EXISTS arunika_agentic;"`

## After Setup

Once the database setup is complete:

1. **Verify in pgAdmin:**
   - Connect to `arunika_agentic` database
   - Check that 10 tables were created:
     - divisions
     - tasks
     - messages
     - reports
     - approvals
     - task_assignments
     - notification_preferences
     - approval_workflows
     - audit_log
     - templates

2. **Restart the Application:**
   ```
   npm run dev
   ```

3. **Verify in Browser:**
   - Navigate to http://localhost:3000/divisional-management
   - Should see real data instead of "Error loading" messages

## Environment Variables

The application connects using these environment variables (in `.env.local`):
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/arunika_agentic
```

Verify this matches your PostgreSQL credentials and installation.

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- psql Command Reference: https://www.postgresql.org/docs/current/app-psql.html
- pgAdmin Interface: https://www.pgadmin.org/docs/

---

**For questions or issues, please check the console output for specific error messages.**
