# Dashboard Synchronization Implementation Guide
**Date:** May 11, 2026  
**Priority:** HIGH - Required for complete integration  
**Estimated Effort:** 4-6 hours development time

---

## Problem Statement

Daily sales & marketing prospecting data has been successfully compiled and emailed to CEO, but **data is NOT appearing in dashboard divisional menus** because:

1. ❌ Sales & Marketing division menus are not populated
2. ❌ Gmail emails not syncing to dashboard mailbox
3. ❌ Prospecting data not loaded into database
4. ❌ API endpoints not configured

---

## Solution Architecture

### Current Data Flow (Broken)
```
Gmail → (Email sent ✅) → CEO Inbox
         ↓
    prospecting-data.json (Created ✅)
         ↓
    Dashboard Mailbox ❌ (Not synced)
         ↓
    Division Menus ❌ (Empty)
```

### Target Data Flow (Fixed)
```
Gmail → Email sent ✅ → CEO Inbox
  ↓
prospecting-data.json ✅
  ↓
Backend API Service
  ↓
Database Tables:
  - prospecting_data
  - divisional_mailbox
  ↓
API Endpoints:
  - /api/divisions/sales-marketing/mailbox
  - /api/divisions/sales-marketing/reports
  - /api/prospecting-data
  ↓
Dashboard UI Components:
  - Sales & Marketing Mailbox
  - Sales & Marketing Reports
  - Sales & Marketing Approval Center
  ↓
User Views: Sales & Marketing Menus ✅
```

---

## Implementation Steps

### Step 1: Database Schema Update (15 minutes)

```sql
-- Connect to PostgreSQL
psql -U postgres -d arunika_agentic -c "

-- Create prospecting_data table
CREATE TABLE IF NOT EXISTS prospecting_data (
    id SERIAL PRIMARY KEY,
    division_id VARCHAR(50) NOT NULL,
    rank_position INTEGER NOT NULL,
    foundation_name VARCHAR(255) NOT NULL,
    priority_level VARCHAR(50),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website_url VARCHAR(255),
    opportunity_description TEXT,
    opportunity_scope VARCHAR(100),
    curriculum_type VARCHAR(100),
    schools_estimated INTEGER,
    multi_level_school BOOLEAN,
    decision_maker_contact BOOLEAN,
    market_reach INTEGER,
    quality_score NUMERIC(3,1),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(division_id, rank_position)
);

-- Extend divisional_mailbox table
ALTER TABLE divisional_mailbox 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'internal',
ADD COLUMN IF NOT EXISTS external_email_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS sync_status VARCHAR(50) DEFAULT 'pending';

-- Create prospecting sync log
CREATE TABLE IF NOT EXISTS prospecting_sync_log (
    id SERIAL PRIMARY KEY,
    sync_date DATE,
    records_synced INTEGER,
    status VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prospecting_division ON prospecting_data(division_id);
CREATE INDEX IF NOT EXISTS idx_prospecting_rank ON prospecting_data(rank_position);
CREATE INDEX IF NOT EXISTS idx_mailbox_sync_status ON divisional_mailbox(sync_status);
"
```

### Step 2: Data Import (10 minutes)

