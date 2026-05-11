-- ============================================================
-- APPROVAL WORKFLOW SYSTEM - DATABASE MIGRATIONS
-- PT. Arunika Teknologi Global
-- Direktur Utama: Adang A.Kunandar
-- Version: 1.0 | Date: May 11, 2026
-- Target Go-Live: June 9, 2026
-- Contact: corsec@arunika2045.com
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE 1: approval_queue
-- Central table for all tasks awaiting CEO approval
-- ============================================================

CREATE TABLE IF NOT EXISTS approval_queue (
  -- Primary Identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) UNIQUE NOT NULL,

  -- Task Metadata
  task_type VARCHAR(50) NOT NULL,
  -- Values: 'proposal', 'social_post', 'report', 'invoice', 'content', 'email_campaign'

  task_title VARCHAR(200) NOT NULL,
  task_description TEXT,

  -- Source Agent Information
  source_agentic VARCHAR(100) NOT NULL,
  -- Values: 'operations-agentic', 'sales-marketing-agentic', 'finance-agentic'

  source_email VARCHAR(100) NOT NULL,
  -- Example: direktur.operasional@arunika2045.com

  -- Task Output Data (JSONB for flexibility)
  output_data JSONB NOT NULL DEFAULT '{}',

  -- Approval Status
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  -- Values: 'pending' | 'approved' | 'rejected' | 'revision_requested' | 'revision_resubmitted'

  -- Submission Details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submitted_by VARCHAR(100) NOT NULL,

  -- CEO Review Details
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,

  -- CEO COMMAND FIELD (REVISION INSTRUCTIONS)
  revision_prompts JSONB DEFAULT '[]',
  -- Array: [{ revision_number, instruction, requested_at, deadline, status }]

  -- Revision Tracking
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 3,

  -- Next Task Routing (CEO specifies here)
  next_task_id VARCHAR(100),
  next_agentic VARCHAR(100),
  -- Values: 'operations-agentic', 'sales-marketing-agentic', 'finance-agentic'

  next_task_instruction TEXT,
  -- Specific instruction from CEO for next agent

  -- CEO Command/Decision Field
  ceo_command VARCHAR(20),
  -- Values: 'APPROVE' | 'REVISE' | 'REJECT' | 'HOLD'

  ceo_decision_reason TEXT,

  -- Complete Audit History
  approval_history JSONB DEFAULT '[]',
  -- Array of all actions taken on this task

  -- Task Completion
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_result JSONB,

  -- AI Model Tracking
  model_used VARCHAR(50),
  -- Example: 'claude-sonnet-4-6', 'gpt-4o', 'gemini-2.0-flash'

  execution_metadata JSONB DEFAULT '{}'
  -- { api_key_id, model, tokens_used, execution_time_ms, cost_estimate_usd }
);

