'use client'

interface TrendPoint {
  date: string
  value: number
}

interface TrendChartProps {
  data?: TrendPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  // Generate SVG path
  const width = 400
  const height = 100
  const padding = 10
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight
    return { x, y, ...point }
  })

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 mb-4">
        {data.map((point, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {point.date}
            </div>
            <div className="relative h-16 bg-gray-100 dark:bg-dark-800 rounded-lg flex items-end justify-center">
              <div
                className="w-8 rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-300 hover:shadow-lg hover:scale-110"
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              />
              <span className="absolute -bottom-6 text-xs font-bold text-gray-600 dark:text-gray-400">
                {point.value}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative: SVG line chart */}
      <svg width={width} height={height} className="w-full mt-8">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i / 100) * chartHeight}
            x2={width - padding}
            y2={padding + (i / 100) * chartHeight}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaData} fill="url(#areaGradient)" />

        {/* Line */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-500"
        />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="currentColor"
            className="text-primary-500"
          />
        ))}
      </svg>
    </div>
  )
}
