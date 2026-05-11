// POST /api/approvals/approve
// PT. Arunika Teknologi Global | Fase 5: API Endpoints

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  const { task_id, approved_by, decision_reason } = await request.json();

  if (!task_id) {
    return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
  }

  try {
    const timestamp = new Date().toISOString();

    const result = await query(
      `UPDATE approval_queue
       SET status = 'approved',
           ceo_command = 'APPROVE',
           reviewed_by = $1,
           reviewed_at = $2,
           ceo_decision_reason = $3,
           approval_history = approval_history || $4::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $5
       RETURNING source_agentic, next_task_id, next_agentic, output_data, task_title`,
      [
        approved_by || 'ceo-agentic',
        timestamp,
        decision_reason || 'Approved by CEO',
        JSON.stringify([{ action: 'APPROVED', by: approved_by || 'ceo-agentic', timestamp, reason: decision_reason }]),
        task_id,
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { source_agentic, next_task_id, next_agentic, task_title } = result.rows[0];

    // Notify source agent
    await query(
      `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
       VALUES ($1, 'APPROVAL_GRANTED', $2, $3, $4)`,
      [task_id, 'ceo-agentic', source_agentic, JSON.stringify({
        message: `Task "${task_title}" APPROVED by CEO`,
        task_id, can_proceed: true,
      })]
    );

    // Notify next agent if routing exists
    if (next_task_id && next_agentic) {
      await query(
        `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
         VALUES ($1, 'NEW_TASK_ASSIGNED', 'ceo-agentic', $2, $3)`,
        [task_id, next_agentic, JSON.stringify({
          message: `New task assigned: ${next_task_id}`,
          parent_task: task_id,
          execute_now: true,
        })]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task approved and routed',
      task_id,
      next_task: next_task_id || null,
      next_agentic: next_agentic || null,
    });
  } catch (error) {
    console.error('[API] POST /api/approvals/approve error:', error);
    return NextResponse.json({ error: 'Failed to approve task' }, { status: 500 });
  }
}
