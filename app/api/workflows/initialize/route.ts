/**
 * API ROUTE: Initialize Execution Tracker
 * POST /api/workflows/initialize
 *
 * Initialize ExecutionTracker dengan sample data dari scheduled task executions
 * Endpoint ini untuk TESTING - production data akan dari real scheduled tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { ExecutionTracker } from '@/services/execution-tracker';
import { initializeSampleData } from '@/services/execution-tracker';

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Initializing ExecutionTracker with sample data...');

    // Initialize sample data
    initializeSampleData();

    const allHistory = ExecutionTracker.getAllHistory();

    return NextResponse.json({
      success: true,
      message: 'ExecutionTracker initialized with sample data',
      totalWorkflows: Object.keys(allHistory).length,
      workflows: Object.keys(allHistory).map(id => ({
        workflowId: id,
        executionCount: allHistory[id].length,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Error initializing tracker:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize ExecutionTracker',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * Usage (for development/testing):
 *
 * curl -X POST http://localhost:3000/api/workflows/initialize
 *
 * This will populate the ExecutionTracker with sample execution data
 * so you can immediately see stats in the dashboard.
 *
 * For production, scheduled tasks should POST to /api/workflows/report-execution
 * with real execution results.
 */
