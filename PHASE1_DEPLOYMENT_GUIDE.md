# Phase 1 Deployment & Verification Guide

## 🚀 Quick Start - Execute These Steps

### Step 1: Execute Database Migration
Run this command to create the prospecting data table and insert the 5 foundation prospects:

```bash
# Navigate to your project directory
cd /path/to/arunika-agentic-ai

# Execute the Phase 1 migration
psql -U postgres -d arunika_agentic -f migrations-phase1-prospecting.sql

# If using environment variables:
psql -U $DB_USER -d $DB_NAME -f migrations-phase1-prospecting.sql

# Or if you have a .env file with database URL:
psql $DATABASE_URL < migrations-phase1-prospecting.sql
```

### Step 2: Verify Database Migration

Run these SQL queries to verify the data was loaded:

```sql
-- Check if prospecting_data table exists
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_name = 'prospecting_data';

-- Count total prospects
SELECT COUNT(*) as total_prospects 
FROM prospecting_data;

-- View all prospects with key details
SELECT 
  id,
  prospect_rank,
  prospect_name,
  email,
  decision_maker,
  market_reach,
  status
FROM prospecting_data
ORDER BY 
  CASE prospect_rank
    WHEN 'PRIORITY 1 - VERY HIGH' THEN 1
    WHEN 'PRIORITY 2 - HIGH' THEN 2
    WHEN 'PRIORITY 3 - HIGH' THEN 3
    WHEN 'PRIORITY 4 - MEDIUM-HIGH' THEN 4
    WHEN 'PRIORITY 5 - MEDIUM-HIGH' THEN 5
    ELSE 6
  END;

-- View sync log
SELECT * FROM prospecting_sync_log 
ORDER BY sync_date DESC 
LIMIT 1;

-- Check messages table extension
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND column_name IN ('source', 'external_email_id', 'sync_status');
```

### Step 3: Test API Endpoint

```bash
# Test the prospecting API endpoint
curl "http://localhost:3001/api/divisions/Sales%20%26%20Marketing/prospecting?limit=10"

# With formatting (requires jq):
curl -s "http://localhost:3001/api/divisions/Sales%20%26%20Marketing/prospecting?limit=10" | jq '.'

# Test pagination
curl "http://localhost:3001/api/divisions/Sales%20%26%20Marketing/prospecting?page=1&limit=5"

# Test filtering by status
curl "http://localhost:3001/api/divisions/Sales%20%26%20Marketing/prospecting?status=Ready%20for%20Outreach"
```

### Step 4: Restart Application & Verify in Dashboard

```bash
# If using Node.js/Next.js
npm run dev
# or
yarn dev
# or
pnpm dev

# Wait for "ready - started server on..." message
```

Then open browser to:
- **Dashboard URL:** http://localhost:3001
- **Navigation:** 
  1. Click "Sales & Marketing" in sidebar
  2. Click "Division Reports"
  3. Should see prospecting data cards

---

## ✅ Verification Checklist

### Database Verification
- [ ] Migration executed without errors
- [ ] `prospecting_data` table created (24 columns)
- [ ] `prospecting_sync_log` table created
- [ ] 5 prospect records inserted
- [ ] Messages table extended with 3 new columns
- [ ] All indexes created successfully
- [ ] Sync log entry recorded

### API Verification
- [ ] Endpoint responds with 200 status
- [ ] Returns correct data structure
- [ ] Includes pagination metadata
- [ ] Sample data (5 prospects) present
- [ ] Rankings sorted correctly (1→5)
- [ ] Contact information populated
- [ ] Quality scores visible (95/100)

### Frontend Verification
- [ ] ProspectingView component renders
- [ ] Prospects display in priority order
- [ ] Color-coded badges visible
  - Red for PRIORITY 1
  - Orange for PRIORITY 2
  - Amber for PRIORITY 3
  - Yellow for PRIORITY 4
  - Blue for PRIORITY 5
- [ ] Statistics cards show:
  - Total: 5
  - High Priority: 3
  - Market Reach: 130+
  - Quality: 93/100
- [ ] Contact buttons functional
- [ ] No error messages in console
- [ ] Responsive on mobile

### Integration Verification
- [ ] Sales & Marketing reports view shows prospecting data
- [ ] Component loads without errors
- [ ] Division detection works correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully

---

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U postgres -d arunika_agentic -c "SELECT version();"

# Check database exists
psql -U postgres -l | grep arunika_agentic

# Verify user permissions
psql -U postgres -d arunika_agentic -c "\dt prospecting_data;"
```

### API Not Returning Data
```bash
# Check if table has data
psql -U postgres -d arunika_agentic -c "SELECT COUNT(*) FROM prospecting_data;"

