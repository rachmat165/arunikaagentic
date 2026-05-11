'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { AgentDetailView } from './agent-detail-view'

interface SubmenuItemProps {
  agentId: string
  /**
   * Backward-compatible “controlled active” flag used by older callers.
   * When provided, the submenu expands/collapses to match.
   */
  activeSubmenu?: boolean
  /**
   * Optional tab id forwarded to AgentDetailView: 'tasks' | 'messages' | 'reports' | 'approvals'
   */
  activeTab?: string
}

export function SubmenuItem({ agentId, activeSubmenu, activeTab }: SubmenuItemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(!!activeSubmenu)

  useEffect(() => {
    if (typeof activeSubmenu === 'boolean') {
      setIsExpanded(activeSubmenu)
    }
  }, [activeSubmenu])

  const isActive = typeof activeSubmenu === 'boolean' ? activeSubmenu : isExpanded

  // Toggle submenu expansion
  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="border border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden transition-all">
      {/* Submenu Header */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full px-4 py-3 flex items-center justify-between gap-3 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors ${
          isActive ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className="text-xl">{AGENT_ICONS[agentId] ?? '🤖'}</span>

          {/* Text */}
          <div className="min-w-0 flex-1 text-left">
            <p
              className={`font-medium truncate ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {AGENT_NAMES[agentId] ?? agentId}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isExpanded ? 'Click to collapse' : 'Click to expand'}</p>
          </div>

          {/* Chevron indicator */}
          <span className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-primary-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </span>
        </div>

        {/* Quick stats badge */}
        {isActive && (
          <div className="flex gap-1">
            <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md text-xs font-medium whitespace-nowrap">
              {AGENT_STATS[agentId]?.tasks ?? 0} tasks
            </span>
          </div>
        )}
      </button>

      {/* Detail View - Only show when expanded */}
      {isExpanded && (
        <AgentDetailView agentId={agentId} activeTab={activeTab ?? 'tasks'} />
      )}
    </div>
  )
}

// Agent icons and names mapping
const AGENT_ICONS: Record<string, string> = {
  'sales-marketing': '💼',
  'finance-operations': '🏢',
  'ceo-office': '👔',
}

const AGENT_NAMES: Record<string, string> = {
  'sales-marketing': 'Sales & Marketing Division',
  'finance-operations': 'Operations & Finance Division',
  'ceo-office': 'CEO Office',
}

const AGENT_STATS: Record<string, { tasks: number; messages: number; reports: number; approvals: number }> = {
  'sales-marketing': { tasks: 4, messages: 2, reports: 3, approvals: 2 },
  'finance-operations': { tasks: 3, messages: 2, reports: 3, approvals: 2 },
  'ceo-office': { tasks: 3, messages: 2, reports: 3, approvals: 2 },
}
