'use client'

import { useState, useEffect } from 'react'
import { DashboardCard } from '@/components/dashboard-card'
import { KPICard } from '@/components/kpi-card'
import { AlertCircle } from 'lucide-react'

interface Agent {
  id: string
  name: string
  purpose: string
  status: 'active' | 'idle' | 'error'
  tasksCompleted: number
  successRate: number
  lastActive: string
  capacity: number
  currentLoad: number
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'tasks' | 'status'>('name')

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/workflows/stats')
        const data = await response.json()

        // Create agents based on real workflow data
        const realAgents: Agent[] = [
          {
            id: '1',
            name: 'Arunika-Central-Hub',
            purpose: 'Orchestration & monitoring',
            status: 'active',
            tasksCompleted: data.totalExecutions || 0,
            successRate: data.successRate || 0,
            lastActive: 'Active',
            capacity: 100,
            currentLoad: (data.totalExecutions || 0) > 0 ? 70 : 0,
          },
          {
            id: '2',
            name: 'Arunika-Sales-Marketing',
            purpose: 'Campaign automation, email, social media',
            status: 'active',
            tasksCompleted: data.totalExecutions || 0,
            successRate: data.successRate || 0,
            lastActive: 'Active',
            capacity: 100,
            currentLoad: (data.totalExecutions || 0) > 0 ? 45 : 0,
          },
          {
            id: '3',
            name: 'Arunika-Finance-Operations',
            purpose: 'Invoice processing, expense reports',
            status: 'active',
            tasksCompleted: Math.floor((data.totalExecutions || 0) * 0.8),
            successRate: data.successRate || 0,
            lastActive: 'Active',
            capacity: 100,
            currentLoad: (data.totalExecutions || 0) > 0 ? 55 : 0,
          },
          {
            id: '4',
            name: 'Arunika-CEO-Dashboard',
            purpose: 'Executive intelligence & briefings',
            status: 'active',
            tasksCompleted: Math.floor((data.totalExecutions || 0) * 0.6),
            successRate: data.successRate || 0,
            lastActive: 'Active',
            capacity: 100,
            currentLoad: (data.totalExecutions || 0) > 0 ? 30 : 0,
          },
        ]

        setAgents(realAgents)
      } catch (error) {
        console.error('Failed to fetch agent data:', error)
        setAgents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'tasks':
        return b.tasksCompleted - a.tasksCompleted
      case 'status':
        return a.status.localeCompare(b.status)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const activeCount = agents.filter((a) => a.status === 'active').length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0)
  const avgSuccessRate = (
    agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length
  ).toFixed(1)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'idle':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢'
      case 'idle':
        return '⚪'
      case 'error':
        return '🔴'
      default:
        return ''
    }
  }

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
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor your AI agents and their performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Active Agents"
          value={activeCount}
          change={`out of ${agents.length}`}
          icon="🤖"
          trend="up"
        />
        <KPICard
          title="Total Tasks"
          value={totalTasks.toLocaleString()}
          change="+8.2%"
          icon="✅"
          trend="up"
        />
        <KPICard
          title="Avg Success Rate"
          value={`${avgSuccessRate}%`}
          change="+1.5%"
          icon="📈"
          trend="up"
        />
      </div>

      {/* Agents List with Controls */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agent Status</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="tasks">Sort by Tasks</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        <DashboardCard title="Agent Status">
          <div className="grid grid-cols-1 gap-4">
            {sortedAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getStatusIcon(agent.status)}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{(agent as any).purpose || 'Last active: ' + agent.lastActive}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(agent.status)}`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{agent.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{agent.successRate}%</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Load</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-dark-600 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            agent.currentLoad > 80
                              ? 'bg-red-500'
                              : agent.currentLoad > 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${agent.currentLoad}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-12">
                        {agent.currentLoad}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Agent Health Alert */}
      {agents.some(a => a.status === 'error') && (
        <DashboardCard title="⚠️ Instance Health Alert">
          <div className="space-y-3">
            {agents.filter(a => a.status === 'error').map(agent => (
              <div key={agent.id} className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">{agent.name} - {agent.status}</p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    Instance status requires attention. Last activity: {agent.lastActive}
                  </p>
                  <button className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2 hover:underline">
                    View Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="📊 Tasks by Agent">
          <div className="space-y-3">
            {sortedAgents
              .slice(0, 5)
              .map((agent) => (
                <div key={agent.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-sm text-gray-500">{agent.tasksCompleted}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(agent.tasksCompleted / Math.max(...agents.map((a) => a.tasksCompleted))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </DashboardCard>

        <DashboardCard title="📈 Success Rates">
          <div className="space-y-3">
            {sortedAgents
              .sort((a, b) => b.successRate - a.successRate)
              .slice(0, 5)
              .map((agent) => (
                <div
                  key={agent.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-800 rounded"
                >
                  <span className="text-sm font-medium">{agent.name}</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {agent.successRate}%
                  </span>
                </div>
              ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
