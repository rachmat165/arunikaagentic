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
} from 'lucide-react'

const menuItems = [
  { icon: BarChart3, label: 'Executive Summary', href: '/summary', badge: null },
  { icon: CheckSquare, label: 'To-Do Lists', href: '/todos', badge: 'New' },
  { icon: DollarSign, label: 'Costs & Budget', href: '/costs', badge: null },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics', badge: null },
  { icon: Bot, label: 'AI Agents', href: '/agents', badge: '24' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

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
