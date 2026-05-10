/**
 * API ROUTE: Execute Weekly Workflows
 * POST /api/workflows/schedule/weekly
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowExecutor } from '@/services/workflow-executor';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Executing weekly workflows at', new Date().toISOString());

    const results = await workflowExecutor.executeWeeklyWorkflows();

    const summary = {
      totalWorkflows: results.length,
      successful: results.filter(r => r.status === 'completed').length,
      failed: results.filter(r => r.status === 'failed').length,
      avgDuration:
        results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      results: results.map(r => ({
        taskId: r.taskId,
        workflowId: r.workflowId,
        status: r.status,
        duration: r.duration,
        error: r.error,
      })),
    });
  } catch (error) {
    console.error('[API] Error executing weekly workflows:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute weekly workflows',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    schedule: 'weekly',
    frequency: 'Every Monday at 10:00 WIB',
    workflows: [
      'email-campaign-weekly',
      'weekly-performance-review',
    ],
    nextExecution: '2026-05-12T10:00:00+07:00',
  });
}