```sql
-- Import prospecting data from JSON file
INSERT INTO prospecting_data (
    division_id, rank_position, foundation_name, priority_level,
    contact_name, contact_email, website_url,
    opportunity_description, curriculum_type, schools_estimated,
    quality_score, created_at
) VALUES
-- RANK 1: YPKBI
('sales-marketing', 1, 'Yayasan Pendidikan Kader Bangsa Indonesia (YPKBI)', 'VERY_HIGH',
 'Dirgayuza Setiawan', 'info@kaderbangsa.foundation', 'kaderbangsa.foundation',
 '65 new boarding schools by 2030', 'International Baccalaureate (IB)', 65,
 95.0, NOW()),

-- RANK 2: Semesta Bilingual
('sales-marketing', 2, 'Yayasan Al Firdaus - Semesta Bilingual Boarding School', 'HIGH',
 'TBD', 'info@semesta.sch.id', 'semesta.sch.id',
 '3-campus integration in Semarang', 'Cambridge International', 3,
 95.0, NOW()),

-- RANK 3: Bunda Mulia
('sales-marketing', 3, 'Yayasan Pendidikan Bunda Mulia', 'HIGH',
 'Rita Djoko Susanto', 'smpbundamulia@yahoo.com', 'bundamulia.sch.id',
 'Multi-level reference implementation (PAUD-SMA)', 'Cambridge Pathway', 5,
 95.0, NOW()),

-- RANK 4: Indonesia Heritage Foundation
('sales-marketing', 4, 'Indonesia Heritage Foundation (IHF)', 'MEDIUM_HIGH',
 'TBD', 'TBD', 'TBD',
 'Character-Based Holistic Education network', 'CBHE', 20,
 90.0, NOW()),

-- RANK 5: BINUS School
('sales-marketing', 5, 'BINUS School (Semarang)', 'MEDIUM_HIGH',
 'TBD', 'TBD', 'TBD',
 'Enterprise-wide Bina Nusantara Group implementation', 'Cambridge International', 15,
 90.0, NOW());

-- Insert prospecting email to mailbox
INSERT INTO divisional_mailbox (
    division_id, from_user, to_user, subject, message_preview,
    source, external_email_id, sync_status, created_at
) VALUES
('sales-marketing', 'system@arunika.com', 'corsec@arunika2045.com',
 '[DAILY] Sales & Marketing Report - Foundation Prospecting [2026-05-11]',
 'Prospecting analysis with 5 foundation prospects - YPKBI (RANK 1, VERY HIGH priority)',
 'gmail', 'GTvVlcSDZdDcmHgDbxXQCRzNcLWWLpRCvrGFCMWpfkCpBFGPQgdMbpzTqgWjGszhRXbDsVfmqfMpp',
 'synced', NOW());

-- Log the sync
INSERT INTO prospecting_sync_log (sync_date, records_synced, status, details)
VALUES (NOW()::DATE, 5, 'success', 'Prospecting data imported from daily report');
```

### Step 3: API Endpoints (30 minutes)

Create new file: `src/pages/api/divisions/sales-marketing/index.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { menu } = req.query;

  try {
    switch (menu) {
      case 'mailbox':
        return await getMailbox(req, res);
      case 'reports':
        return await getReports(req, res);
      case 'approvals':
        return await getApprovals(req, res);
      default:
        return res.status(400).json({ error: 'Invalid menu' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMailbox(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM divisional_mailbox 
       WHERE division_id = 'sales-marketing' 
       ORDER BY created_at DESC`
    );
    return res.status(200).json({ messages: result.rows });
  } finally {
    client.release();
  }
}

