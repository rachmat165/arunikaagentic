'use client';

import { useState, useEffect } from 'react';
import { DashboardCard } from './dashboard-card';
import { AlertCircle, CheckCircle, Clock, PlayCircle, RefreshCw } from 'lucide-react';
import { COWORK_INSTANCES, getAllWorkflows } from '@/services/cowork-api';

interface WorkflowStats {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgDuration: number;
  lastExecution: any;
}

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  instance: string;
  frequency: string;
  status: string;
  stats?: WorkflowStats;
}

export function CoworkWorkflowsDashboard() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, WorkflowStats>>({});

  // Fetch workflows
  useEffect(() => {
    fetchWorkflows();
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows?stats=true');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/workflows/stats?health=true');
      const data = await response.json();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    setExecuting(workflowId);
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, priority: 'high' }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Workflow executed:', data);
        // Refresh stats after execution
        setTimeout(fetchStats, 2000);
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setExecuting(workflowId);
    }
  };

  const executeDailyWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workflows/schedule/daily', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        alert(`Daily workflows executed: ${data.summary.successful} successful, ${data.summary.failed} failed`);
        setTimeout(fetchStats, 2000);
      }
    } catch (error) {
      console.error('Error executing daily workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show a default list if no workflows are fetched from API
  const displayWorkflows = workflows.length > 0 ? workflows : [
    { id: 'social-media-daily', name: 'Daily Social Media Content Generation', description: 'Auto-generate social media posts untuk LinkedIn, Instagram, Twitter', instance: 'sales-marketing', frequency: 'Daily at 09:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'email-campaign-weekly', name: 'Weekly Email Campaign Automation', description: 'Generate & send targeted email campaigns to leads', instance: 'sales-marketing', frequency: 'Every Monday at 10:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'expense-report-automation', name: 'Expense Report Processing', description: 'Auto-process receipt OCR & categorize expenses', instance: 'finance-operations', frequency: 'Daily at 16:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'bank-reconciliation', name: 'Bank Reconciliation Automation', description: 'Auto-match transactions & flag discrepancies', instance: 'finance-operations', frequency: 'Daily at 17:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'invoice-processing', name: 'Invoice Processing Automation', description: 'Auto-extract, classify, validate invoice PDFs', instance: 'finance-operations', frequency: 'Continuous (email trigger)', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'payroll-processing', name: 'Payroll Processing Automation', description: 'Auto-validate & process payroll data', instance: 'finance-operations', frequency: 'Monthly (25th of month)', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'content-calendar-generation', name: 'Monthly Content Calendar Generation', description: 'Generate 30-day content calendar dengan theme & topics', instance: 'sales-marketing', frequency: 'First day of month at 08:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'daily-briefing', name: 'Daily Briefing & Intelligence Report', description: 'Generate executive briefing dengan key metrics & insights', instance: 'ceo-dashboard', frequency: 'Daily at 08:30 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'weekly-performance-review', name: 'Weekly Performance Review', description: 'Compile weekly metrics & performance analysis', instance: 'ceo-dashboard', frequency: 'Every Monday at 17:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'tax-compliance-report', name: 'Tax Compliance Reporting', description: 'Auto-generate monthly/quarterly tax compliance reports', instance: 'finance-operations', frequency: 'Monthly & Quarterly', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'monthly-financial-summary', name: 'Monthly Financial Summary Report', description: 'Compile monthly P&L, cash flow & balance sheet', instance: 'ceo-dashboard', frequency: 'Last day of month at 17:00 WIB', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
    { id: 'quarterly-business-review', name: 'Quarterly Business Review', description: 'Quarterly analysis of all metrics & KPIs', instance: 'ceo-dashboard', frequency: 'End of each quarter', status: 'active', stats: { totalExecutions: 0, successCount: 0, failureCount: 0, successRate: 0, avgDuration: 0 } },
  ];

  const filteredWorkflows = selectedInstance
    ? displayWorkflows.filter(w => w.instance === selectedInstance)
    : displayWorkflows;

  const instances = Object.values(COWORK_INSTANCES);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 Cowork Arunika Agentic AI Workflows</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor & execute {workflows.length > 0 ? workflows.length : '12'} workflows across 4 Cowork instances: Central-Hub, Sales-Marketing, Finance-Operations, CEO-Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={executeDailyWorkflows}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <PlayCircle size={16} />
            Run Daily Workflows
          </button>
        </div>
      </div>

      {/* Instance Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedInstance(null)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedInstance === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Instances
        </button>
        {instances.map(instance => (
          <button
            key={instance.id}
            onClick={() => setSelectedInstance(instance.id)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedInstance === instance.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {instance.name}
          </button>
        ))}
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWorkflows.length > 0 ? filteredWorkflows.map(workflow => {
          const workflowStats = stats[workflow.id] || workflow.stats;
          const successRate = workflowStats?.successRate || 0;
          const lastExecution = workflowStats?.lastExecution;

          return (
            <DashboardCard key={workflow.id} title={workflow.name}>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">{workflow.description}</p>

                {/* Frequency */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{workflow.frequency}</span>
                </div>

                {/* Stats */}
                {workflowStats && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                      <span className={`font-semibold ${successRate >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                        {successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Executions:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {workflowStats.totalExecutions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Avg Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(workflowStats.avgDuration / 1000).toFixed(1)}s
                      </span>
                    </div>
                    {lastExecution && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last: {new Date(lastExecution.startTime).toLocaleDateString()} at{' '}
                        {new Date(lastExecution.startTime).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {workflow.status === 'active' ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-600" />
                      <span className="text-sm text-red-600 dark:text-red-400">Inactive</span>
                    </>
                  )}
                </div>

                {/* Execute Button */}
                <button
                  onClick={() => executeWorkflow(workflow.id)}
                  disabled={executing === workflow.id}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  <PlayCircle size={16} />
                  {executing === workflow.id ? 'Running...' : 'Execute Now'}
                </button>
              </div>
            </DashboardCard>
          );
        }) : (
          <div className="col-span-1 lg:col-span-2 p-8 text-center text-gray-500">
            <p>Loading workflows...</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <DashboardCard title="Overall Performance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(stats).reduce((sum, s) => sum + s.successCount, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(stats).reduce((sum, s) => sum + s.failureCount, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(
                (Object.values(stats).reduce((sum, s) => sum + s.successCount, 0) /
                  (Object.values(stats).reduce((sum, s) => sum + s.totalExecutions, 0) || 1)) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