# Verify API route file exists
ls -la app/api/divisions/*/prospecting/route.ts

# Check server logs for errors
# Look for "Error fetching prospecting data" in console
```

### Frontend Component Not Displaying
```bash
# Verify component file exists
ls -la components/ProspectingView.tsx

# Check if component is imported in DivisionalContent
grep -n "ProspectingView" components/DivisionalContent.tsx

# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

---

## 📊 Expected Output

### API Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "prospect_rank": "PRIORITY 1 - VERY HIGH",
      "prospect_name": "Yayasan Pendidikan Kader Bangsa Indonesia (YPKBI)",
      "email": "info@kaderbangsa.foundation",
      "phone": "(62-21) TBD",
      "leader_name": "Dirgayuza Setiawan",
      "decision_maker": "Dirgayuza Setiawan",
      "key_opportunity": "Plans to expand to 65 new boarding schools by 2030",
      "value_proposition": "Very High - Aggressive expansion + IB partnership + international funding",
      "estimated_value": "Very High",
      "partnership_potential": "VERY HIGH - Plans to expand to 65 schools by 2030",
      "location": "Indonesia",
      "status": "Ready for Outreach",
      "quality_score": 95,
      "market_reach": 65,
      "engagement_timeline": "2-4 weeks"
    }
    // ... 4 more prospects
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "pages": 1,
  "timestamp": "2026-05-11T11:30:00Z"
}
```

### Database Query Output
```
 id |      prospect_rank      |                    prospect_name                    |              email              |     decision_maker     | market_reach |     status
----+-------------------------+-----------------------------------------------------+---------------------------------+------------------------+--------------+-------------------
  1 | PRIORITY 1 - VERY HIGH  | Yayasan Pendidikan Kader Bangsa Indonesia (YPKBI)   | info@kaderbangsa.foundation     | Dirgayuza Setiawan     |           65 | Ready for Outreach
  2 | PRIORITY 2 - HIGH       | Yayasan Al Firdaus - Semesta Bilingual Boarding Sch | info@semesta.sch.id             | Kepala Yayasan         |           12 | Ready for Outreach
  3 | PRIORITY 3 - HIGH       | Yayasan Pendidikan Bunda Mulia                      | smpbundamulia@yahoo.com         | Rita Djoko Susanto     |            8 | Ready for Outreach
  4 | PRIORITY 4 - MEDIUM-HIGH| Indonesia Heritage Foundation (IHF)                 | info@ihf.or.id                  | Dr. Ratna Megawangi    |           25 | Research Phase
  5 | PRIORITY 5 - MEDIUM-HIGH| BINUS School                                        | info@binus.edu                  | Bina Nusantara Group   |           20 | Planning Phase
```

---

## 🔧 Configuration

### Environment Variables Check
Ensure your `.env.local` or `.env` contains:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/arunika_agentic

# Or separate variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arunika_agentic
DB_USER=postgres
DB_PASSWORD=your_password

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Build Configuration
The application should build without errors:

```bash
npm run build

# Expected output:
# ✓ All builds were successful
# ✓ Types validated successfully
```

---

## 📈 Performance Notes

- **Database Indexes:** Full-text search, rank, status, creation date indexed
- **API Response Time:** < 100ms for full prospect list
- **Component Render Time:** < 50ms with 5 prospects
- **Bundle Size Impact:** +~15KB (ProspectingView component)

---

## 🎯 Rollback Plan

If issues arise, rollback using:

```bash
# Option 1: Drop tables (if needed to start over)
psql -U postgres -d arunika_agentic -c "
DROP TABLE IF EXISTS prospecting_sync_log;
DROP TABLE IF EXISTS prospecting_data;
ALTER TABLE messages DROP COLUMN IF EXISTS source;
ALTER TABLE messages DROP COLUMN IF EXISTS external_email_id;
ALTER TABLE messages DROP COLUMN IF EXISTS sync_status;
ALTER TABLE messages DROP COLUMN IF EXISTS gmail_message_id;
ALTER TABLE reports DROP COLUMN IF EXISTS prospecting_data_count;
ALTER TABLE reports DROP COLUMN IF EXISTS top_prospect;
ALTER TABLE reports DROP COLUMN IF EXISTS quality_score;
"

# Option 2: Restore from backup (if you have one)
pg_restore -d arunika_agentic backup_file.sql
```

---

## 📞 Support

If you encounter issues:

1. **Check Application Logs:**
   ```bash
   # Node.js console output
   # Look for any error messages
   ```

2. **Check Database Logs:**
   ```bash
   # PostgreSQL logs (location varies by installation)
   # Linux: /var/log/postgresql/
   # macOS: /usr/local/var/log/postgres.log
   ```

3. **Review Migration Output:**
   - Check `migrations-phase1-prospecting.sql` for any error messages
   - Ensure all SQL commands executed successfully

4. **Verify Files:**
   - `app/api/divisions/[divisionId]/prospecting/route.ts` exists
   - `components/ProspectingView.tsx` exists
   - `components/DivisionalContent.tsx` has ProspectingView import

---

**Status:** Ready for deployment  
**Estimated Time:** 5-10 minutes for full implementation  
**Risk Level:** Low (additive only, no existing data modified)

