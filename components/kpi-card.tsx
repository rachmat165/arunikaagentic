'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change: string
  icon: string
  trend: 'up' | 'down'
}

export function KPICard({ title, value, change, icon, trend }: KPICardProps) {
  const isPositive = trend === 'up'
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="card group hover:shadow-lg hover:scale-105 transform transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <TrendIcon className={`w-5 h-5 ${changeColor}`} />
      </div>

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>

      <p className={`text-sm font-semibold ${changeColor}`}>
        {change} this {title.includes('Cost') ? 'period' : 'week'}
      </p>

      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300 -z-10" />
    </div>
  )
}
