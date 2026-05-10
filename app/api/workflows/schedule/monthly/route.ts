/**
 * API ROUTE: Execute Monthly Workflows
 * POST /api/workflows/schedule/monthly
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowExecutor } from '@/services/workflow-executor';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Executing monthly workflows at', new Date().toISOString());

    const results = await workflowExecutor.executeMonthlyWorkflows();

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
    console.error('[API] Error executing monthly workflows:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute monthly workflows',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    schedule: 'monthly',
    frequency: 'First day of month at 08:00 WIB',
    workflows: [
      'content-calendar-generation',
      'payroll-processing',
      'monthly-financial-summary',
    ],
    nextExecution: '2026-06-01T08:00:00+07:00',
  });
}
