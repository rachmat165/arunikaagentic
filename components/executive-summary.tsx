'use client'

import { useEffect, useState } from 'react'

interface ExecutiveSummaryProps {
  period: 'daily' | 'monthly' | 'yearly'
  data: any
}

export function ExecutiveSummary({ period, data }: ExecutiveSummaryProps) {
  const [coworkStats, setCoworkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoworkStats = async () => {
      try {
        const response = await fetch('/api/workflows/stats?health=true')
        const statsData = await response.json()
        setCoworkStats(statsData)
      } catch (error) {
        console.error('Error fetching cowork stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoworkStats()
  }, [])
  const getCoworkSummary = () => {
    if (!coworkStats) return ''
    const { summary = {} } = coworkStats
    const { totalWorkflows = 0, totalSuccessful = 0, totalFailed = 0, overallSuccessRate = 0 } = summary

    return period === 'daily'
      ? `Cowork Arunika Agentic AI is executing ${totalWorkflows} workflows today with ${overallSuccessRate.toFixed(1)}% success rate. Successful executions: ${totalSuccessful}, Failed: ${totalFailed}. Daily operations running smoothly across all 4 instances (Central-Hub, Sales-Marketing, Finance-Operations, CEO-Dashboard).`
      : `Cowork project has executed ${totalWorkflows} active workflows with ${overallSuccessRate.toFixed(1)}% overall success rate. Total successful executions: ${totalSuccessful}. The system manages complex automation tasks including social media generation, email campaigns, invoice processing, payroll automation, and executive reporting.`
  }

  const summaryText = {
    daily: getCoworkSummary() || "Today's system is operating at peak efficiency with all agents completing 94.2% of assigned tasks. API costs are within budget, and response times are optimal.",
    monthly:
      getCoworkSummary() || 'This month shows strong performance across all metrics. We processed 156 active tasks with a 94.2% success rate. Total expenses are $2,450, indicating efficient resource utilization.',
    yearly:
      getCoworkSummary() || 'Annual performance demonstrates consistent growth and reliability. With 24 active AI agents handling complex workflows, the system has maintained a 94.2% success rate while optimizing costs across compute, storage, and networking resources.',
  }

  const getCoworkMetrics = () => {
    if (!coworkStats) return []
    const { summary = {} } = coworkStats
    const { totalWorkflows = 0, totalSuccessful = 0, totalFailed = 0, overallSuccessRate = 0, totalExecutions = 0, avgDuration = 0 } = summary

    return period === 'daily'
      ? [
          { label: 'Workflows Executed Today', value: `${totalWorkflows}`, change: '+100%' },
          { label: 'Success Rate (Cowork)', value: `${overallSuccessRate.toFixed(1)}%`, change: '+5%' },
          { label: 'Avg Duration', value: `${(avgDuration / 1000 / 60).toFixed(1)}m`, change: '-10%' },
        ]
      : period === 'monthly'
        ? [
            { label: 'Total Executions', value: `${totalExecutions}`, change: '+25%' },
            { label: 'Successful', value: `${totalSuccessful}`, change: '+15%' },
            { label: 'Failed', value: `${totalFailed}`, change: '-5%' },
          ]
        : [
            { label: 'Workflows Active', value: `${totalWorkflows}`, change: '+10' },
            { label: 'Success Rate', value: `${overallSuccessRate.toFixed(1)}%`, change: '+8%' },
            { label: 'Total Instances', value: '4', change: 'Stable' },
          ]
  }

  const metrics = {
    daily: getCoworkMetrics().length > 0 ? getCoworkMetrics() : [
      { label: 'Avg Response Time', value: '234ms', change: '-5%' },
      { label: 'Tasks/Hour', value: '12.4', change: '+3%' },
      { label: 'Error Rate', value: '0.8%', change: '-2%' },
    ],
    monthly: getCoworkMetrics().length > 0 ? getCoworkMetrics() : [
      { label: 'Avg Response Time', value: '245ms', change: '+2%' },
      { label: 'Tasks Completed', value: '147', change: '+8%' },
      { label: 'Uptime', value: '99.8%', change: '+0.2%' },
    ],
    yearly: getCoworkMetrics().length > 0 ? getCoworkMetrics() : [
      { label: 'Total Agents Deployed', value: '24', change: '+6' },
      { label: 'Total Tasks', value: '1,847', change: '+40%' },
      { label: 'Avg Success Rate', value: '94.2%', change: '+2.1%' },
    ],
  }

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {period === 'daily'
            ? "Today's Summary"
            : period === 'monthly'
              ? 'Monthly Summary'
              : 'Yearly Summary'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {summaryText[period]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics[period].map((metric, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 hover:border-primary-500 transition-colors"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {metric.label}
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </span>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-dark-600 flex justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Last Updated
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {new Date().toLocaleString()}
          </p>
        </div>
        <button className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
          Export Report
        </button>
      </div>
    </div>
  )
}