-- Performance Indexes for approval_queue
CREATE INDEX IF NOT EXISTS idx_aq_status_created
  ON approval_queue(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aq_source_agentic
  ON approval_queue(source_agentic);

CREATE INDEX IF NOT EXISTS idx_aq_next_agentic
  ON approval_queue(next_agentic)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_aq_pending_review
  ON approval_queue(status, created_at DESC)
  WHERE status IN ('pending', 'revision_requested');

CREATE INDEX IF NOT EXISTS idx_aq_ceo_command
  ON approval_queue(ceo_command, reviewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_aq_task_id
  ON approval_queue(task_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_approval_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_approval_queue_updated_at ON approval_queue;
CREATE TRIGGER trigger_approval_queue_updated_at
  BEFORE UPDATE ON approval_queue
  FOR EACH ROW EXECUTE FUNCTION update_approval_queue_updated_at();

-- ============================================================
-- TABLE 2: api_key_registry
-- Centralized encrypted API key management per agent
-- ============================================================

CREATE TABLE IF NOT EXISTS api_key_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  key_name VARCHAR(100) UNIQUE NOT NULL,
  -- Examples: 'CLAUDE_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'

  provider VARCHAR(50) NOT NULL,
  -- Values: 'anthropic', 'openai', 'google'

  model_name VARCHAR(100),
  -- Examples: 'claude-sonnet-4-6', 'gpt-4o', 'gemini-2.0-flash'

  encrypted_value TEXT NOT NULL DEFAULT '',
  -- Encrypted using AES-256-CBC with API_KEY_ENCRYPTION_KEY env var

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,

  -- Access Control: which agents can use this key
  accessible_by JSONB DEFAULT '[]',
  -- Array: ["operations-agentic", "sales-marketing-agentic", "finance-agentic"]

  environment VARCHAR(20) DEFAULT 'production',
  -- Values: 'development', 'staging', 'production'

  notes TEXT,

  -- Key rotation tracking
  rotated_at TIMESTAMP WITH TIME ZONE,
  rotation_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_akr_key_name
  ON api_key_registry(key_name)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_akr_provider
  ON api_key_registry(provider, is_active);

-- ============================================================
-- TABLE 3: agent_execution_log
-- Full audit trail of every agent task execution
-- ============================================================

CREATE TABLE IF NOT EXISTS agent_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) NOT NULL,
  -- References approval_queue(task_id) — soft reference for flexibility

  agent_name VARCHAR(100) NOT NULL,
  -- Values: 'operations-agentic', 'sales-marketing-agentic', 'finance-agentic', 'ceo-agentic'

  agent_email VARCHAR(100),
  -- Example: direktur.operasional@arunika2045.com

  execution_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  execution_end TIMESTAMP WITH TIME ZONE,
  execution_time_ms INTEGER,

  -- AI Model Used
  model_used VARCHAR(50),
  api_key_name VARCHAR(100),
  -- Which API key was used (key_name from api_key_registry)

  -- Token Usage & Cost
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,

  -- Execution Result
  execution_result VARCHAR(20) DEFAULT 'pending',
  -- Values: 'success', 'failed', 'timeout', 'error', 'pending'

  error_message TEXT,

  -- Output Preview (first 500 chars)
  output_preview TEXT,

  -- Additional Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ael_task_id
  ON agent_execution_log(task_id);

CREATE INDEX IF NOT EXISTS idx_ael_agent_name
  ON agent_execution_log(agent_name, execution_start DESC);

CREATE INDEX IF NOT EXISTS idx_ael_execution_start
  ON agent_execution_log(execution_start DESC);

CREATE INDEX IF NOT EXISTS idx_ael_result
  ON agent_execution_log(execution_result, execution_start DESC);

-- ============================================================
-- TABLE 4: agent_notifications
-- Track notifications sent between CEO and agents
-- ============================================================

CREATE TABLE IF NOT EXISTS agent_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100),
  notification_type VARCHAR(50) NOT NULL,
  -- Values: 'TASK_PENDING_APPROVAL', 'APPROVAL_GRANTED', 'REVISION_REQUESTED',
  --         'TASK_REJECTED', 'NEW_TASK_ASSIGNED', 'REVISION_RESUBMITTED'

  from_agent VARCHAR(100) NOT NULL,
  to_agent VARCHAR(100) NOT NULL,

  payload JSONB DEFAULT '{}',
  -- Full notification data

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_an_to_agent_unread
  ON agent_notifications(to_agent, is_read, created_at DESC)
  WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_an_task_id
  ON agent_notifications(task_id);

-- ============================================================
-- VIEWS for easy querying
-- ============================================================

-- View: pending approvals with execution summary
CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
  aq.id,
  aq.task_id,
  aq.task_type,
  aq.task_title,
  aq.source_agentic,
  aq.source_email,
  aq.output_data,
  aq.created_at,
  aq.status,
  aq.revision_count,
  aq.max_revisions,
  aq.next_task_id,
  aq.next_agentic,
  aq.revision_prompts,
  aq.model_used,
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - aq.created_at)) / 3600 AS hours_waiting
FROM approval_queue aq
WHERE aq.status IN ('pending', 'revision_requested')
ORDER BY aq.created_at ASC;

-- View: CEO decision summary (last 30 days)
CREATE OR REPLACE VIEW v_ceo_decision_summary AS
SELECT
  DATE(reviewed_at) AS decision_date,
  ceo_command,
  COUNT(*) AS count,
  AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at)) / 3600) AS avg_hours_to_decide
FROM approval_queue
WHERE reviewed_at IS NOT NULL
  AND reviewed_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY DATE(reviewed_at), ceo_command
ORDER BY decision_date DESC;

-- View: agent execution stats
CREATE OR REPLACE VIEW v_agent_execution_stats AS
SELECT
  agent_name,
  model_used,
  COUNT(*) AS total_executions,
  SUM(CASE WHEN execution_result = 'success' THEN 1 ELSE 0 END) AS successful,
  SUM(CASE WHEN execution_result = 'failed' THEN 1 ELSE 0 END) AS failed,
  ROUND(AVG(execution_time_ms)::numeric, 0) AS avg_execution_ms,
  SUM(total_tokens) AS total_tokens_used,
  ROUND(SUM(cost_usd)::numeric, 4) AS total_cost_usd
FROM agent_execution_log
WHERE execution_start >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY agent_name, model_used
ORDER BY total_executions DESC;

-- ============================================================
-- COMPLETION MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'APPROVAL WORKFLOW MIGRATIONS COMPLETED SUCCESSFULLY';
  RAISE NOTICE 'Tables created: approval_queue, api_key_registry,';
  RAISE NOTICE '                agent_execution_log, agent_notifications';
  RAISE NOTICE 'Views created:  v_pending_approvals, v_ceo_decision_summary,';
  RAISE NOTICE '                v_agent_execution_stats';
  RAISE NOTICE 'PT. Arunika Teknologi Global | corsec@arunika2045.com';
  RAISE NOTICE '============================================================';
END $$;
