/**
 * COWORK API INTEGRATION SERVICE
 * Menghubungkan dashboard dengan 4 Cowork instances
 * Instances: Central-Hub, Sales-Marketing, Finance-Operations, CEO-Dashboard
 */

import axios, { AxiosInstance } from 'axios';

// Configuration untuk 4 Cowork instances
export const COWORK_INSTANCES = {
  CENTRAL_HUB: {
    id: 'central-hub',
    name: 'Arunika-Central-Hub',
    description: 'Orchestration Hub & Command Center',
    models: ['Claude 3.5 Sonnet', 'Gemini 2.0'],
    budget: '$10/month',
    automationTarget: 90,
  },
  SALES_MARKETING: {
    id: 'sales-marketing',
    name: 'Arunika-Sales-Marketing',
    description: 'Creative Automation & Campaign Management',
    models: ['GPT-4o', 'Gemini', 'Claude'],
    budget: '$10/month',
    automationTarget: 85,
  },
  FINANCE_OPERATIONS: {
    id: 'finance-operations',
    name: 'Arunika-Finance-Operations',
    description: 'Document & Process Automation',
    models: ['Gemini 2.0', 'Claude 3.5', 'OpenAI'],
    budget: '$10/month',
    automationTarget: 90,
  },
  CEO_DASHBOARD: {
    id: 'ceo-dashboard',
    name: 'Arunika-CEO-Dashboard',
    description: 'Executive Intelligence & Reporting',
    models: ['Claude', 'Gemini'],
    budget: '$10/month',
    automationTarget: 85,
  },
};

// Workflow definitions untuk 12+ core workflows
export const WORKFLOWS = {
  // WORKFLOW 1: SALES & MARKETING INSTANCE
  SOCIAL_MEDIA_DAILY: {
    id: 'social-media-daily',
    instance: 'sales-marketing',
    name: 'Daily Social Media Content Generation',
    description: 'Auto-generate social media posts untuk LinkedIn, Instagram, Twitter',
    frequency: 'Daily at 09:00 WIB',
    trigger: 'SCHEDULE',
    steps: 7,
    models: ['Claude', 'GPT-4o', 'Gemini'],
    outputs: ['3-5 social media posts', 'Visual recommendations', 'Hashtags & CTAs'],
    status: 'active',
  },
  EMAIL_CAMPAIGN_WEEKLY: {
    id: 'email-campaign-weekly',
    instance: 'sales-marketing',
    name: 'Weekly Email Campaign Automation',
    description: 'Generate & send targeted email campaigns to leads',
    frequency: 'Every Monday at 10:00 WIB',
    trigger: 'SCHEDULE',
    steps: 8,
    models: ['Claude', 'GPT-4o'],
    outputs: ['Email copy', 'A/B test variants', 'Performance report'],
    status: 'active',
  },
  LEAD_NURTURE_SEQUENCE: {
    id: 'lead-nurture-sequence',
    instance: 'sales-marketing',
    name: 'Automated Lead Nurturing Sequence',
    description: 'Auto-send personalized nurturing emails ke engaged leads',
    frequency: 'Every 3 days',
    trigger: 'SCHEDULE',
    steps: 5,
    models: ['Claude', 'GPT-4o'],
    outputs: ['Nurture email sequence', 'Lead scoring', 'Engagement metrics'],
    status: 'active',
  },
  CONTENT_CALENDAR_GENERATION: {
    id: 'content-calendar-generation',
    instance: 'sales-marketing',
    name: 'Monthly Content Calendar Generation',
    description: 'Generate 30-day content calendar dengan theme & topics',
    frequency: 'First day of month at 08:00 WIB',
    trigger: 'SCHEDULE',
    steps: 6,
    models: ['Claude', 'Gemini'],
    outputs: ['30-day calendar', 'Content topics', 'SEO keywords'],
    status: 'active',
  },

  // WORKFLOW 2: FINANCE & OPERATIONS INSTANCE
  INVOICE_PROCESSING: {
    id: 'invoice-processing',
    instance: 'finance-operations',
    name: 'Invoice Processing Automation',
    description: 'Auto-extract, classify, validate invoice PDFs',
    frequency: 'Continuous (email trigger)',
    trigger: 'EMAIL',
    steps: 6,
    models: ['Gemini 2.0', 'Claude'],
    outputs: ['Structured invoice data', 'Vendor categorization', 'Approval routing'],
    status: 'active',
  },
  EXPENSE_REPORT_AUTOMATION: {
    id: 'expense-report-automation',
    instance: 'finance-operations',
    name: 'Expense Report Processing',
    description: 'Auto-process receipt OCR & categorize expenses',
    frequency: 'Daily at 16:00 WIB',
    trigger: 'SCHEDULE',
    steps: 5,
    models: ['Gemini 2.0', 'Claude'],
    outputs: ['Categorized expenses', 'Reimbursement report', 'Budget tracking'],
    status: 'active',
  },
  PAYROLL_PROCESSING: {
    id: 'payroll-processing',
    instance: 'finance-operations',
    name: 'Payroll Processing Automation',
    description: 'Auto-validate & process payroll data',
    frequency: 'Monthly (25th of month)',
    trigger: 'SCHEDULE',
    steps: 6,
    models: ['Claude', 'OpenAI'],
    outputs: ['Payroll summary', 'Tax calculations', 'Distribution report'],
    status: 'active',
  },
  BANK_RECONCILIATION: {
    id: 'bank-reconciliation',
    instance: 'finance-operations',
    name: 'Bank Reconciliation Automation',
    description: 'Auto-match transactions & flag discrepancies',
    frequency: 'Daily at 17:00 WIB',
    trigger: 'SCHEDULE',
    steps: 5,
    models: ['Claude', 'Gemini'],
    outputs: ['Reconciliation report', 'Discrepancy alerts', 'Balance validation'],
    status: 'active',
  },
  TAX_COMPLIANCE_REPORT: {
    id: 'tax-compliance-report',
    instance: 'finance-operations',
    name: 'Tax Compliance Reporting',
    description: 'Auto-generate monthly/quarterly tax compliance reports',
    frequency: 'Monthly & Quarterly',
    trigger: 'SCHEDULE',
    steps: 7,
    models: ['Claude', 'Gemini'],
    outputs: ['Tax report', 'Compliance checklist', 'Filing summary'],
    status: 'active',
  },

  // WORKFLOW 3: CEO DASHBOARD INSTANCE
  DAILY_BRIEFING: {
    id: 'daily-briefing',
    instance: 'central-hub',
    name: 'Daily Executive Briefing',
    description: 'Aggregate daily metrics & insights untuk CEO',
    frequency: 'Daily at 08:00 WIB',
    trigger: 'SCHEDULE',
    steps: 8,
    models: ['Claude', 'Gemini'],
    outputs: ['Executive summary', 'Key metrics', 'Alert highlights', 'Email brief'],
    status: 'active',
  },
  WEEKLY_PERFORMANCE_REVIEW: {
    id: 'weekly-performance-review',
    instance: 'ceo-dashboard',
    name: 'Weekly Performance Review',
    description: 'Comprehensive weekly performance analysis across all workflows',
    frequency: 'Every Friday at 17:00 WIB',
    trigger: 'SCHEDULE',
    steps: 8,
    models: ['Claude', 'Gemini', 'OpenAI'],
    outputs: ['Performance report', 'Trend analysis', 'Recommendations', 'Next week focus'],
    status: 'active',
  },
  MONTHLY_FINANCIAL_SUMMARY: {
    id: 'monthly-financial-summary',
    instance: 'finance-operations',
    name: 'Monthly Financial Summary',
    description: 'Complete monthly financial summary & analysis',
    frequency: 'Last day of month at 18:00 WIB',
    trigger: 'SCHEDULE',
    steps: 7,
    models: ['Claude', 'Gemini', 'OpenAI'],
    outputs: ['Financial summary', 'Budget analysis', 'Variance report', 'Next month forecast'],
    status: 'active',
  },
  QUARTERLY_BUSINESS_REVIEW: {
    id: 'quarterly-business-review',
    instance: 'central-hub',
    name: 'Quarterly Business Review',
    description: 'Quarterly analysis of all metrics & KPIs',
    frequency: 'End of each quarter',
    trigger: 'SCHEDULE',
    steps: 10,
    models: ['Claude', 'Gemini', 'OpenAI'],
    outputs: ['QBR report', 'Strategic insights', 'Goal tracking', 'Roadmap update'],
    status: 'active',
  },
};

