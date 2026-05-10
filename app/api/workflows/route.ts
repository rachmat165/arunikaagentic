/**
 * API ROUTE: Get All Workflows
 * GET /api/workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkflows, COWORK_INSTANCES } from '@/services/cowork-api';
import { workflowExecutor } from '@/services/workflow-executor';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const instanceId = searchParams.get('instance');
    const includeStats = searchParams.get('stats') === 'true';

    let workflows = getAllWorkflows();

    // Filter by instance if provided
    if (instanceId) {
      workflows = workflows.filter(w => w.instance === instanceId);
    }

    // Add statistics if requested
    const workflowData = workflows.map(workflow => {
      const data: any = {
        ...workflow,
        instance: COWORK_INSTANCES[
          Object.keys(COWORK_INSTANCES).find(
            k => COWORK_INSTANCES[k as keyof typeof COWORK_INSTANCES].id === workflow.instance
          ) as keyof typeof COWORK_INSTANCES
        ],
      };

      if (includeStats) {
        data.stats = workflowExecutor.getWorkflowStats(workflow.id);
      }

      return data;
    });

    return NextResponse.json({
      success: true,
      count: workflowData.length,
      workflows: workflowData,
    });
  } catch (error) {
    console.error('[API] Error fetching workflows:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch workflows',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
