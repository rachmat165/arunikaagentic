'use client'

interface DashboardCardProps {
  title: string
  children: React.ReactNode
  className?: string
  maxHeight?: string
}

export function DashboardCard({
  title,
  children,
  className = '',
  maxHeight = '',
}: DashboardCardProps) {
  return (
    <div className={`card ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className={`${maxHeight} overflow-auto`}>
        {children}
      </div>
    </div>
  )
}
