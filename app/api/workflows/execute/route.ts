/**
 * API ROUTE: Execute Workflow
 * POST /api/workflows/execute
 *
 * Executes a specific workflow on a Cowork instance
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowExecutor } from '@/services/workflow-executor';
import { getWorkflow } from '@/services/cowork-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, parameters, priority = 'medium' } = body;

    // Validate workflow exists
    const workflow = getWorkflow(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: `Workflow not found: ${workflowId}` },
        { status: 404 }
      );
    }

    console.log(`[API] Executing workflow: ${workflowId} on instance: ${workflow.instance}`);

    // Execute workflow
    const result = await workflowExecutor.executeWorkflow(workflowId, parameters, priority);

    return NextResponse.json({
      success: true,
      taskId: result.taskId,
      workflowId: result.workflowId,
      status: result.status,
      startTime: result.startTime,
      data: result,
    });
  } catch (error) {
    console.error('[API] Error executing workflow:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute workflow',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
