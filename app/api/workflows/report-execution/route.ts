/**
 * API ROUTE: Report Scheduled Task Execution
 * POST /api/workflows/report-execution
 *
 * Menerima laporan eksekusi dari scheduled tasks di Claude space
 * Menyimpan data real execution sehingga dashboard bisa menampilkannya
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExecutionTracker } from '@/services/execution-tracker';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate payload
    if (!payload.workflowId || !payload.taskId || !payload.status) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, taskId, status' },
        { status: 400 }
      );
    }

    console.log(`[API] Reporting execution for workflow: ${payload.workflowId}`);
    console.log(`[API] Status: ${payload.status}, Duration: ${payload.duration}ms`);

    // Log the execution
    const result = ExecutionTracker.logTaskCompletion({
      workflowId: payload.workflowId,
      taskId: payload.taskId,
      status: payload.status,
      duration: payload.duration || 0,
      outputs: payload.outputs,
      error: payload.error,
      executedAt: payload.executedAt || new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Execution recorded for ${payload.workflowId}`,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Error reporting execution:', error);
    return NextResponse.json(
      {
        error: 'Failed to report execution',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * Example payload structure that scheduled tasks should send:
 *
 * POST /api/workflows/report-execution
 * {
 *   "workflowId": "daily-briefing",
 *   "taskId": "task-uuid-123",
 *   "status": "completed",
 *   "duration": 2500,
 *   "outputs": {
 *     "summary": "Daily briefing generated successfully",
 *     "metricsUpdated": true,
 *     "recipients": 5
 *   },
 *   "executedAt": "2026-05-10T08:00:00Z"
 * }
 *
 * On failure:
 * {
 *   "workflowId": "invoice-processing",
 *   "taskId": "task-uuid-456",
 *   "status": "failed",
 *   "duration": 5000,
 *   "error": "Failed to connect to email server",
 *   "executedAt": "2026-05-10T08:30:00Z"
 * }
 */
