// ============================================================
// GET /api/approvals/status/[taskId]
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 7: Task Status Polling Endpoint
//
// Agents poll this endpoint to check approval status.
// Returns current status, revision prompts (if any),
// and next-task instructions from CEO commands.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

interface RouteParams {
  params: { taskId: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { taskId } = params;
  const agentId = request.headers.get('x-agent-id');

  if (!agentId) {
    return NextResponse.json(
      { error: 'Missing x-agent-id header' },
      { status: 401 }
    );
  }

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  try {
    const result = await query(
      `SELECT
         id,
         source_agentic,
         next_agent_target,
         task_type,
         status,
         priority,
         decision_reason,
         revision_prompts,
         next_task_instruction,
         approval_history,
         is_completed,
         approved_at,
         created_at,
         updated_at
       FROM approval_queue
       WHERE id = $1`,
      [taskId]
    );

    if (!result.rows.length) {
      return NextResponse.json(
        { error: `Task "${taskId}" not found` },
        { status: 404 }
      );
    }

    const task = result.rows[0];

    // Only source agent or CEO can poll status
    const allowedAgents = ['ceo-agentic', task.source_agentic];
    if (task.next_agent_target) {
      allowedAgents.push(task.next_agent_target);
    }

    if (!allowedAgents.includes(agentId)) {
      return NextResponse.json(
        { error: 'Access denied — not authorized to view this task', code: 'ACCESS_DENIED' },
        { status: 403 }
      );
    }

    // Parse JSONB fields
    const revisionPrompts = Array.isArray(task.revision_prompts)
      ? task.revision_prompts
      : (typeof task.revision_prompts === 'string'
          ? JSON.parse(task.revision_prompts)
          : []);

    const approvalHistory = Array.isArray(task.approval_history)
      ? task.approval_history
      : (typeof task.approval_history === 'string'
          ? JSON.parse(task.approval_history)
          : []);

    // Build response based on status
    const response: Record<string, any> = {
      task_id: task.id,
      status: task.status,
      task_type: task.task_type,
      priority: task.priority,
      source_agent: task.source_agentic,
      next_agent: task.next_agent_target,
      is_completed: task.is_completed,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };

    // Attach decision context based on status
    switch (task.status) {
      case 'approved':
        response.approved_at = task.approved_at;
        response.decision_reason = task.decision_reason;
        if (task.next_task_instruction) {
          response.ceo_command = task.next_task_instruction;
        }
        break;

      case 'revision_requested':
        response.revision_prompts = revisionPrompts;
        response.latest_revision = revisionPrompts[revisionPrompts.length - 1] || null;
        response.revision_count = revisionPrompts.length;
        break;

      case 'rejected':
        response.decision_reason = task.decision_reason;
        response.rejected_at = task.updated_at;
        break;

      case 'revision_resubmitted':
        response.revision_count = revisionPrompts.length;
        response.message = 'Revision submitted — awaiting CEO review';
        break;

      case 'pending':
        response.message = 'Awaiting CEO review';
        break;
    }

    response.approval_history = approvalHistory;

    return NextResponse.json({ success: true, task: response });

  } catch (error: any) {
    console.error('[STATUS ROUTE ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
