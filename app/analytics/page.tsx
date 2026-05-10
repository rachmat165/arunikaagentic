'use client'

import { useState, useEffect } from 'react'
import { DashboardCard } from '@/components/dashboard-card'
import { KPICard } from '@/components/kpi-card'
import { TrendChart } from '@/components/trend-chart'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/workflows/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const performanceData = [
    { date: 'Week 1', value: 85 },
    { date: 'Week 2', value: 89 },
    { date: 'Week 3', value: 92 },
    { date: 'Week 4', value: 94 },
  ]

  const taskCompletionData = [
    { date: 'Mon', value: 45 },
    { date: 'Tue', value: 52 },
    { date: 'Wed', value: 48 },
    { date: 'Thu', value: 61 },
    { date: 'Fri', value: 73 },
    { date: 'Sat', value: 42 },
    { date: 'Sun', value: 38 },
  ]

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Deep dive into your system performance metrics</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-600 hover:border-primary-500'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Executions"
          value={`${stats?.totalExecutions || 0}`}
          change="Real-time"
          icon="⚡"
          trend="up"
        />
        <KPICard
          title="Success Rate"
          value={`${stats?.successRate?.toFixed(1) || 0}%`}
          change="Overall accuracy"
          icon="✅"
          trend={stats?.successRate >= 95 ? 'up' : 'down'}
        />
        <KPICard
          title="Avg Execution Time"
          value={`${stats?.avgExecutionTime || 0}ms`}
          change="Processing speed"
          icon="⏱️"
          trend="down"
        />
        <KPICard
          title="Active Workflows"
          value="4"
          change="Cowork instances"
          icon="🔄"
          trend="up"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="📈 System Performance Trend">
          <TrendChart data={performanceData} />
        </DashboardCard>

        <DashboardCard title="✅ Task Completion Rate">
          <TrendChart data={taskCompletionData} />
        </DashboardCard>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="📊 Request Distribution">
          <div className="space-y-3">
            {[
              { name: 'API Calls', percentage: 45, value: '1,245' },
              { name: 'Dashboard Loads', percentage: 30, value: '845' },
              { name: 'Report Generations', percentage: 15, value: '412' },
              { name: 'Other', percentage: 10, value: '275' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="🎯 Success Rates by Region">
          <div className="space-y-3">
            {[
              { region: 'US East', rate: 99.9 },
              { region: 'US West', rate: 99.8 },
              { region: 'EU', rate: 99.7 },
              { region: 'APAC', rate: 99.6 },
            ].map((item) => (
              <div key={item.region} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-800 rounded">
                <span className="text-sm font-medium">{item.region}</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{item.rate}%</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="⏱️ Response Time Percentiles">
          <div className="space-y-3">
            {[
              { percentile: 'p50', time: '120ms' },
              { percentile: 'p95', time: '245ms' },
              { percentile: 'p99', time: '450ms' },
              { percentile: 'p99.9', time: '890ms' },
            ].map((item) => (
              <div key={item.percentile} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-800 rounded">
                <span className="text-sm font-medium">{item.percentile.toUpperCase()}</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{item.time}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Execution Tracking Analytics */}
      <DashboardCard title="📊 Real Execution Analytics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Execution Time</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.avgExecutionTime || 0}ms</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From ExecutionTracker</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.successRate?.toFixed(1) || 0}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall accuracy</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalExecutions || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cowork Instances</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active workflows</p>
          </div>
        </div>
      </DashboardCard>

      {/* Insights */}
      <DashboardCard title="💡 Execution Insights">
        <div className="space-y-3">
          {!stats || stats.totalExecutions === 0 ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">⏳ Awaiting Execution Data</p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                