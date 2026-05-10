/**
 * WORKFLOW EXECUTOR SERVICE
 * Menjalankan & mengelola execution dari semua Cowork workflows
 * Handles scheduling, retry logic, dan result aggregation
 */

import { TaskRequest, TaskResult, WORKFLOWS, CoworkAPIClient, getInstance } from './cowork-api';
// Removed: Mock seed data - using real Cowork API for actual execution data

export interface ExecutionConfig {
  maxRetries: number;
  retryDelay: number; // in ms
  timeout: number; // in ms
  parallel: boolean;
}

export interface ScheduleConfig {
  workflowId: string;
  cronExpression: string;
  enabled: boolean;
}

const DEFAULT_CONFIG: ExecutionConfig = {
  maxRetries: 3,
  retryDelay: 5000,
  timeout: 300000, // 5 minutes
  parallel: true,
};

export class WorkflowExecutor {
  private clients: Map<string, CoworkAPIClient> = new Map();
  private config: ExecutionConfig;
  private executionHistory: Map<string, TaskResult[]> = new Map();
  private scheduledWorkflows: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: Partial<ExecutionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeClients();
    // Seed data initialization removed - fetching real execution history from Cowork instances
  }

  /**
   * Initialize API clients untuk semua instances
   */
  private initializeClients() {
    const instances = ['central-hub', 'sales-marketing', 'finance-operations', 'ceo-dashboard'];
    instances.forEach(instanceId => {
      this.clients.set(instanceId, new CoworkAPIClient(instanceId));
    });
  }

  /**
   * Fetch real execution history dari Cowork instances
   * Ini akan dipanggil ketika dashboard membutuhkan data actual
   */
  async fetchRealExecutionHistory(workflowId: string): Promise<TaskResult[]> {
    const workflow = Object.values(WORKFLOWS).find(w => w.id === workflowId);
    if (!workflow) {
      return [];
    }

    const client = this.clients.get(workflow.instance);
    if (!client) {
      return [];
    }

    try {
      const tasks = await client.getWorkflowTasks(workflowId, 50);
      // Cache in memory
      this.executionHistory.set(workflowId, tasks);
      return tasks;
    } catch (error) {
      console.warn(`Failed to fetch execution history for ${workflowId}:`, error);
      return [];
    }
  }

  /**
   * Execute a single workflow
   */
  async executeWorkflow(
    workflowId: string,
    parameters?: Record<string, any>,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<TaskResult> {
    const workflow = Object.values(WORKFLOWS).find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const client = this.clients.get(workflow.instance);
    if (!client) {
      throw new Error(`Client not found for instance: ${workflow.instance}`);
    }

    const taskRequest: TaskRequest = {
      workflowId,
      instanceId: workflow.instance,
      parameters,
      priority,
      executedAt: new Date(),
    };

    let lastError: any;
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await client.executeWorkflow(taskRequest);

        // Track execution
        this.trackExecution(workflowId, result);

        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${this.config.maxRetries} failed for workflow ${workflowId}`);

        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Execute multiple workflows
   */
  async executeMultiple(
    workflowIds: string[],
    parameters?: Record<string, any>
  ): Promise<TaskResult[]> {
    if (this.config.parallel) {
      return Promise.all(
        workflowIds.map(id => this.executeWorkflow(id, parameters))
      );
    } else {
      const results: TaskResult[] = [];
      for (const id of workflowIds) {
        const result = await this.executeWorkflow(id, parameters);
        results.push(result);
      }
      return results;
    }
  }

  /**
   * Execute all daily workflows
   */
  async executeDailyWorkflows(): Promise<TaskResult[]> {
    console.log('[SCHEDULER] Running daily workflows at', new Date().toISOString());

    const dailyWorkflows = [
      'social-media-daily',
      'expense-report-automation',
      'bank-reconciliation',
      'daily-briefing',
    ];

    try {
      const results = await this.executeMultiple(dailyWorkflows);
      console.log(`[SCHEDULER] Daily workflows completed: ${results.length} tasks`);
      return results;
    } catch (error) {
      console.error('[SCHEDULER] Error executing daily workflows:', error);
      throw error;
    }
  }

  /**
   * Execute all weekly workflows
   */
  async executeWeeklyWorkflows(): Promise<TaskResult[]> {
    console.log('[SCHEDULER] Running weekly workflows at', new Date().toISOString());

    const weeklyWorkflows = [
      'email-campaign-weekly',
      'weekly-performance-review',
    ];

    try {
      const results = await this.executeMultiple(weeklyWorkflows);
      console.log(`[SCHEDULER] Weekly workflows completed: ${results.length} tasks`);
      return results;
    } catch (error) {
      console.error('[SCHEDULER] Error executing weekly workflows:', error);
      throw error;
    }
  }

  /**
   * Execute all monthly workflows
   */
  async executeMonthlyWorkflows(): Promise<TaskResult[]> {
    console.log('[SCHEDULER] Running monthly workflows at', new Date().toISOString());

    const monthlyWorkflows = [
      'content-calendar-generation',
      'payroll-processing',
      'monthly-financial-summary',
    ];

    try {
      const results = await this.executeMultiple(monthlyWorkflows);
      console.log(`[SCHEDULER] Monthly workflows completed: ${results.length} tasks`);
      return results;
    } catch (error) {
      console.error('[SCHEDULER] Error executing monthly workflows:', error);
      throw error;
    }
  }

  /**
   * Monitor a running task
   */
  async monitorTask(taskId: string, instanceId: string): Promise<TaskResult> {
    const client = this.clients.get(instanceId);
    if (!client) {
      throw new Error(`Client not found for instance: ${instanceId}`);
    }

    let result = await client.getTaskStatus(taskId);

    // Poll until task is complete or timeout
    const startTime = Date.now();
    while (
      result.status === 'pending' || result.status === 'running'
    ) {
      if (Date.now() - startTime > this.config.timeout) {
        throw new Error(`Task ${taskId} timed out`);
      }

      await this.delay(1000); // Check every 1 second
      result = await client.getTaskStatus(taskId);
    }

    return result;
  }

  /**
   * Track execution history
   */
  private trackExecution(workflowId: string, result: TaskResult) {
    if (!this.executionHistory.has(workflowId)) {
      this.executionHistory.set(workflowId, []);
    }

    const history = this.executionHistory.get(workflowId)!;
    history.push(result);

    // Keep only last 100 executions per workflow
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get execution history untuk workflow
   */
  getExecutionHistory(workflowId: string): TaskResult[] {
    return this.executionHistory.get(workflowId) || [];
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(workflowId: string) {
    const history = this.getExecutionHistory(workflowId);

    if (history.length === 0) {
      return {
        totalExecutions: 0,
        successCount: 0,
        failureCount: 0,
        successRate: 0,
        avgDuration: 0,
        lastExecution: null,
      };
    }

    const successful = history.filter(h => h.status === 'completed');
    const failed = history.filter(h => h.status === 'failed');
    const durations = successful
      .filter(h => h.duration)
      .map(h => h.duration || 0);
    const avgDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    return {
      totalExecutions: history.length,
      successCount: successful.length,
      failureCount: failed.length,
      successRate: (successful.length / history.length) * 100,
      avgDuration,
      lastExecution: history[history.length - 1],
    };
  }

  /**
   * Schedule a workflow untuk recurring execution
   */
  scheduleWorkflow(workflowId: string, cronExpression: string) {
    // For now, using simple scheduling. In production, use node-cron atau similar
    const workflow = Object.values(WORKFLOWS).find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    console.log(`[SCHEDULE] Registered workflow ${workflowId} with cron: ${cronExpression}`);

    // This would be replaced with actual cron scheduler in production
    const timeout = this.scheduledWorkflows.get(workflowId);
    if (timeout) {
      clearTimeout(timeout);
    }

    // Schedule next execution
    this.scheduleNext(workflowId);
  }

  /**
   * Schedule next execution (helper)
   */
  private scheduleNext(workflowId: string) {
    // Simple scheduling - in production use node-cron
    const nextRun = Math.random() * 3600000; // Random time in next hour
    const timeout = setTimeout(() => {
      this.executeWorkflow(workflowId)
        .then(result => console.log(`[SCHEDULE] ${workflowId} executed successfully`))
        .catch(error => console.error(`[SCHEDULE] ${workflowId} failed:`, error))
        .finally(() => this.scheduleNext(workflowId));
    }, nextRun);

    this.scheduledWorkflows.set(workflowId, timeout);
  }

  /**
   * Cancel a scheduled workflow
   */
  unscheduleWorkflow(workflowId: string) {
    const timeout = this.scheduledWorkflows.get(workflowId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledWorkflows.delete(workflowId);
      console.log(`[SCHEDULE] Unscheduled workflow: ${workflowId}`);
    }
  }

  /**
   * Get all execution statistics
   */
  getAllStats() {
    const stats: Record<string, any> = {};

    Object.keys(WORKFLOWS).forEach(key => {
      const workflow = WORKFLOWS[key as keyof typeof WORKFLOWS];
      stats[workflow.id] = this.getWorkflowStats(workflow.id);
    });

    return stats;
  }

  /**
   * Get instance health status
   */
  async getInstancesHealth() {
    const health: Record<string, any> = {};

    for (const [instanceId, client] of this.clients.entries()) {
      try {
        health[instanceId] = await client.getInstanceHealth();
      } catch (error) {
        health[instanceId] = {
          status: 'error',
          error: (error as Error).message,
        };
      }
    }

    return health;
  }

  /**
   * Helper: delay promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create global executor instance
export const workflowExecutor = new WorkflowExecutor({
  maxRetries: 3,
  retryDelay: 5000,
  timeout: 300000,
  parallel: true,
});
