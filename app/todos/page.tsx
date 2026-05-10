'use client'

import { useState, useEffect } from 'react'
import { DashboardCard } from '@/components/dashboard-card'
import { CheckCircle, Circle, Trash2 } from 'lucide-react'

interface Todo {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  category: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: '🔴 CRITICAL: Obtain GCP service account JSON keys from Google Cloud Console',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-10',
      category: 'Infrastructure',
    },
    {
      id: '2',
      title: 'Complete Central Hub Infrastructure setup (Week 1)',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-16',
      category: 'Deployment',
    },
    {
      id: '3',
      title: 'Deploy Sales & Marketing instance with campaign automation',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-19',
      category: 'Deployment',
    },
    {
      id: '4',
      title: 'Set up Finance-Operations instance for invoice processing',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-19',
      category: 'Deployment',
    },
    {
      id: '5',
      title: 'Configure CEO Dashboard for executive intelligence',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-26',
      category: 'Deployment',
    },
    {
      id: '6',
      title: 'Outreach to Yayasan Tarakanita (60 schools)',
      completed: false,
      priority: 'medium',
      dueDate: '2026-05-20',
      category: 'Sales',
    },
    {
      id: '7',
      title: 'Final preflight check before launch',
      completed: false,
      priority: 'high',
      dueDate: '2026-05-11',
      category: 'QA',
    },
    {
      id: '8',
      title: 'Launch preparation - all systems ready',
      completed: false,
      priority: 'high',
      dueDate: '2026-06-06',
      category: 'Launch',
    },
  ])

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    return true
  })

  const completedCount = todos.filter((t) => t.completed).length
  const pendingCount = todos.filter((t) => !t.completed).length

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
      case 'low':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      default:
        return ''
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return ''
    }
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">To-Do Lists</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your tasks and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Total Tasks" className="text-center">
          <p className="text-4xl font-bold text-primary-500">{todos.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All tasks</p>
        </DashboardCard>
        <DashboardCard title="Completed" className="text-center">
          <p className="text-4xl font-bold text-green-500">{completedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {((completedCount / todos.length) * 100).toFixed(0)}% Complete
          </p>
        </DashboardCard>
        <DashboardCard title="Pending" className="text-center">
          <p className="text-4xl font-bold text-orange-500">{pendingCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">In progress</p>
        </DashboardCard>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['all', 'completed', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-600 hover:border-primary-500'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <DashboardCard title="✅ Task List">
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks in this filter
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${getPriorityColor(
                  todo.priority
                )} ${todo.completed ? 'opacity-60' : ''}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-base font-medium ${
                      todo.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Priority Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(todo.priority)}`}>
                  {todo.priority}
                </span>

                {/* Category */}
                <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 rounded">
                  {todo.category}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </DashboardCard>

      {/* Progress Section */}
      <DashboardCard title="📊 Progress Overview">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
              <span className="text-sm font-bold text-primary-500">
                {((completedCount / todos.length) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                style={{ width: `${(completedCount / todos.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Completed This Week</p>
              <p className="text-xl 