// Task execution types
export interface TaskRequest {
  workflowId: string;
  instanceId: string;
  parameters?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  executedAt?: Date;
}

export interface TaskResult {
  taskId: string;
  workflowId: string;
  instanceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  outputs?: Record<string, any>;
  error?: string;
  executionLog?: string[];
}

// Cowork API Client
export class CoworkAPIClient {
  private baseURL: string;
  private apiKey: string;
  private client: AxiosInstance;
  private instanceId: string;

  constructor(instanceId: string, baseURL?: string) {
    this.instanceId = instanceId;
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.apiKey = process.env.COWORK_API_KEY || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Instance-ID': instanceId,
      },
      timeout: 300000, // 5 minutes untuk long-running tasks
    });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(taskRequest: TaskRequest): Promise<TaskResult> {
    try {
      const response = await this.client.post('/workflows/execute', {
        ...taskRequest,
        instanceId: this.instanceId,
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to execute workflow: ${taskRequest.workflowId}`, error);
      throw error;
    }
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<TaskResult> {
    try {
      const response = await this.client.get(`/workflows/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get task status: ${taskId}`, error);
      throw error;
    }
  }

  /**
   * Get all tasks for a workflow
   */
  async getWorkflowTasks(workflowId: string, limit: number = 50): Promise<TaskResult[]> {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/tasks`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to get workflow tasks: ${workflowId}`, error);
      throw error;
    }
  }

  /**
   * Get instance health & metrics
   */
  async getInstanceHealth() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error(`Failed to get instance health`, error);
      throw error;
    }
  }

  /**
   * Get instance statistics
   */
  async getInstanceStats() {
    try {
      const response = await this.client.get('/stats');
      return response.data;
    } catch (error) {
      console.error(`Failed to get instance stats`, error);
      throw error;
    }
  }

  /**
   * Schedule a workflow for recurring execution
   */
  async scheduleWorkflow(workflowId: string, cron: string) {
    try {
      const response = await this.client.post('/workflows/schedule', {
        workflowId,
        cron,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to schedule workflow: ${workflowId}`, error);
      throw error;
    }
  }

  /**
   * Cancel a running task
   */
  async cancelTask(taskId: string) {
    try {
      const response = await this.client.post(`/workflows/tasks/${taskId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel task: ${taskId}`, error);
      throw error;
    }
  }
}

// Utility functions
export function getWorkflow(workflowId: string) {
  return Object.values(WORKFLOWS).find(w => w.id === workflowId);
}

export function getWorkflowsByInstance(instanceId: string) {
  return Object.values(WORKFLOWS).filter(w => w.instance === instanceId);
}

export function getInstance(instanceId: string) {
  return Object.values(COWORK_INSTANCES).find(i => i.id === instanceId);
}

export function getAllWorkflows() {
  return Object.values(WORKFLOWS);
}

export function getAllInstances() {
  return Object.values(COWORK_INSTANCES);
}
