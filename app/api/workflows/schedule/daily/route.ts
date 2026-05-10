/**
 * API ROUTE: Execute Daily Workflows
 * POST /api/workflows/schedule/daily
 *
 * Executes all daily scheduled workflows
 * Workflows: Social Media, Expense Reports, Bank Reconciliation, Daily Briefing
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowExecutor } from '@/services/workflow-executor';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Executing daily workflows at', new Date().toISOString());

    const results = await workflowExecutor.executeDailyWorkflows();

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
    console.error('[API] Error executing daily workflows:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute daily workflows',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// For GET request, return schedule info
export async function GET() {
  return NextResponse.json({
    schedule: 'daily',
    frequency: 'Every day at 08:00 WIB',
    workflows: [
      'social-media-daily',
      'expense-report-automation',
      'bank-reconciliation',
      'daily-briefing',
    ],
    nextExecution: '2026-05-11T08:00:00+07:00',
  });
}
