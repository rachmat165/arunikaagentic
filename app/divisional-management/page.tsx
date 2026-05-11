'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DivisionalContent } from '@/components/DivisionalContent'

/**
 * Divisional Management Page
 *
 * Integrated divisional management system with multi-division support
 * for tasks, mailbox, reports, and approval workflows
 */

const divisionNames: Record<string, string> = {
  ceo: 'CEO Office',
  sales: 'Sales & Marketing',
  ops: 'Operations & Finance',
}

const menuMap: Record<string, string> = {
  tasks: 'tasks',
  mailbox: 'mailbox',
  reports: 'reports',
  approvals: 'approvals',
}

function DivisionalManagementClient() {
  const searchParams = useSearchParams()

  const [activeMenu, setActiveMenu] = useState<string | null>('tasks')
  const [activeDivision, setActiveDivision] = useState<string>('CEO Office')

  useEffect(() => {
    // Get division and menu from query parameters
    const divParam = searchParams.get('div') || 'ceo'
    const menuParam = searchParams.get('menu') || 'tasks'

    // Update division name
    setActiveDivision(divisionNames[divParam] || 'CEO Office')

    // Update menu
    setActiveMenu(menuMap[menuParam] || 'tasks')
  }, [searchParams])

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionalContent activeMenu={activeMenu} division={activeDivision} />
    </div>
  )
}

export default function DivisionalManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      }
    >
      <DivisionalManagementClient />
    </Suspense>
  )
}
