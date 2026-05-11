// POST /api/approvals/reject
// PT. Arunika Teknologi Global | Fase 5: API Endpoints

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  const { task_id, rejected_by, decision_reason } = await request.json();

  if (!task_id || !decision_reason?.trim()) {
    return NextResponse.json(
      { error: 'task_id and decision_reason are required' },
      { status: 400 }
    );
  }

  try {
    const timestamp = new Date().toISOString();

    const result = await query(
      `UPDATE approval_queue
       SET status = 'rejected',
           ceo_command = 'REJECT',
           is_completed = true,
           completed_at = $1,
           reviewed_by = $2,
           reviewed_at = $1,
           ceo_decision_reason = $3,
           approval_history = approval_history || $4::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $5
       RETURNING source_agentic, task_title`,
      [
        timestamp,
        rejected_by || 'ceo-agentic',
        decision_reason,
        JSON.stringify([{
          action: 'REJECTED',
          by: rejected_by || 'ceo-agentic',
          timestamp,
          reason: decision_reason,
        }]),
        task_id,
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { source_agentic, task_title } = result.rows[0];

    // Notify source agent
    await query(
      `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
       VALUES ($1, 'TASK_REJECTED', 'ceo-agentic', $2, $3)`,
      [task_id, source_agentic, JSON.stringify({
        message: `Task "${task_title}" REJECTED by CEO and archived`,
        task_id,
        reason: decision_reason,
        do_not_execute: true,
      })]
    );

    return NextResponse.json({
      success: true,
      message: 'Task rejected and archived',
      task_archived: task_id,
    });
  } catch (error) {
    console.error('[API] POST /api/approvals/reject error:', error);
    return NextResponse.json({ error: 'Failed to reject task' }, { status: 500 });
  }
}
