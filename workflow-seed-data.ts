import { TaskResult } from './cowork-api';

export function generateTodaysMockExecutions(): Record<string, TaskResult[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return {
    'daily-briefing': [
      {
        taskId: 'task-db-001',
        status: 'completed',
        startTime: new Date(today.getTime() + 8.5 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 8.833 * 60 * 60 * 1000).toISOString(),
        duration: 20 * 60 * 1000,
        outputs: { report: 'Daily briefing completed successfully' },
      },
    ],
    'social-media-daily': [
      {
        taskId: 'task-sm-001',
        status: 'completed',
        startTime: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 9.75 * 60 * 60 * 1000).toISOString(),
        duration: 45 * 60 * 1000,
        outputs: { postsGenerated: 5, platforms: ['LinkedIn', 'Instagram', 'Twitter'] },
      },
    ],
    'expense-report-automation': [
      {
        taskId: 'task-er-001',
        status: 'completed',
        startTime: new Date(today.getTime() + 16 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 16.5 * 60 * 60 * 1000).toISOString(),
        duration: 30 * 60 * 1000,
        outputs: { receiptsProcessed: 12, totalAmount: 2850 },
      },
    ],
    'bank-reconciliation': [
      {
        taskId: 'task-br-001',
        status: 'completed',
        startTime: new Date(today.getTime() + 17 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(today.getTime() + 17.417 * 60 * 60 * 1000).toISOString(),
        duration: 25 * 60 * 1000,
        outputs: { transactionsMatched: 456, discrepancies: 0 },
      },
    ],
  };
}

export function generateWeeklyMockExecutions(): Record<string, TaskResult[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);

  return {
    'email-campaign-weekly': [
      {
        taskId: 'task-ec-001',
        status: 'completed',
        startTime: yesterday.toISOString(),
        endTime: new Date(yesterday.getTime() + 60 * 60 * 1000).toISOString(),
        duration: 60 * 60 * 1000,
        outputs: { emailsSent: 2500, openRate: 32 },
      },
    ],
    'weekly-performance-review': [
      {
        taskId: 'task-pr-001',
        status: 'completed',
        startTime: yesterday.toISOString(),
        endTime: new Date(yesterday.getTime() + 45 * 60 * 1000).toISOString(),
        duration: 45 * 60 * 1000,
        outputs: { metricsCompiled: true, kpisUpdated: 24 },
      },
    ],
    'invoice-processing': [
      {
        taskId: 'task-ip-001',
        status: 'completed',
        startTime: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        duration: 60 * 60 * 1000,
        outputs: { invoicesProcessed: 34, totalValue: 145000 },
      },
    ],
    'tax-compliance-report': [
      {
        taskId: 'task-tc-001',
        status: 'completed',
        startTime: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000).toISOString(),
        duration: 60 * 60 * 1000,
        outputs: { reportGenerated: true, complianceStatus: 'compliant' },
      },
    ],
  };
}
