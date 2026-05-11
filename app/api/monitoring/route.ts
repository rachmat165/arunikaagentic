// ============================================================
// GET  /api/monitoring       — system health & metrics
// POST /api/monitoring       — trigger health check
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 7: System Monitoring & Observability
//
// Returns:
//   - Agent execution stats (tokens, cost, success rate)
//   - Approval queue health (pending count, avg resolution time)
//   - AI provider health (latency per model)
//   - Database connectivity
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// ── GET: Metrics & Health ──────────────────────────────────

export async function GET(request: NextRequest) {
  const agentId = request.headers.get('x-agent-id');
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '24h'; // 24h, 7d, 30d

  // Monitoring is open to all valid agents (CEO gets extra details)
  if (!agentId) {
    return NextResponse.json(
      { error: 'x-agent-id header required' },
      { status: 401 }
    );
  }

  const intervalMap: Record<string, string> = {
    '24h': '24 hours',
    '7d':  '7 days',
    '30d': '30 days',
  };
  const pgInterval = intervalMap[period] || '24 hours';

  try {
    // Run all metric queries in parallel
    const [
      queueStats,
      agentStats,
      recentActivity,
      providerStats,
      notificationStats,
    ] = await Promise.all([

      // ── Approval Queue Stats ──────────────────────────
      query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'pending')                AS pending_count,
          COUNT(*) FILTER (WHERE status = 'approved')               AS approved_count,
          COUNT(*) FILTER (WHERE status = 'rejected')               AS rejected_count,
          COUNT(*) FILTER (WHERE status = 'revision_requested')     AS revision_count,
          COUNT(*) FILTER (WHERE status = 'revision_resubmitted')   AS resubmitted_count,
          COUNT(*) FILTER (WHERE is_completed = true)               AS completed_count,
          COUNT(*)                                                   AS total_count,
          ROUND(
            AVG(EXTRACT(EPOCH FROM (approved_at - created_at)) / 60)
          ) FILTER (WHERE approved_at IS NOT NULL)                  AS avg_approval_minutes,
          COUNT(*) FILTER (
            WHERE created_at > NOW() - INTERVAL '${pgInterval}'
          )                                                          AS created_in_period
        FROM approval_queue
      `),

      // ── Agent Execution Stats ─────────────────────────
      query(`
        SELECT
          agent_name,
          COUNT(*)                                   AS total_executions,
          COUNT(*) FILTER (WHERE success = true)     AS successful,
          COUNT(*) FILTER (WHERE success = false)    AS failed,
          ROUND(AVG(latency_ms))                     AS avg_latency_ms,
          SUM(total_tokens)                          AS total_tokens,
          ROUND(SUM(estimated_cost_usd)::numeric, 4) AS total_cost_usd,
          MAX(created_at)                            AS last_execution
        FROM agent_execution_log
        WHERE created_at > NOW() - INTERVAL '${pgInterval}'
        GROUP BY agent_name
        ORDER BY total_executions DESC
      `),

      // ── Recent Activity (last 10) ─────────────────────
      query(`
        SELECT
          id,
          source_agentic,
          task_type,
          status,
          priority,
          created_at,
          approved_at
        FROM approval_queue
        ORDER BY created_at DESC
        LIMIT 10
      `),

      // ── Provider Usage Breakdown ──────────────────────
      query(`
        SELECT
          provider,
          model,
          COUNT(*)                                   AS executions,
          SUM(total_tokens)                          AS total_tokens,
          ROUND(AVG(latency_ms))                     AS avg_latency_ms,
          ROUND(SUM(estimated_cost_usd)::numeric, 4) AS cost_usd
        FROM agent_execution_log
        WHERE created_at > NOW() - INTERVAL '${pgInterval}'
        GROUP BY provider, model
        ORDER BY executions DESC
      `),

      // ── Notification Stats ────────────────────────────
      query(`
        SELECT
          type,
          COUNT(*) AS count,
          COUNT(*) FILTER (WHERE is_read = false) AS unread
        FROM agent_notifications
        WHERE created_at > NOW() - INTERVAL '${pgInterval}'
        GROUP BY type
        ORDER BY count DESC
      `),
    ]);

    const queue = queueStats.rows[0] || {};
    const totalTasks = parseInt(queue.total_count) || 0;
    const approvedTasks = parseInt(queue.approved_count) || 0;

    const response = {
      success: true,
      period,
      generated_at: new Date().toISOString(),

      system: {
        status: 'operational',
        database: 'connected',
      },

      approval_queue: {
        total: totalTasks,
        pending: parseInt(queue.pending_count) || 0,
        approved: approvedTasks,
        rejected: parseInt(queue.rejected_count) || 0,
        revision_requested: parseInt(queue.revision_count) || 0,
        revision_resubmitted: parseInt(queue.resubmitted_count) || 0,
        completed: parseInt(queue.completed_count) || 0,
        created_in_period: parseInt(queue.created_in_period) || 0,
        avg_approval_minutes: parseFloat(queue.avg_approval_minutes) || null,
        approval_rate: totalTasks > 0
          ? parseFloat(((approvedTasks / totalTasks) * 100).toFixed(1))
          : 0,
      },

      agents: agentStats.rows.map(row => ({
        name: row.agent_name,
        executions: parseInt(row.total_executions),
        successful: parseInt(row.successful),
        failed: parseInt(row.failed),
        success_rate: parseInt(row.total_executions) > 0
          ? parseFloat(((parseInt(row.successful) / parseInt(row.total_executions)) * 100).toFixed(1))
          : 0,
        avg_latency_ms: parseInt(row.avg_latency_ms) || 0,
        total_tokens: parseInt(row.total_tokens) || 0,
        total_cost_usd: parseFloat(row.total_cost_usd) || 0,
        last_execution: row.last_execution,
      })),

      providers: providerStats.rows.map(row => ({
        provider: row.provider,
        model: row.model,
        executions: parseInt(row.executions),
        total_tokens: parseInt(row.total_tokens) || 0,
        avg_latency_ms: parseInt(row.avg_latency_ms) || 0,
        cost_usd: parseFloat(row.cost_usd) || 0,
      })),

      notifications: notificationStats.rows.map(row => ({
        type: row.type,
        count: parseInt(row.count),
        unread: parseInt(row.unread),
      })),

      // CEO only: recent activity detail
      ...(agentId === 'ceo-agentic' && {
        recent_tasks: recentActivity.rows.map(row => ({
          id: row.id,
          agent: row.source_agentic,
          type: row.task_type,
          status: row.status,
          priority: row.priority,
          created_at: row.created_at,
          approved_at: row.approved_at,
        })),
      }),
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[MONITORING ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        system: { status: 'degraded', database: 'error' },
      },
      { status: 500 }
    );
  }
}

// ── POST: Trigger AI Provider Health Check ─────────────────

export async function POST(request: NextRequest) {
  const agentId = request.headers.get('x-agent-id');

  if (agentId !== 'ceo-agentic') {
    return NextResponse.json(
      { error: 'Health check trigger requires CEO agent', code: 'CEO_ONLY' },
      { status: 403 }
    );
  }

  try {
    // Dynamic import to avoid loading AI SDKs unless triggered
    const { agentExecutionService } = await import('@/services/agent-execution-service');
    const health = await agentExecutionService.healthCheck('ceo-agentic');

    const allHealthy = Object.values(health).every(h => h.ok);

    return NextResponse.json({
      success: true,
      overall_status: allHealthy ? 'healthy' : 'degraded',
      providers: health,
      checked_at: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, overall_status: 'error' },
      { status: 500 }
    );
  }
}
