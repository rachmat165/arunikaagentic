-- ============================================
-- PHASE 1: PROSPECTING DATA INTEGRATION
-- For: Arunika Agentic AI - Foundation Prospecting
-- Date: 2026-05-11
-- ============================================

-- ============================================
-- 1. PROSPECTING DATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prospecting_data (
  id SERIAL PRIMARY KEY,
  division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
  prospect_rank VARCHAR(50) NOT NULL,
  -- PRIORITY 1 - VERY HIGH | PRIORITY 2 - HIGH | etc.
  prospect_name VARCHAR(255) NOT NULL,
  organization_profile TEXT,
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(30),
  leader_name VARCHAR(255),
  leader_title VARCHAR(100),
  schools_managed VARCHAR(100),
  curriculum_type VARCHAR(100),
  key_opportunity TEXT,
  value_proposition TEXT,
  estimated_value VARCHAR(50),
  technology_infrastructure TEXT,
  partnership_potential VARCHAR(50),
  decision_maker VARCHAR(255),
  decision_maker_email VARCHAR(255),
  decision_maker_phone VARCHAR(30),
  recommended_action TEXT,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Ready for Outreach',
  -- Ready for Outreach | Research Phase | Planning Phase | Contacted | In Discussion | Proposal Sent | Closed
  quality_score INTEGER DEFAULT 95,
  market_reach INTEGER DEFAULT 0,
  engagement_timeline VARCHAR(100),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

-- Indexes for prospecting_data
CREATE INDEX idx_prospecting_division ON prospecting_data(division_id);
CREATE INDEX idx_prospecting_status ON prospecting_data(status);
CREATE INDEX idx_prospecting_rank ON prospecting_data(prospect_rank);
CREATE INDEX idx_prospecting_created_at ON prospecting_data(created_at DESC);
CREATE INDEX idx_prospecting_email ON prospecting_data(email);
CREATE INDEX idx_prospecting_search ON prospecting_data USING GIN (to_tsvector('english', prospect_name || ' ' || COALESCE(organization_profile, '')));

-- ============================================
-- 2. PROSPECTING SYNC LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prospecting_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_date DATE NOT NULL,
  sync_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100),
  -- gmail | manual-entry | api | system
  total_prospects INTEGER,
  prospects_synced INTEGER,
  sync_status VARCHAR(50),
  -- pending | in-progress | completed | failed
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sync_log_date ON prospecting_sync_log(sync_date);
CREATE INDEX idx_sync_log_status ON prospecting_sync_log(sync_status);

-- ============================================
-- 3. EXTEND MESSAGES TABLE FOR EMAIL SYNC
-- ============================================
ALTER TABLE messages ADD COLUMN IF NOT EXISTS source VARCHAR(50);
-- gmail | internal | slack | teams
ALTER TABLE messages ADD COLUMN IF NOT EXISTS external_email_id VARCHAR(255);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sync_status VARCHAR(50) DEFAULT 'pending';
-- pending | synced | failed
ALTER TABLE messages ADD COLUMN IF NOT EXISTS gmail_message_id VARCHAR(255) UNIQUE;

CREATE INDEX IF NOT EXISTS idx_messages_source ON messages(source);
CREATE INDEX IF NOT EXISTS idx_messages_sync_status ON messages(sync_status);
CREATE INDEX IF NOT EXISTS idx_messages_gmail_id ON messages(gmail_message_id);

-- ============================================
-- 4. EXTEND REPORTS TABLE FOR PROSPECTING REPORTS
-- ============================================
ALTER TABLE reports ADD COLUMN IF NOT EXISTS prospecting_data_count INTEGER;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS top_prospect VARCHAR(255);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0;

-- ============================================
-- 5. INSERT PROSPECTING DATA
-- ============================================
INSERT INTO prospecting_data (
  division_id,
  prospect_rank,
  prospect_name,
  organization_profile,
  website,
  email,
  phone,
  leader_name,
  leader_title,
  schools_managed,
  curriculum_type,
  key_opportunity,
  value_proposition,
  estimated_value,
  technology_infrastructure,
  partnership_potential,
  decision_maker,
  decision_maker_email,
  decision_maker_phone,
  recommended_action,
  location,
  status,
  quality_score,
  market_reach,
  engagement_timeline
)
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  'PRIORITY 1 - VERY HIGH',
  'Yayasan Pendidikan Kader Bangsa Indonesia (YPKBI)',
  'IB-focused boarding school network with rapid expansion plans',
  'kaderbangsa.foundation',
  'info@kaderbangsa.foundation',
  '(62-21) TBD',
  'Dirgayuza Setiawan',
  'Chairman & Co-Founder',
  'Multi-school with IB Diploma',
  'International Baccalaureate (IB)',
  'Plans to expand to 65 new boarding schools by 2030',
  'Very High - Aggressive expansion + IB partnership + international funding',
  'Very High',
  'IB curriculum requires sophisticated academic management',
  'VERY HIGH - Plans to expand to 65 schools by 2030',
  'Dirgayuza Setiawan',
  'info@kaderbangsa.foundation',
  '(62-21) TBD',
  'CEO-level outreach for expansion support solution',
  'Indonesia',
  'Ready for Outreach',
  95,
  65,
  '2-4 weeks'
