'use client'

import { useState } from 'react'
import { Bot, CheckSquare, MessageSquare, FileText, TrendingUp, Calendar, Clock, User, ChevronDown, ChevronRight } from 'lucide-react'

// Type definitions for agent data
interface AgentTask {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  assignee?: string
}

interface AgentMessage {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
}

interface AgentReport {
  title: string
  period: string
  status: 'completed' | 'processing' | 'failed'
  metrics?: Record<string, number>
}

interface AgentApproval {
  id: string
  taskTitle: string
  requestedBy: string
  amount?: number
  submittedAt: string
  description: string
}

// Mock data for each agent/instance
const AGENT_DATA = {
  'sales-marketing': {
    icon: '💼',
    name: 'Sales & Marketing Division',
    tasks: [
      { id: 'T-001', title: 'Campaign Q2 Launch', status: 'in-progress', priority: 'high', dueDate: '2026-05-15', assignee: 'John Doe' },
      { id: 'T-002', title: 'Market Research Report', status: 'pending', priority: 'medium', dueDate: '2026-05-18', assignee: 'Jane Smith' },
      { id: 'T-003', title: 'Lead Generation Analysis', status: 'completed', priority: 'high', dueDate: '2026-05-10', assignee: 'John Doe' },
      { id: 'T-004', title: 'Competitor Analysis', status: 'pending', priority: 'low', dueDate: '2026-05-25', assignee: 'Bob Wilson' },
    ],
    messages: [
      { id: 'M-001', from: 'CEO Office', subject: 'Budget Approval Needed', preview: 'Please approve the Q2 marketing budget...', timestamp: 'Today 10:45 AM', read: false },
      { id: 'M-002', from: 'Ops & Finance', subject: 'Invoice Payment Status', preview: 'The monthly invoice for May has been processed...', timestamp: 'Today 9:15 AM', read: true },
    ],
    reports: [
      { title: 'Sales Performance Report', period: 'May 2026', status: 'completed' },
      { title: 'Marketing Campaign Results', period: 'April 2026', status: 'completed' },
      { title: 'Lead Generation Metrics', period: 'Q1 2026', status: 'processing' },
    ],
    approvals: [
      { id: 'AP-001', taskTitle: 'Budget Allocation Q2', requestedBy: 'Finance Division', amount: 50000, submittedAt: 'Today 11:30 AM', description: 'Marketing budget for Q2 campaign launch' },
      { id: 'AP-002', taskTitle: 'New Hire - Marketing Manager', requestedBy: 'HR Division', amount: 85000, submittedAt: 'Yesterday 2:15 PM', description: 'Salary approval for new marketing manager position' },
    ],
  },
  'finance-operations': {
    icon: '🏢',
    name: 'Operations & Finance Division',
    tasks: [
      { id: 'T-005', title: 'Monthly Financial Report', status: 'in-progress', priority: 'high', dueDate: '2026-05-14', assignee: 'Alice Chen' },
      { id: 'T-006', title: 'Bank Reconciliation', status: 'completed', priority: 'medium', dueDate: '2026-05-10', assignee: 'Bob Wilson' },
      { id: 'T-007', title: 'Expense Report Processing', status: 'pending', priority: 'high', dueDate: '2026-05-13', assignee: 'Alice Chen' },
    ],
    messages: [
      { id: 'M-003', from: 'CEO Office', subject: 'Q1 Financial Review', preview: 'Please prepare the Q1 financial summary...', timestamp: 'Yesterday 4:30 PM', read: true },
      { id: 'M-004', from: 'Sales & Marketing', subject: 'Budget Inquiry', preview: 'Request for additional budget allocation...', timestamp: 'Today 8:00 AM', read: false },
    ],
    reports: [
      { title: 'Monthly Financial Report', period: 'April 2026', status: 'completed' },
      { title: 'Cash Flow Analysis', period: 'Q1 2026', status: 'completed' },
      { title: 'Budget Utilization Report', period: 'May 2026', status: 'processing' },
    ],
    approvals: [
      { id: 'AP-003', taskTitle: 'Finance Manager Hire', requestedBy: 'HR Division', amount: 75000, submittedAt: 'Yesterday 1:00 PM', description: 'Salary approval for finance manager' },
      { id: 'AP-004', taskTitle: 'Office Equipment Purchase', requestedBy: 'Operations', amount: 25000, submittedAt: 'Today 9:00 AM', description: 'Purchase of new office equipment' },
    ],
  },
  'ceo-office': {
    icon: '👔',
    name: 'CEO Office',
    tasks: [
      { id: 'T-008', title: 'Executive Summary Review', status: 'in-progress', priority: 'high', dueDate: '2026-05-12', assignee: 'CEO' },
      { id: 'T-009', title: 'Strategic Planning Session', status: 'pending', priority: 'medium', dueDate: '2026-05-20', assignee: 'CEO' },
      { id: 'T-010', title: 'Board Meeting Preparation', status: 'completed', priority: 'high', dueDate: '2026-05-08', assignee: 'CEO' },
    ],
    messages: [
      { id: 'M-005', from: 'Sales & Marketing', subject: 'Monthly Report Submission', preview: 'The monthly sales report is ready for review...', timestamp: 'Today 11:00 AM', read: false },
      { id: 'M-006', from: 'Finance Division', subject: 'Annual Budget Proposal', preview: 'Draft budget proposal for FY2026 prepared...', timestamp: 'Yesterday 3:45 PM', read: true },
    ],
    reports: [
      { title: 'Executive Dashboard Report', period: 'May 2026', status: 'completed' },
      { title: 'Strategic Goals Tracker', period: 'FY2026', status: 'processing' },
      { title: 'Performance Metrics Summary', period: 'Q1 2026', status: 'completed' },
    ],
    approvals: [
      { id: 'AP-005', taskTitle: 'Annual Budget Approval', requestedBy: 'Finance Division', amount: 250000, submittedAt: 'Today 8:30 AM', description: 'FY2026 annual budget approval' },
      { id: 'AP-006', taskTitle: 'New Product Line Launch', requestedBy: 'Product Team', amount: 150000, submittedAt: 'Yesterday 4:00 PM', description: 'Budget for new product development' },
    ],
  },
}

