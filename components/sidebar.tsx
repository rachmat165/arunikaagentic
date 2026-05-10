'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Bot,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: BarChart3, label: 'Executive Summary', href: '/summary', badge: null },
  { icon: CheckSquare, label: 'To-Do Lists', href: '/todos', badge: 'New' },
  { icon: DollarSign, label: 'Costs & Budget', href: '/costs', badge: null },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics', badge: null },
  { icon: Bot, label: 'AI Agents', href: '/agents', badge: '24' },
]

interface DivisionalMenuItem {
  label: string
  badge?: number
  href?: string
}

interface Division {
  id: string
  name: string
  icon: string
  badge?: number
  items: DivisionalMenuItem[]
}

const divisions: Division[] = [
  {
    id: 'ceo',
    name: '👔 CEO Office',
    icon: '👔',
    badge: 8,
    items: [
      { label: 'CEO Tasks', badge: 5, href: '/divisional-management?div=ceo&menu=tasks' },
      { label: 'CEO Mailbox', badge: 3, href: '/divisional-management?div=ceo&menu=mailbox' },
      { label: 'Division Reports', href: '/divisional-management?div=ceo&menu=reports' },
      { label: 'Approval Center', badge: 8, href: '/divisional-management?div=ceo&menu=approvals' },
    ],
  },
  {
    id: 'sales',
    name: '💼 Sales & Marketing',
    icon: '💼',
    badge: 12,
    items: [
      { label: 'Team Tasks', badge: 7, href: '/divisional-management?div=sales&menu=tasks' },
      { label: 'Division Mailbox', badge: 2, href: '/divisional-management?div=sales&menu=mailbox' },
      { label: 'Division Reports', href: '/divisional-management?div=sales&menu=reports' },
      { label: 'Task Management', badge: 3, href: '/divisional-management?div=sales&menu=approvals' },
    ],
  },
  {
    id: 'ops',
    name: '🏢 Operations & Finance',
    icon: '🏢',
    badge: 9,
    items: [
      { label: 'Operational Tasks', badge: 6, href: '/divisional-management?div=ops&menu=tasks' },
      { label: 'Division Mailbox', badge: 1, href: '/divisional-management?div=ops&menu=mailbox' },
      { label: 'Financial Reports', href: '/divisional-management?div=ops&menu=reports' },
      { label: 'Approval & Sign-off', badge: 4, href: '/divisional-management?div=ops&menu=approvals' },
    ],
  },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedDivision, setExpandedDivision] = useState<string | null>('ceo')

  return (
    <aside className="w-64 bg-white dark:bg-dark-700 border-r border-gray-200 dark:border-dark-600 flex flex-col transition-colors">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-200 dark:border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Arunika</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Agentic AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500 dark:bg-opacity-20 text-primary-600 dark:text-primary-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-500'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        {/* Divisional Management Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
          <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Divisional Management
          </p>

          {divisions.map((division) => (
            <div key={division.id}>
              {/* Division Header */}
              <button
                onClick={() => setExpandedDivision(expandedDivision === division.id ? null : division.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
              >
                <span className="text-lg">{division.icon}</span>
                <span className="flex-1 text-sm font-medium">{division.name}</span>
                {division.badge && (
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                    {division.badge}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${expandedDivision === division.id ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Division Items */}
              {expandedDivision === division.id && (
                <div className="space-y-1 ml-4">
                  {division.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href || '#'}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-all"
                    >
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 dark:border-dark-600 px-4 py-6 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500 dark:bg-opacity-20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-all group">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
