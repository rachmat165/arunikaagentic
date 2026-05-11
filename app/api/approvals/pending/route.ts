// GET /api/approvals/pending
// PT. Arunika Teknologi Global | Fase 5: API Endpoints

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT id, task_id, task_type, source_agentic, source_email,
              task_title, output_data, created_at, status,
              revision_count, max_revisions,
              next_task_id, next_agentic, revision_prompts,
              EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 3600 AS hours_waiting
       FROM approval_queue
       WHERE status IN ('pending', 'revision_requested', 'revision_resubmitted')
       ORDER BY created_at ASC
       LIMIT 50`
    );

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    console.error('[API] GET /api/approvals/pending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending approvals' },
      { status: 500 }
    );
  }
}
