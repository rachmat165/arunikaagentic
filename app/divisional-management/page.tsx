'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DivisionalContent } from '@/components/DivisionalContent';

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
};

const menuMap: Record<string, string> = {
  tasks: 'tasks',
  mailbox: 'mailbox',
  reports: 'reports',
  approvals: 'approvals',
};

export default function DivisionalManagementPage() {
  const searchParams = useSearchParams();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeDivision, setActiveDivision] = useState<string>('CEO Office');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get division and menu from query parameters
    const divParam = searchParams.get('div') || 'ceo';
    const menuParam = searchParams.get('menu') || 'tasks';

    // Update division name
    setActiveDivision(divisionNames[divParam] || 'CEO Office');

    // Update menu
    setActiveMenu(menuMap[menuParam] || 'tasks');
  }, [searchParams]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <DivisionalContent activeMenu={activeMenu} division={activeDivision} />
    </div>
  );
}
