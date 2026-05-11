// POST /api/approvals/approve-with-command
// CEO approves AND sends specific instruction to next agent
// PT. Arunika Teknologi Global | Fase 5: API Endpoints

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  const { task_id, approved_by, next_task_instruction, decision_reason } = await request.json();

  if (!task_id || !next_task_instruction?.trim()) {
    return NextResponse.json(
      { error: 'task_id and next_task_instruction are required' },
      { status: 400 }
    );
  }

  try {
    const timestamp = new Date().toISOString();

    const result = await query(
      `UPDATE approval_queue
       SET status = 'approved',
           ceo_command = 'APPROVE',
           next_task_instruction = $1,
           reviewed_by = $2,
           reviewed_at = $3,
           ceo_decision_reason = $4,
           approval_history = approval_history || $5::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $6
       RETURNING source_agentic, next_agentic, next_task_id, output_data, task_title`,
      [
        next_task_instruction,
        approved_by || 'ceo-agentic',
        timestamp,
        decision_reason || 'Approved with next task instruction',
        JSON.stringify([{
          action: 'APPROVED_WITH_COMMAND',
          by: approved_by || 'ceo-agentic',
          timestamp,
          next_instruction: next_task_instruction,
          reason: decision_reason,
        }]),
        task_id,
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { source_agentic, next_agentic, next_task_id, task_title } = result.rows[0];

    // Notify source agent: approved
    await query(
      `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
       VALUES ($1, 'APPROVAL_GRANTED', 'ceo-agentic', $2, $3)`,
      [task_id, source_agentic, JSON.stringify({
        message: `Task "${task_title}" APPROVED. Next agent will handle next steps.`,
        task_id,
      })]
    );

    // Notify next agent with CEO instruction
    if (next_agentic && next_task_id) {
      await query(
        `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
         VALUES ($1, 'NEW_TASK_WITH_INSTRUCTION', 'ceo-agentic', $2, $3)`,
        [task_id, next_agentic, JSON.stringify({
          message: `New task with CEO instruction: "${next_task_instruction}"`,
          task_id: next_task_id,
          parent_task: task_id,
          ceo_instruction: next_task_instruction,
          execute_now: true,
        })]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task approved and next agent notified with instruction',
      task_id,
      next_agentic: next_agentic || null,
      next_task: next_task_id || null,
    });
  } catch (error) {
    console.error('[API] POST /api/approvals/approve-with-command error:', error);
    return NextResponse.json({ error: 'Failed to process approval with command' }, { status: 500 });
  }
}
