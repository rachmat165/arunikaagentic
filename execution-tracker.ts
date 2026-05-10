/**
 * EXECUTION TRACKER SERVICE
 * Melacak real execution results dari scheduled tasks di Claude space
 * Menyimpan data locally sehingga dashboard bisa menampilkan real data
 */

import { TaskResult } from './cowork-api';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), '.cowork-data');
const EXECUTION_LOG_FILE = path.join(DATA_DIR, 'execution-history.json');

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load execution history from disk
export function loadExecutionHistory(): Record<string, TaskResult[]> {
  ensureDataDir();

  if (!fs.existsSync(EXECUTION_LOG_FILE)) {
    return {};
  }

  try {
    const data = fs.readFileSync(EXECUTION_LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load execution history:', error);
    return {};
  }
}

// Save execution history to disk
export function saveExecutionHistory(history: Record<string, TaskResult[]>) {
  ensureDataDir();

  try {
    fs.writeFileSync(
      EXECUTION_LOG_FILE,
      JSON.stringify(history, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to save execution history:', error);
  }
}

// Record a workflow execution
export function recordExecution(
  workflowId: string,
  result: TaskResult
) {
  const history = loadExecutionHistory();

  if (!history[workflowId]) {
    history[workflowId] = [];
  }

  history[workflowId].push(result);

  // Keep only last 50 executions per workflow
  if (history[workflowId].length > 50) {
    history[workflowId] = history[workflowId].slice(-50);
  }

  saveExecutionHistory(history);
  console.log(`[TRACKER] Recorded execution for ${workflowId}`);
}

// Get execution history for a workflow
export function getExecutionHistory(workflowId: string): TaskResult[] {
  const history = loadExecutionHistory();
  return history[workflowId] || [];
}

// Get all execution history
export function getAllExecutionHistory(): Record<string, TaskResult[]> {
  return loadExecutionHistory();
}

// Calculate stats from execution history
export function calculateStats(executions: TaskResult[]) {
  if (executions.length === 0) {
    return {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      avgDuration: 0,
      lastExecution: null,
    };
  }

  const successful = executions.filter(e => e.status === 'completed');
  const failed = executions.filter(e => e.status === 'failed');
  const durations = successful
    .filter(e => e.duration)
    .map(e => e.duration || 0);

  const avgDuration = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : 0;

  return {
    totalExecutions: executions.length,
    successCount: successful.length,
    failureCount: failed.length,
    successRate: (successful.length / executions.length) * 100,
    avgDuration,
    lastExecution: executions[executions.length - 1],
  };
}

// Log scheduled task completion from Claude space
export function logScheduledTaskCompletion(payload: {
  workflowId: string;
  taskId: string;
  status: 'completed' | 'failed';
  duration: number;
  outputs?: Record<string, any>;
  error?: string;
  executedAt?: string;
}) {
  const result: TaskResult = {
    taskId: payload.taskId,
    workflowId: payload.workflowId,
    instanceId: 'scheduled-task', // Indicates it came from scheduled task
    status: payload.status,
    startTime: new Date(payload.executedAt || new Date()),
    endTime: new Date(),
    duration: payload.duration,
    outputs: payload.outputs,
    error: payload.error,
  };

  recordExecution(payload.workflowId, result);
  return result;
}

// Initialize tracker with sample data (for testing)
export function initializeSampleData() {
  const sampleData: Record<string, TaskResult[]> = {
    'social-media-daily': [
      {
        taskId: 'task-001',
        workflowId: 'social-media-daily',
        instanceId: 'sales-marketing',
        status: 'completed',
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 3300000),
        duration: 300000,
        outputs: {
          posts: 3,
          platforms: ['LinkedIn', 'Instagram', 'Twitter'],
          engagement: 'High'
        },
      },
    ],
    'daily-briefing': [
      {
        taskId: 'task-002',
        workflowId: 'daily-briefing',
        instanceId: 'central-hub',
        status: 'completed',
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 6900000),
        duration: 300000,
        outputs: {
          summary: 'Daily briefing generated',
          metrics: 'Updated',
        },
      },
    ],
  };

  const currentHistory = loadExecutionHistory();
  const mergedHistory = { ...currentHistory, ...sampleData };
  saveExecutionHistory(mergedHistory);
}

export class ExecutionTracker {
  static getHistory(workflowId: string) {
    return getExecutionHistory(workflowId);
  }

  static getAllHistory() {
    return getAllExecutionHistory();
  }

  static getStats(workflowId: string) {
    const history = this.getHistory(workflowId);
    return calculateStats(history);
  }

  static logExecution(workflowId: string, result: TaskResult) {
    recordExecution(workflowId, result);
  }

  static logTaskCompletion(payload: any) {
    return logScheduledTaskCompletion(payload);
  }
}
