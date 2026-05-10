import React, { useState } from 'react';
import { DivisionalSidebar } from './DivisionalSidebar';
import { DivisionalContent } from './DivisionalContent';

/**
 * DivisionalManagement Component
 *
 * Main container component that manages the divisional management system
 * with multi-division menu, tasks, mailbox, reports, and approval workflows
 *
 * Features:
 * - CEO Office with approval center
 * - Sales & Marketing Division with task management
 * - Operations & Finance Division with financial reports
 * - Inter-division communication via mailbox
 * - Real-time task and approval tracking
 */

interface Division {
  id: string;
  name: string;
  icon: string;
  activeMenu: string | null;
}

const DivisionalManagement: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>('approval-center');
  const [activeDivision, setActiveDivision] = useState<string>('CEO Office');

  const divisions: Division[] = [
    { id: 'ceo', name: 'CEO Office', icon: '👔', activeMenu: activeMenu },
    { id: 'sales', name: 'Sales & Marketing Division', icon: '💼', activeMenu: activeMenu },
    { id: 'ops', name: 'Operations & Finance Division', icon: '🏢', activeMenu: activeMenu },
  ];

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);

    // Determine which division based on menu prefix
    if (menu.startsWith('approval-center') || menu.startsWith('ceo-')) {
      setActiveDivision('CEO Office');
    } else if (menu.startsWith('sales-')) {
      setActiveDivision('Sales & Marketing Division');
    } else if (menu.startsWith('ops-')) {
      setActiveDivision('Operations & Finance Division');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <DivisionalSidebar onMenuSelect={handleMenuSelect} />

      {/* MAIN CONTENT */}
      <DivisionalContent activeMenu={activeMenu} division={activeDivision} />
    </div>
  );
};

export default DivisionalManagement;