UNION ALL
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  'PRIORITY 2 - HIGH',
  'Yayasan Al Firdaus - Semesta Bilingual Boarding School',
  '3-campus boarding school system with structured management',
  'semesta.sch.id',
  'info@semesta.sch.id',
  '(62-24) 76916060',
  'TBD',
  'Kepala Yayasan',
  'TK, SD, SMP, SMA',
  'Cambridge International',
  '3-campus system in Semarang requiring integrated management',
  'High - Multi-campus boarding operations + integration needs',
  'High',
  'Cambridge curriculum with boarding system suggests digital infrastructure needs',
  'HIGH - Multi-campus requires integrated management system',
  'Kepala Yayasan',
  'info@semesta.sch.id',
  '(62-24) 76916060',
  'Multi-campus integration pitch',
  'Semarang, Jawa Tengah',
  'Ready for Outreach',
  95,
  12,
  '2-4 weeks'
UNION ALL
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  'PRIORITY 3 - HIGH',
  'Yayasan Pendidikan Bunda Mulia',
  'Established multi-school foundation managing PAUD-SMA levels',
  'bundamulia.sch.id',
  'smpbundamulia@yahoo.com',
  '(62-21) 6329005',
  'Rita Djoko Susanto',
  'Kepala Yayasan',
  'PAUD, SD, SMP, SMA',
  'Cambridge Pathway',
  'Established multi-level system for reference implementation',
  'High - Cambridge curriculum + established infrastructure',
  'High',
  'International Cambridge curriculum implementation suggests modern systems',
  'HIGH - Multi-level school system ideal for ERP implementation',
  'Rita Djoko Susanto',
  'smpbundamulia@yahoo.com',
  '(62-21) 6329005',
  'Schedule with Kepala Yayasan',
  'Jakarta',
  'Ready for Outreach',
  95,
  8,
  '2-4 weeks'
UNION ALL
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  'PRIORITY 4 - MEDIUM-HIGH',
  'Indonesia Heritage Foundation (IHF)',
  'Multi-school network focused on character-based education since 2000',
  'ihf.or.id',
  'info@ihf.or.id',
  '(62-21) TBD',
  'Dr. Ratna Megawangi & Dr. Sofyan Djalil',
  'Founders',
  'Multi-school network',
  'Character-Based Holistic Education (CBHE)',
  'Character-Based Holistic Education (CBHE) network',
  'Medium-High - Network-based model with philosophical alignment',
  'Medium-High',
  'Network model suggests need for centralized management',
  'HIGH - Network of schools needs coordinated management',
  'Dr. Ratna Megawangi / Dr. Sofyan Djalil',
  'info@ihf.or.id',
  '(62-21) TBD',
  'Research decision-maker contacts',
  'Depok, Jawa Barat',
  'Research Phase',
  90,
  25,
  '3-5 weeks'
UNION ALL
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  'PRIORITY 5 - MEDIUM-HIGH',
  'BINUS School',
  'Part of Bina Nusantara Group - large education conglomerate',
  'semarang.binus.sch.id',
  'info@binus.edu',
  '(62-24) TBD',
  'Bina Nusantara Group',
  'Leadership',
  'TK, SD, SMP, SMA',
  'Cambridge International',
  'Enterprise-wide implementation across Bina Nusantara Group',
  'Medium-High - Large organization with scalability',
  'Medium-High',
  'Bina Nusantara Group likely has existing digital infrastructure',
  'MEDIUM-HIGH - Group level integration opportunity',
  'Bina Nusantara Group Leadership',
  'info@binus.edu',
  '(62-24) TBD',
  'Engage at group corporate level',
  'Semarang & Multiple Locations',
  'Planning Phase',
  90,
  20,
  '3-6 weeks'
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. CREATE PROSPECTING REPORT
-- ============================================
INSERT INTO reports (
  division_id,
  title,
  report_type,
  description,
  file_url,
  status,
  frequency,
  generated_by,
  generated_at,
  period_start,
  period_end,
  is_public,
  created_by
)
SELECT
  (SELECT id FROM divisions WHERE slug = 'sales-marketing'),
  '[DAILY] Sales & Marketing Report - Foundation Prospecting [2026-05-11]',
  'sales-performance',
  'Daily foundation prospecting analysis with 5 qualified Indonesian educational foundation prospects',
  '/reports/Arunika_Foundation_Prospecting_Daily_Report_2026-05-11.xlsx',
  'complete',
  'daily',
  '00000000-0000-0000-0000-000000000000'::UUID,
  CURRENT_TIMESTAMP,
  CURRENT_DATE,
  CURRENT_DATE,
  FALSE,
  '00000000-0000-0000-0000-000000000000'::UUID
WHERE NOT EXISTS (
  SELECT 1 FROM reports
  WHERE title = '[DAILY] Sales & Marketing Report - Foundation Prospecting [2026-05-11]'
);

-- ============================================
-- 7. LOG THE INITIAL SYNC
-- ============================================
INSERT INTO prospecting_sync_log (
  sync_date,
  sync_time,
  source,
  total_prospects,
  prospects_synced,
  sync_status,
  metadata
)
VALUES (
  CURRENT_DATE,
  CURRENT_TIMESTAMP,
  'system',
  5,
  5,
  'completed',
  jsonb_build_object(
    'phase', 'Phase 1 - Database Schema Update',
    'notes', 'Initial prospecting data imported from prospecting-data.json',
    'quality_score', 95,
    'market_reach', 130
  )
);

-- ============================================
-- 8. VERIFY DATA LOAD
-- ============================================
-- Run this query to verify the prospecting data was loaded correctly:
-- SELECT prospect_rank, prospect_name, email, status FROM prospecting_data ORDER BY prospect_rank;
-- SELECT COUNT(*) as total_prospects FROM prospecting_data WHERE division_id = (SELECT id FROM divisions WHERE slug = 'sales-marketing');
-- SELECT COUNT(*) as pending_sync FROM prospecting_sync_log WHERE sync_status = 'completed';

-- ============================================
-- END OF PHASE 1 MIGRATION
-- Status: Ready for Phase 2 (API Endpoints)
-- ============================================
