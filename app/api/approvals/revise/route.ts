// POST /api/approvals/revise
// PT. Arunika Teknologi Global | Fase 5: API Endpoints

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  const { task_id, revision_instruction, requested_by, decision_reason } = await request.json();

  if (!task_id || !revision_instruction?.trim()) {
    return NextResponse.json(
      { error: 'task_id and revision_instruction are required' },
      { status: 400 }
    );
  }

  try {
    const existing = await query(
      `SELECT revision_count, max_revisions, source_agentic, task_title
       FROM approval_queue WHERE task_id = $1`,
      [task_id]
    );

    if (!existing.rows.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { revision_count, max_revisions, source_agentic, task_title } = existing.rows[0];

    if (revision_count >= max_revisions) {
      return NextResponse.json(
        { error: `Max revisions (${max_revisions}) reached. Only APPROVE or REJECT available.` },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const deadline = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
    const newRevision = {
      revision_number: revision_count + 1,
      instruction: revision_instruction,
      requested_at: timestamp,
      deadline,
      status: 'pending',
    };

    await query(
      `UPDATE approval_queue
       SET status = 'revision_requested',
           ceo_command = 'REVISE',
           revision_prompts = revision_prompts || $1::jsonb,
           reviewed_by = $2,
           reviewed_at = $3,
           ceo_decision_reason = $4,
           approval_history = approval_history || $5::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $6`,
      [
        JSON.stringify([newRevision]),
        requested_by || 'ceo-agentic',
        timestamp,
        decision_reason || 'Revision requested',
        JSON.stringify([{
          action: 'REVISION_REQUESTED',
          by: requested_by || 'ceo-agentic',
          timestamp,
          instruction: revision_instruction,
          revision_number: revision_count + 1,
        }]),
        task_id,
      ]
    );

    // Notify source agent
    await query(
      `INSERT INTO agent_notifications (task_id, notification_type, from_agent, to_agent, payload)
       VALUES ($1, 'REVISION_REQUESTED', 'ceo-agentic', $2, $3)`,
      [task_id, source_agentic, JSON.stringify({
        message: `CEO requested revision on "${task_title}": "${revision_instruction}"`,
        task_id,
        revision_number: revision_count + 1,
        instruction: revision_instruction,
        deadline,
        max_revisions,
      })]
    );

    return NextResponse.json({
      success: true,
      message: 'Revision request sent',
      revision_number: revision_count + 1,
      agentic_notified: source_agentic,
      deadline,
    });
  } catch (error) {
    console.error('[API] POST /api/approvals/revise error:', error);
    return NextResponse.json({ error: 'Failed to request revision' }, { status: 500 });
  }
}
