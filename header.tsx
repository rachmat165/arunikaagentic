'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Bell, User } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="bg-white dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600 px-8 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <input
          type="text"
          placeholder="Search agents, tasks..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            AA
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            Admin
          </span>
        </button>
      </div>
    </header>
  )
}
