-- ============================================
-- DIVISIONAL MANAGEMENT SYSTEM DATABASE MIGRATIONS
-- For: Arunika Agentic AI
-- Version: 1.0
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- 1. DIVISIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  head_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_divisions_status ON divisions(status);
CREATE INDEX idx_divisions_slug ON divisions(slug);

-- ============================================
-- 2. TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
  assigned_to UUID,
  assigned_by UUID,
  status VARCHAR(50) DEFAULT 'new',
  -- new | in-progress | pending-approval | completed | rejected | on-hold
  priority VARCHAR(20) DEFAULT 'medium',
  -- high | medium | low
  start_date DATE,
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  completion_notes TEXT,
  attachment_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_tasks_division_id ON tasks(division_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- ============================================
-- 3. MESSAGES/MAILBOX TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_division_id UUID NOT NULL REFERENCES divisions(id),
  to_division_id UUID NOT NULL REFERENCES divisions(id),
  sender_id UUID NOT NULL,
  recipient_id UUID,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'general',
  -- general | task-notification | approval-request | system-alert | report-generated
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  attachment_urls TEXT[] DEFAULT '{}',
  reply_to_id UUID REFERENCES messages(id),
  thread_id UUID,
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_to_division ON messages(to_division_id, is_read);
CREATE INDEX idx_messages_from_division ON messages(from_division_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_message_type ON messages(message_type);

-- ============================================
-- 4. REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division_id UUID NOT NULL REFERENCES divisions(id),
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  -- sales-performance | marketing-campaigns | financial | operational | compliance
  description TEXT,
  content JSONB,
  file_url VARCHAR(500),
  file_size_bytes INTEGER,
  status VARCHAR(50) DEFAULT 'processing',
  -- processing | complete | failed | scheduled
  generated_by UUID,
  generated_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  frequency VARCHAR(50),
  -- one-time | daily | weekly | monthly | quarterly | yearly
  period_start DATE,
  period_end DATE,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID
);

CREATE INDEX idx_reports_division ON reports(division_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_scheduled_for ON reports(scheduled_for) WHERE scheduled_for IS NOT NULL;

-- ============================================
-- 5. APPROVALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_type VARCHAR(100) NOT NULL,
  -- task | budget | hiring | report | policy | other
  request_id VARCHAR(255),
  from_division_id UUID NOT NULL REFERENCES divisions(id),
  to_division_id UUID NOT NULL REFERENCES divisions(id),
  approver_id UUID,
  approval_level INTEGER DEFAULT 1,
  -- 1 = first level, 2 = director, 3 = CEO
  title VARCHAR(255) NOT NULL,
  description TEXT,
  details JSONB,
  amount DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'IDR',
  status VARCHAR(50) DEFAULT 'pending',
  -- pending | approved | rejected | revoked | expired
  approval_comment TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  approver_notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  priority VARCHAR(20) DEFAULT 'normal',
  attachment_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approver ON approvals(approver_id, status);
CREATE INDEX idx_approvals_from_division ON approvals(from_division_id);
CREATE INDEX idx_approvals_request_type ON approvals(request_type);
CREATE INDEX idx_approvals_created_at ON approvals(created_at DESC);
CREATE INDEX idx_approvals_expires_at ON approvals(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- 6. AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100) NOT NULL,
  -- tasks | messages | approvals | reports | divisions
  entity_id VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  -- CREATE | UPDATE | DELETE | APPROVE | REJECT | READ | ARCHIVE
  old_value JSONB,
  new_value JSONB,
  changes JSONB,
  performed_by UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_performed_by ON audit_log(performed_by);
CREATE INDEX idx_audit_log_entity_action ON audit_log(entity_type, action);

-- ============================================
-- 7. TASK ASSIGNMENTS TABLE (For tracking reassignments)
-- ============================================
CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unassigned_at TIMESTAMP WITH TIME ZONE,
  is_current BOOLEAN DEFAULT TRUE,
  notes TEXT
);

CREATE INDEX idx_task_assignments_task ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user ON task_assignments(assigned_to);
CREATE INDEX idx_task_assignments_current ON task_assignments(task_id) WHERE is_current = TRUE;

-- ============================================
-- 8. NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  division_id UUID REFERENCES divisions(id),
  notify_on_task_assigned BOOLEAN DEFAULT TRUE,
  notify_on_task_completed BOOLEAN DEFAULT TRUE,
  notify_on_approval_request BOOLEAN DEFAULT TRUE,
  notify_on_message_received BOOLEAN DEFAULT TRUE,
  notify_on_report_ready BOOLEAN DEFAULT TRUE,
  email_digest_frequency VARCHAR(50) DEFAULT 'daily',
  -- none | hourly | daily | weekly | monthly
  enable_desktop_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- ============================================
-- 9. APPROVAL WORKFLOW RULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS approval_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  request_type VARCHAR(100) NOT NULL,
  division_id UUID REFERENCES divisions(id),
  steps JSONB NOT NULL,
  -- JSON array of approval steps with approvers and conditions
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX idx_approval_workflows_type ON approval_workflows(request_type);
CREATE INDEX idx_approval_workflows_division ON approval_workflows(division_id);

-- ============================================
-- 10. TRIGGERS AND FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
CREATE TRIGGER update_divisions_updated_at BEFORE UPDATE ON divisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (entity_type, entity_id, action, old_value, performed_by)
    VALUES (TG_TABLE_NAME, OLD.id::text, 'DELETE', row_to_json(OLD), OLD.updated_by);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (entity_type, entity_id, action, old_value, new_value, performed_by, changes)
    VALUES (
      TG_TABLE_NAME,
      NEW.id::text,
      'UPDATE',
      row_to_json(OLD),
      row_to_json(NEW),
      NEW.updated_by,
      jsonb_object_agg(key, NEW.* -> key) - jsonb_object_agg(key, OLD.* -> key)
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (entity_type, entity_id, action, new_value, performed_by)
    VALUES (TG_TABLE_NAME, NEW.id::text, 'INSERT', row_to_json(NEW), NEW.created_by);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to main tables
CREATE TRIGGER audit_tasks AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_approvals AFTER INSERT OR UPDATE OR DELETE ON approvals
  FOR EACH ROW EXECUTE FUNCTION log_changes();

-- ============================================
-- 11. INITIAL DATA - DIVISIONS
-- ============================================
INSERT INTO divisions (name, slug, description, icon, status, sort_order)
VALUES
  ('CEO Office', 'ceo-office', 'Executive leadership and strategic decision-making', '👔', 'active', 1),
  ('Sales & Marketing Division', 'sales-marketing', 'Revenue generation and brand awareness', '💼', 'active', 2),
  ('Operations & Finance Division', 'ops-finance', 'Financial management and operational efficiency', '🏢', 'active', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 12. SAMPLE APPROVAL WORKFLOW
-- ============================================
INSERT INTO approval_workflows (name, request_type, steps, is_active, created_by)
VALUES (
  'Budget Approval Workflow',
  'budget',
  '[
    {
      "step": 1,
      "title": "Department Head Approval",
      "approvers": ["head_id"],
      "required_approvals": 1
    },
    {
      "step": 2,
      "title": "CFO Approval",
      "approvers": ["cfo_id"],
      "required_approvals": 1,
      "condition": "amount > 10000000"
    },
    {
      "step": 3,
      "title": "CEO Final Approval",
      "approvers": ["ceo_id"],
      "required_approvals": 1,
      "condition": "amount > 50000000"
    }
  ]'::jsonb,
  TRUE,
  '00000000-0000-0000-0000-000000000000'::UUID
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 13. CREATE VIEWS FOR EASIER QUERYING
-- ============================================

-- Dashboard overview view
CREATE OR REPLACE VIEW v_dashboard_overview AS
SELECT
  'tasks' as metric_type,
  COUNT(*) as count,
  (SELECT COUNT(*) FROM tasks WHERE status = 'pending-approval') as pending,
  (SELECT COUNT(*) FROM tasks WHERE status = 'in-progress') as in_progress,
  CURRENT_TIMESTAMP as generated_at
FROM tasks
UNION ALL
SELECT
  'approvals' as metric_type,
  COUNT(*) as count,
  (SELECT COUNT(*) FROM approvals WHERE status = 'pending') as pending,
  (SELECT COUNT(*) FROM approvals WHERE status = 'approved') as in_progress,
  CURRENT_TIMESTAMP as generated_at
FROM approvals;

-- Division summary view
CREATE OR REPLACE VIEW v_division_summary AS
SELECT
  d.id,
  d.name,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'in-progress' THEN t.id END) as in_progress_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'pending-approval' THEN t.id END) as pending_approval_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT m.id) as total_messages,
  COUNT(DISTINCT CASE WHEN m.is_read = FALSE THEN m.id END) as unread_messages,
  COUNT(DISTINCT a.id) as total_approvals,
  COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) as pending_approvals
FROM divisions d
LEFT JOIN tasks t ON d.id = t.division_id
LEFT JOIN messages m ON d.id = m.to_division_id
LEFT JOIN approvals a ON d.id = a.to_division_id
GROUP BY d.id, d.name;

-- ============================================
-- 14. GRANT PERMISSIONS (if using user roles)
-- ============================================
-- Note: Uncomment and adjust these based on your user management system

-- GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO app_user;
-- GRANT SELECT, INSERT, UPDATE ON approvals TO app_user;
-- GRANT SELECT ON audit_log TO app_user;
-- GRANT SELECT ON v_dashboard_overview TO app_user;
-- GRANT SELECT ON v_division_summary TO app_user;

-- ============================================
-- END OF MIGRATIONS
-- Version: 1.0
-- Created: 2026-05-11
-- ============================================
