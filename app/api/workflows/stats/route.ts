/**
 * API ROUTE: Get Workflow Statistics (REAL DATA)
 * GET /api/workflows/stats
 *
 * Fetches actual execution statistics from ExecutionTracker
 * Tracks real scheduled task executions from Claude space
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExecutionTracker } from '@/services/execution-tracker';
import { getAllWorkflows } from '@/services/cowork-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workflowId = searchParams.get('workflowId');
    const instanceId = searchParams.get('instanceId');

    let stats: Record<string, any> = {};
    let workflows = getAllWorkflows();

    // Filter workflows if needed
    if (instanceId) {
      workflows = workflows.filter(w => w.instance === instanceId);
    }
    if (workflowId) {
      workflows = workflows.filter(w => w.id === workflowId);
    }

    // Fetch REAL execution data from ExecutionTracker
    console.log(`[API] Fetching real stats for ${workflows.length} workflows from ExecutionTracker...`);

    for (const workflow of workflows) {
      try {
        // Get execution history from tracker
        const executionHistory = ExecutionTracker.getHistory(workflow.id);

        // Calculate stats from real data
        stats[workflow.id] = calculateStats(executionHistory);

        if (executionHistory.length > 0) {
          console.log(`[API] Found ${executionHistory.length} real executions for ${workflow.id}`);
        }
      } catch (error) {
        console.warn(`[API] Failed to fetch stats for ${workflow.id}:`, error);
        // Return empty stats if fetch fails
        stats[workflow.id] = {
          totalExecutions: 0,
          successCount: 0,
          failureCount: 0,
          successRate: 0,
          avgDuration: 0,
          lastExecution: null,
        };
      }
    }

    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      dataSource: 'EXECUTION_TRACKER',
      stats,
    };

    // Add summary
    const allStats = Object.values(stats);
    response.summary = {
      totalWorkflows: Object.keys(stats).length,
      totalExecutions: allStats.reduce((sum, s) => sum + (s.totalExecutions || 0), 0),
      totalSuccessful: allStats.reduce((sum, s) => sum + (s.successCount || 0), 0),
      totalFailed: allStats.reduce((sum, s) => sum + (s.failureCount || 0), 0),
      overallSuccessRate:
        allStats.length > 0 && allStats.reduce((sum, s) => sum + (s.totalExecutions || 0), 0) > 0
          ? (allStats.reduce((sum, s) => sum + (s.successCount || 0), 0) /
              allStats.reduce((sum, s) => sum + (s.totalExecutions || 0), 0)) *
            100
          : 0,
      avgDuration:
        allStats.length > 0
          ? allStats.reduce((sum, s) => sum + (s.avgDuration || 0), 0) / allStats.length
          : 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching real stats:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch statistics from execution tracker',
        message: (error as Error).message,
        dataSource: 'EXECUTION_TRACKER',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Calculate stats from execution history
 */
function calculateStats(executionHistory: any[]) {
  if (!executionHistory || executionHistory.length === 0) {
    return {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      avgDuration: 0,
      lastExecution: null,
    };
  }

  const successful = executionHistory.filter(h => h.status === 'completed');
  const failed = executionHistory.filter(h => h.status === 'failed');
  const durations = successful
    .filter(h => h.duration)
    .map(h => h.duration || 0);
  const avgDuration = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : 0;

  return {
    totalExecutions: executionHistory.length,
    successCount: successful.length,
    failureCount: failed.length,
    successRate: (successful.length / executionHistory.length) * 100,
    avgDuration,
    lastExecution: executionHistory[executionHistory.length - 1],
  };
}
