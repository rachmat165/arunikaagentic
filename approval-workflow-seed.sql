-- ============================================================
-- APPROVAL WORKFLOW SYSTEM - SEED DATA
-- PT. Arunika Teknologi Global
-- Run AFTER approval-workflow-migrations.sql
-- ============================================================

-- ============================================================
-- 1. SEED: api_key_registry
-- Insert placeholder entries (encrypted_value diisi via npm run setup:encrypt-keys)
-- ============================================================

INSERT INTO api_key_registry (key_name, provider, model_name, accessible_by, environment, notes)
VALUES
  (
    'CLAUDE_API_KEY',
    'anthropic',
    'claude-sonnet-4-6',
    '["operations-agentic", "sales-marketing-agentic", "finance-agentic", "ceo-agentic"]',
    'production',
    'Primary model for all agents. Set via: npm run setup:encrypt-keys'
  ),
  (
    'OPENAI_API_KEY',
    'openai',
    'gpt-4o',
    '["sales-marketing-agentic"]',
    'production',
    'Used by Sales & Marketing agent for content generation'
  ),
  (
    'GEMINI_API_KEY',
    'google',
    'gemini-2.0-flash',
    '["operations-agentic", "finance-agentic"]',
    'production',
    'Used for document processing and financial analysis'
  )
ON CONFLICT (key_name) DO NOTHING;

-- ============================================================
-- 2. SEED: Sample approval_queue entries (for testing/demo)
-- ============================================================

INSERT INTO approval_queue (
  task_id, task_type, task_title, task_description,
  source_agentic, source_email,
  output_data, status, submitted_by,
  next_task_id, next_agentic,
  model_used, execution_metadata
) VALUES
  (
    'demo-proposal-001',
    'proposal',
    'Business Proposal - PT. ABC Corp (DEMO)',
    'Demo proposal untuk testing approval workflow',
    'operations-agentic',
    'direktur.operasional@arunika2045.com',
    '{
      "title": "Technology Partnership Proposal",
      "client": "PT. ABC Corp",
      "overview": "Arunika Agentic AI system untuk transformasi digital operasional ABC Corp",
      "roi_projection": "25% cost reduction dalam 6 bulan",
      "packages": [
        {"name": "Starter", "price": "Rp 15.000.000/bulan"},
        {"name": "Professional", "price": "Rp 35.000.000/bulan"},
        {"name": "Enterprise", "price": "Custom pricing"}
      ],
      "timeline": "3 bulan implementasi"
    }',
    'pending',
    'operations-agentic',
    'send-proposal-001',
    'sales-marketing-agentic',
    'claude-sonnet-4-6',
    '{"tokens_used": 2450, "execution_time_ms": 2340, "cost_estimate_usd": 0.023}'
  ),
  (
    'demo-social-post-001',
    'social_post',
    'LinkedIn Post - Arunika AI Launch (DEMO)',
    'Demo social media post untuk testing revision flow',
    'sales-marketing-agentic',
    'direktur.marketing@arunika2045.com',
    '{
      "platform": "LinkedIn",
      "content": "🚀 PT. Arunika Teknologi Global meluncurkan sistem AI Agent terdepan untuk transformasi bisnis Indonesia!\n\n✅ Multi-agent workflow automation\n✅ CEO approval dashboard real-time\n✅ Integrasi Claude, GPT-4o & Gemini\n\nHubungi kami: corsec@arunika2045.com",
      "hashtags": ["#ArunikaAI", "#AgentikAI", "#TransformasiDigital", "#Indonesia"],
      "scheduled_time": "2026-05-12T09:00:00+07:00"
    }',
    'revision_requested',
    'sales-marketing-agentic',
    null,
    null,
    'gpt-4o',
    '{"tokens_used": 850, "execution_time_ms": 1200, "cost_estimate_usd": 0.008}'
  )
ON CONFLICT (task_id) DO NOTHING;

-- Add revision prompt to demo social post
UPDATE approval_queue
SET
  revision_prompts = '[
    {
      "revision_number": 1,
      "instruction": "Tambahkan call-to-action yang lebih spesifik. Mention website arunika2045.com. Tambahkan angka ROI yang konkret (25% cost savings).",
      "requested_at": "2026-05-11T10:30:00Z",
      "deadline": "2026-05-11T12:30:00Z",
      "status": "pending"
    }
  ]',
  revision_count = 1,
  reviewed_by = 'ceo-agentic',
  reviewed_at = CURRENT_TIMESTAMP - INTERVAL '2 hours',
  ceo_command = 'REVISE',
  approval_history = '[
    {
      "action": "SUBMITTED",
      "by": "sales-marketing-agentic",
      "timestamp": "2026-05-11T09:00:00Z"
    },
    {
      "action": "REVISION_REQUESTED",
      "by": "ceo-agentic",
      "timestamp": "2026-05-11T10:30:00Z",
      "instruction": "Tambahkan call-to-action lebih spesifik dan angka ROI"
    }
  ]'
WHERE task_id = 'demo-social-post-001';

-- ============================================================
-- 3. SEED: Sample agent_notifications
-- ============================================================

INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
VALUES
  (
    'demo-proposal-001',
    'TASK_PENDING_APPROVAL',
    'operations-agentic',
    'ceo-agentic',
    '{
      "message": "New proposal awaiting your approval",
      "task_title": "Business Proposal - PT. ABC Corp",
      "dashboard_url": "https://arunika.app/approval/demo-proposal-001"
    }'
  ),
  (
    'demo-social-post-001',
    'REVISION_REQUESTED',
    'ceo-agentic',
    'sales-marketing-agentic',
    '{
      "message": "CEO requested revision on LinkedIn post",
      "instruction": "Tambahkan call-to-action lebih spesifik dan angka ROI",
      "deadline": "2026-05-11T12:30:00Z"
    }'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

DO $$
DECLARE
  v_queue_count INTEGER;
  v_api_key_count INTEGER;
  v_notif_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_queue_count FROM approval_queue;
  SELECT COUNT(*) INTO v_api_key_count FROM api_key_registry;
  SELECT COUNT(*) INTO v_notif_count FROM agent_notifications;

  RAISE NOTICE '============================================================';
  RAISE NOTICE 'SEED DATA INSERTED SUCCESSFULLY:';
  RAISE NOTICE '  approval_queue:       % records', v_queue_count;
  RAISE NOTICE '  api_key_registry:     % records', v_api_key_count;
  RAISE NOTICE '  agent_notifications:  % records', v_notif_count;
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '  1. Set environment variables (see .env.example)';
  RAISE NOTICE '  2. Run: npm run setup:encrypt-keys';
  RAISE NOTICE '  3. Run: npm run dev';
  RAISE NOTICE '  4. Visit: http://localhost:3000/approval';
  RAISE NOTICE '============================================================';
END $$;