interface DetailViewProps {
  agentId?: string
  activeTab?: string
}

export function AgentDetailView({ agentId = 'sales-marketing', activeTab = 'tasks' }: DetailViewProps) {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_DATA[agentId])
  const [activeSubtab, setActiveSubtab] = useState(activeTab)

  if (!selectedAgent) return null

  // Statistics for the agent
  const stats = {
    totalTasks: selectedAgent.tasks.length,
    pendingTasks: selectedAgent.tasks.filter(t => t.status === 'pending').length,
    completedTasks: selectedAgent.tasks.filter(t => t.status === 'completed').length,
    unreadMessages: selectedAgent.messages.filter(m => !m.read).length,
    totalReports: selectedAgent.reports.length,
    pendingApprovals: selectedAgent.approvals.length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const renderContent = () => {
    switch (activeSubtab) {
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Tasks & Assignments
              </h3>
              <div className="flex gap-2">
                {['All', 'Pending', 'In Progress', 'Completed'].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1 text-sm rounded-full border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {selectedAgent.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-dark-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()} Priority
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Due: {task.dueDate} • Assigned to: {task.assignee || 'Unassigned'}</p>
                    </div>
                    <button className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      {task.status === 'completed' ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'messages':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Division Mailbox
              </h3>
              <div className="flex gap-2">
                {['All', 'Unread', 'Archived'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeSubtab === `messages-${filter.toLowerCase()}`
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {selectedAgent.messages.map((message) => (
                <div key={message.id} className={`border rounded-lg p-4 transition-colors ${!message.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-dark-700 border-gray-200 dark:border-dark-600'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{message.from}</span>
                        {!message.read && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">New</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{message.subject}</h4>
                      <p className={`text-sm ${!message.read ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {message.preview}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Division Reports
              </h3>
              <div className="flex gap-2">
                {['All', 'Completed', 'Processing'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeSubtab === `reports-${filter.toLowerCase()}`
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {selectedAgent.reports.map((report) => (
                <div key={report.title} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-dark-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.period}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 hover:text-primary-500 transition-colors">
                      <TrendingUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'approvals':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Pending Approvals
              </h3>
              <div className="flex gap-2">
                {['All', 'Pending', 'Approved'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      activeSubtab === `approvals-${filter.toLowerCase()}`
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {selectedAgent.approvals.map((approval) => (
                <div key={approval.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-dark-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{approval.taskTitle}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{approval.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {approval.requestedBy}
                        </span>
                        <span>{approval.submittedAt}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {approval.amount && (
                        <div className="text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className={`font-bold ${approval.amount > 100000 ? 'text-red-500' : 'text-green-600'}`}>
                            ${approval.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare className="w-4 h-4" /> },
  ]

  return (
    <div className="border border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden bg-white dark:bg-dark-700 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 px-6 py-4 border-b border-gray-200 dark:border-dark-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedAgent.icon}</span>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{selectedAgent.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Click to expand all submenus</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Tasks:</span>
              <span className={`font-semibold ${stats.pendingTasks > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {stats.totalTasks} ({stats.pendingTasks} pending)
              </span>
            </div>

            <div className="px-3 py-1.5 bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Messages:</span>
              <span className={`font-semibold ${stats.unreadMessages > 0 ? 'text-blue-500' : 'text-green-600'}`}>
                {selectedAgent.messages.length} ({stats.unreadMessages} unread)
              </span>
            </div>

            <div className="px-3 py-1.5 bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Approvals:</span>
              <span className={`font-semibold ${stats.pendingApprovals > 0 ? 'text-orange-500' : 'text-green-600'}`}>
                {stats.pendingApprovals} pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-dark-600 px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeSubtab === tab.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  )
}