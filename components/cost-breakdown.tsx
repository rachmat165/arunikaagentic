'use client'

const costItems = [
  { label: 'API Calls', amount: 850, percentage: 34, color: 'bg-blue-500' },
  { label: 'GPU Compute', amount: 920, percentage: 37, color: 'bg-purple-500' },
  { label: 'Storage', amount: 340, percentage: 14, color: 'bg-green-500' },
  { label: 'Network', amount: 340, percentage: 15, color: 'bg-orange-500' },
]

export function CostBreakdown() {
  const total = costItems.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ${total.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Monthly expenses
        </p>
      </div>

      <div className="space-y-3">
        {costItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ${item.amount}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-300`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {item.percentage}% of total
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
        <button className="w-full py-2 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}