async function getReports(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM prospecting_data 
       WHERE division_id = 'sales-marketing' 
       ORDER BY rank_position ASC`
    );
    return res.status(200).json({ 
      report_name: 'Daily Sales & Marketing Prospecting [2026-05-11]',
      prospects: result.rows,
      summary: {
        total_prospects: result.rows.length,
        high_priority: result.rows.filter(r => ['VERY_HIGH', 'HIGH'].includes(r.priority_level)).length,
        market_reach: result.rows.reduce((sum, r) => sum + (r.schools_estimated || 0), 0),
        quality_score: 95
      }
    });
  } finally {
    client.release();
  }
}

async function getApprovals(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  try {
    // Get pending approvals for Sales & Marketing
    const result = await client.query(
      `SELECT * FROM approvals 
       WHERE division_id = 'sales-marketing' 
       AND status = 'pending'
       ORDER BY created_at DESC`
    );
    return res.status(200).json({ 
      approvals: result.rows,
      pending_count: result.rows.length 
    });
  } finally {
    client.release();
  }
}
```

### Step 4: Frontend Routes (30 minutes)

Update: `src/pages/divisional-management.tsx`

```typescript
import SalesMarketingMailbox from '@/components/divisions/SalesMarketingMailbox';
import SalesMarketingReports from '@/components/divisions/SalesMarketingReports';
import SalesMarketingApprovals from '@/components/divisions/SalesMarketingApprovals';

const DivisionalManagement = () => {
  const { div, menu } = useRouter().query;

  const renderDivisionContent = () => {
    if (div === 'sales-marketing') {
      switch (menu) {
        case 'mailbox':
          return <SalesMarketingMailbox />;
        case 'reports':
          return <SalesMarketingReports />;
        case 'approvals':
          return <SalesMarketingApprovals />;
        default:
          return <div>Select a menu</div>;
      }
    }
    // ... existing code for other divisions
  };

  return (
    <div className="divisional-management">
      <Sidebar division={div} />
      {renderDivisionContent()}
    </div>
  );
};
```

### Step 5: Create UI Components (60 minutes)

Create: `src/components/divisions/SalesMarketingMailbox.tsx`

```typescript
import { useEffect, useState } from 'react';

export default function SalesMarketingMailbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMailbox();
  }, []);

  const fetchMailbox = async () => {
    try {
      const res = await fetch('/api/divisions/sales-marketing?menu=mailbox');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch mailbox:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading mailbox...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales & Marketing - Mailbox</h1>
      {messages.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          No messages available for this division.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h3 className="font-semibold">{msg.subject}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">{msg.message_preview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

Create: `src/components/divisions/SalesMarketingReports.tsx`

```typescript
import { useEffect, useState } from 'react';

export default function SalesMarketingReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/divisions/sales-marketing?menu=reports');
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading reports...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales & Marketing - Division Reports</h1>
      
      {report && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900">{report.report_name}</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-white p-4 rounded">
                <div className="text-3xl font-bold">{report.summary.total_prospects}</div>
                <div className="text-sm text-gray-600">Total Prospects</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-3xl font-bold text-green-600">{report.summary.high_priority}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-3xl font-bold">{report.summary.market_reach}+</div>
                <div className="text-sm text-gray-600">Schools Reach</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-3xl font-bold text-yellow-600">{report.summary.quality_score}/100</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Foundation Prospects</h3>
            <div className="space-y-4">
              {report.prospects.map((prospect, idx) => (
                <div key={prospect.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                          RANK {prospect.rank_position}
                        </span>
                        <h4 className="font-semibold">{prospect.foundation_name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{prospect.opportunity_description}</p>
                      {prospect.contact_email && (
                        <p className="text-sm text-blue-600 mt-1">{prospect.contact_email}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      prospect.priority_level === 'VERY_HIGH' ? 'bg-red-100 text-red-800' :
                      prospect.priority_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {prospect.priority_level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Update Sidebar Navigation (10 minutes)

Update: `src/components/Sidebar.tsx`

```typescript
// Add Sales & Marketing menu items when division is expanded
{division === 'sales-marketing' && (
  <>
    <li>
      <Link href="/divisional-management?div=sales-marketing&menu=mailbox">
        <span className="ml-4 text-sm">📧 Sales & Marketing Mailbox</span>
      </Link>
    </li>
    <li>
      <Link href="/divisional-management?div=sales-marketing&menu=reports">
        <span className="ml-4 text-sm">📊 Division Reports</span>
      </Link>
    </li>
    <li>
      <Link href="/divisional-management?div=sales-marketing&menu=approvals">
        <span className="ml-4 text-sm">✅ Approval Center</span>
      </Link>
    </li>
  </>
)}
```

---

## Testing Checklist

After implementation, verify:

- [ ] Database tables created successfully
- [ ] Prospecting data imported (5 records)
- [ ] API endpoints responding with correct data
- [ ] Sales & Marketing mailbox shows prospecting email
- [ ] Sales & Marketing reports shows 5 prospects with correct ranking
- [ ] Sidebar shows Sales & Marketing menus
- [ ] Navigation works between division menus
- [ ] CEO Approval Center prepared for CEO submission
- [ ] Data appears in Analytics dashboard

```bash
# Quick verification commands
curl http://localhost:3001/api/divisions/sales-marketing?menu=mailbox
curl http://localhost:3001/api/divisions/sales-marketing?menu=reports
curl http://localhost:3001/api/divisions/sales-marketing?menu=approvals
```

---

## Rollback Plan (If Issues Occur)

```sql
-- Backup data first
BACKUP DATABASE arunika_agentic TO DISK = '/backup/arunika_20260511.bak';

-- If needed, rollback changes
DROP TABLE IF EXISTS prospecting_data;
DROP TABLE IF EXISTS prospecting_sync_log;
ALTER TABLE divisional_mailbox DROP COLUMN IF EXISTS source;
ALTER TABLE divisional_mailbox DROP COLUMN IF EXISTS external_email_id;
ALTER TABLE divisional_mailbox DROP COLUMN IF EXISTS sync_status;
```

---

## Deployment Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Database Schema Update | 15 min | Ready |
| Data Import | 10 min | Ready |
| API Development | 30 min | Ready |
| Frontend Components | 60 min | Ready |
| Integration Testing | 30 min | Ready |
| Deployment | 15 min | Ready |
| **Total** | **2.5 hours** | **Ready to deploy** |

---

## Success Criteria

✅ **After Implementation:**
1. Sales & Marketing mailbox shows prospecting email
2. Sales & Marketing reports shows all 5 prospects
3. Approval Center ready for CEO submission
4. Data appears in dashboard analytics
5. All API endpoints functional
6. No console errors
7. Dashboard menus accessible and populated

---

**Prepared for:** Development Team  
**Implementation Priority:** HIGH  
**Blocking Issue:** Email delivered but dashboard not showing data  
**Success Outcome:** Full system integration for prospecting workflow

