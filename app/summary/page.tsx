'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard-card'
import { KPICard } from '@/components/kpi-card'
import { ExecutiveSummary } from '@/components/executive-summary'

type Period = 'daily' | 'monthly' | 'yearly'

interface DashboardData {
  totalAgents: number
  activeTasks: number
  totalCosts: number
  successRate: number
}

export default function SummaryPage() {
  const [period, setPeriod] = useState<Period>('daily')
  const [data, setData] = useState<DashboardData | null>(null)
  const [coworkStats, setCoworkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real Cowork stats from ExecutionTracker
    const fetchCoworkStats = async () => {
      try {
        const response = await fetch('/api/workflows/stats')
        const statsData = await response.json()

        // Use real execution data
        const realData: DashboardData = {
          totalAgents: 4, // 4 real Cowork instances
          activeTasks: statsData.totalExecutions || 0,
          totalCosts: 40, // $40/month real budget
          successRate: statsData.successRate || 0,
        }

        setData(realData)
        setCoworkStats(statsData)
      } catch (error) {
        console.error('Error fetching cowork stats:', error)
        // Fallback to empty state
        setData({
          totalAgents: 4,
          activeTasks: 0,
          totalCosts: 40,
          successRate: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCoworkStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Executive Summary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Detailed overview of your Agentic AI system performance
          </p>
        </div>
        <div className="flex gap-2">
          {(['daily', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-600 hover:border-primary-500'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Cowork Instances"
          value={data?.totalAgents}
          change="Real instances"
          icon="🤖"
          trend="up"
        />
        <KPICard
          title="Total Executions"
          value={data?.activeTasks}
          change="All time"
          icon="✅"
          trend={data?.activeTasks ? 'up' : 'down'}
        />
        <KPICard
          title="Monthly Budget"
          value={`$${data?.totalCosts}`}
          change="Infrastructure only"
          icon="💰"
          trend="down"
        />
        <KPICard
          title="Success Rate"
          value={`${data?.successRate?.toFixed(1) || 0}%`}
          change="Overall accuracy"
          icon="📈"
          trend={data && data.successRate >= 95 ? 'up' : 'down'}
        />
      </div>

      {/* Detailed Executive Summary */}
      <ExecutiveSummary period={period} data={data} />

      {/* Cowork Instances Overview */}
      <DashboardCard title="🏗️ Cowork Instances (4 Real)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <h3 className="font-bold text-gray-900 dark:text-white">Arunika-Central-Hub</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Orchestration & monitoring</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Status: Active</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <h3 className="font-bold text-gray-900 dark:text-white">Arunika-Sales-Marketing</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Campaign automation, email, social media</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Status: Active</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <h3 className="font-bold text-gray-900 dark:text-white">Arunika-Finance-Operations</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Invoice processing, expense reports</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Status: Active</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <h3 className="font-bold text-gray-900 dark:text-white">Arunika-CEO-Dashboard</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Executive intelligence & briefings</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Status: Active</p>
          </div>
        </div>
      </DashboardCard>

      {/* Real Execution Statistics */}
      {coworkStats && (
        <DashboardCard title="📊 Real Execution Statistics from ExecutionTracker">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coworkStats.totalExecutions || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real data from tracker</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coworkStats.successRate?.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accuracy metric</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Execution Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coworkStats.avgExecutionTime || 0}ms
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Processing speed</p>
              </div>
            </div>
            {coworkStats.totalExecutions === 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">⏳ Waiting for Executions</p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Dashboard will populate with real execution data once Cowork tasks run and report results via the report-execution API endpoint.
                </p>
              </div>
            )}
          </div>
        </DashboardCard>
      )}
    </div>
  )
}
