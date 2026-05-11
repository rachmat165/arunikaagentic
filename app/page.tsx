'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard-card'
import { KPICard } from '@/components/kpi-card'
import { Chart3D } from '@/components/chart-3d'
import { ExecutiveSummary } from '@/components/executive-summary'
import { TodoList } from '@/components/todo-list'
import { CostBreakdown } from '@/components/cost-breakdown'
import { TrendChart } from '@/components/trend-chart'
import { CoworkWorkflowsDashboard } from '@/components/cowork-workflows-dashboard'

type Period = 'daily' | 'monthly' | 'yearly'

interface TaskByAgentItem {
  agent: string
  tasks: number
  completed: number
}

interface TrendPoint {
  date: string
  value: number
}

interface DashboardCosts {
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

interface DashboardData {
  totalAgents: number
  activeTasks: number
  totalCosts: number
  successRate: number
  tasksByAgent: TaskByAgentItem[]
  costs: DashboardCosts
  trends: TrendPoint[]
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('daily')
  const [data, setData] = useState<DashboardData | null>(null)
  const [coworkStats, setCoworkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Cowork stats
    const fetchCoworkStats = async () => {
      try {
        const response = await fetch('/api/workflows/stats?health=true')
        const statsData = await response.json()
        setCoworkStats(statsData)
      } catch (error) {
        console.error('Error fetching cowork stats:', error)
      }
    }

    // Simulate data fetching with Cowork integration
    const timer = setTimeout(() => {
      setData({
        totalAgents: 24,
        activeTasks: 156,
        totalCosts: 2450,
        successRate: 94.2,
        tasksByAgent: [
          { agent: 'Agent Alpha', tasks: 32, completed: 28 },
          { agent: 'Agent Beta', tasks: 28, completed: 25 },
          { agent: 'Agent Gamma', tasks: 24, completed: 22 },
          { agent: 'Agent Delta', tasks: 20, completed: 18 },
          { agent: 'Agent Epsilon', tasks: 20, completed: 19 },
        ],
        costs: {
          daily: 78.50,
          weekly: 549.50,
          monthly: 2450,
          yearly: 29400,
        },
        trends: [
          { date: 'Mon', value: 65 },
          { date: 'Tue', value: 72 },
          { date: 'Wed', value: 68 },
          { date: 'Thu', value: 85 },
          { date: 'Fri', value: 92 },
          { date: 'Sat', value: 78 },
          { date: 'Sun', value: 88 },
        ],
      })
      setLoading(false)
    }, 500)

    fetchCoworkStats()

    return () => clearTimeout(timer)
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
            Monitor your Agentic AI system performance in real-time
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Agents"
          value={data?.totalAgents ?? 0}
          change="+5%"
          icon="🤖"
          trend="up"
        />
        <KPICard
          title="Active Tasks"
          value={data?.activeTasks ?? 0}
          change="+12%"
          icon="✅"
          trend="up"
        />
        <KPICard
          title="Total Costs"
          value={`$${data?.costs[period]?.toFixed(2)}`}
          change="-8%"
          icon="💰"
          trend="down"
        />
        <KPICard
          title="Success Rate"
          value={`${data?.successRate}%`}
          change="+2.1%"
          icon="📈"
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 3D Visualization */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardCard title="📊 3D Performance Visualization" className="h-96">
            <Chart3D data={data?.tasksByAgent} />
          </DashboardCard>

          {/* Performance Trends */}
          <DashboardCard title="📈 Weekly Performance Trends">
            <TrendChart data={data?.trends} />
          </DashboardCard>
        </div>

        {/* Right Column - Tasks & Costs */}
        <div className="space-y-8">
          <DashboardCard title="✅ Recent Tasks" maxHeight="h-96">
            <TodoList />
          </DashboardCard>

          <DashboardCard title="💰 Cost Breakdown">
            <CostBreakdown />
          </DashboardCard>
        </div>
      </div>

      {/* Full Width Sections */}
      <ExecutiveSummary period={period} data={data} />

      {/* Cowork Workflows Integration */}
      <div className="pt-8 border-t border-gray-200 dark:border-dark-600">
        <CoworkWorkflowsDashboard />
      </div>
    </div>
  )
}
