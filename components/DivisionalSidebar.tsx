'use client'

import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Mail,
  Menu,
  Settings,
  LogOut,
  ChevronDown,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
}

interface SubmenuItemProps {
  label: string;
  badge?: number;
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  badge,
  onClick,
  isActive = false,
  hasSubmenu = false,
  isExpanded = false,
}) => (
  <div
    onClick={onClick}
    className={`
      px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200
      flex items-center gap-3 text-sm
      ${isActive
        ? 'bg-indigo-500/30 border-l-3 border-indigo-500 font-semibold text-white'
        : 'text-white/90 hover:bg-white/10'
      }
      ${hasSubmenu ? 'justify-between' : ''}
    `}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="flex items-center gap-2 ml-auto">
      {badge && (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
      {hasSubmenu && (
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      )}
    </div>
  </div>
);

const SubmenuItem: React.FC<SubmenuItemProps> = ({
  label,
  badge,
  icon,
  onClick,
  isActive = false,
}) => (
  <div
    onClick={onClick}
    className={`
      px-6 py-2 mx-2 rounded-md cursor-pointer transition-all duration-200
      flex items-center gap-2 text-sm
      ${isActive
        ? 'bg-indigo-500/20 text-white font-medium'
        : 'text-white/80 hover:bg-white/5'
      }
    `}
  >
    <span className="text-sm">{icon}</span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="bg-amber-500/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
        {badge}
      </span>
    )}
  </div>
);

interface DivisionalSidebarProps {
  onMenuSelect?: (menu: string) => void;
}

export const DivisionalSidebar: React.FC<DivisionalSidebarProps> = ({
  onMenuSelect,
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('ceo-office');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>('approval-center');

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const handleSubmenuClick = (submenuName: string) => {
    setActiveSubmenu(submenuName);
    onMenuSelect?.(submenuName);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white overflow-y-auto flex flex-col h-screen">
      {/* HEADER */}
      <div className="px-5 pt-6 pb-6 border-b border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-lg font-bold">
            🚀
          </div>
          <div>
            <h3 className="font-semibold text-base">Arunika</h3>
            <p className="text-xs text-white/60">Agentic AI</p>
          </div>
        </div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search agents, tasks..."
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-xs focus:outline-none focus:border-white/40"
        />
      </div>

      {/* MAIN MENU */}
      <div className="px-2 py-4 border-b border-white/10">
        <MenuItem icon={<BarChart3 size={18} />} label="Executive Summary" />
        <MenuItem icon={<FileText size={18} />} label="To-Do Lists" badge={7} />
        <MenuItem icon={<span>💰</span>} label="Costs & Budget" />
        <MenuItem icon={<span>📈</span>} label="Analytics" />
        <MenuItem icon={<span>🤖</span>} label="AI Agents" badge={24} />
      </div>

      {/* DIVISIONAL MANAGEMENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-4">
          <h4 className="px-4 text-xs font-bold uppercase text-white/40 tracking-wider mb-3">
            Divisional Management
          </h4>

          {/* CEO OFFICE */}
          <MenuItem
            icon={<span>👔</span>}
            label="CEO Office"
            badge={8}
            hasSubmenu
            isExpanded={expandedMenu === 'ceo-office'}
            onClick={() => toggleMenu('ceo-office')}
          />
          {expandedMenu === 'ceo-office' && (
            <div className="mt-2 mb-2 space-y-1">
              <SubmenuItem
                icon="📝"
                label="CEO Tasks"
                badge={5}
                onClick={() => handleSubmenuClick('ceo-tasks')}
                isActive={activeSubmenu === 'ceo-tasks'}
              />
              <SubmenuItem
                icon="📧"
                label="CEO Mailbox"
                badge={3}
                onClick={() => handleSubmenuClick('ceo-mailbox')}
                isActive={activeSubmenu === 'ceo-mailbox'}
              />
              <SubmenuItem
                icon="📋"
                label="Division Reports"
                onClick={() => handleSubmenuClick('ceo-reports')}
                isActive={activeSubmenu === 'ceo-reports'}
              />
              <SubmenuItem
                icon="✅"
                label="Approval Center"
                badge={5}
                onClick={() => handleSubmenuClick('approval-center')}
                isActive={activeSubmenu === 'approval-center'}
              />
            </div>
          )}

          {/* SALES & MARKETING */}
          <MenuItem
            icon={<span>💼</span>}
            label="Sales & Marketing Div"
            badge={12}
            hasSubmenu
            isExpanded={expandedMenu === 'sales-mkt'}
            onClick={() => toggleMenu('sales-mkt')}
          />
          {expandedMenu === 'sales-mkt' && (
            <div className="mt-2 mb-2 space-y-1">
              <SubmenuItem
                icon="📝"
                label="Team Tasks"
                badge={7}
                onClick={() => handleSubmenuClick('sales-tasks')}
                isActive={activeSubmenu === 'sales-tasks'}
              />
              <SubmenuItem
                icon="📧"
                label="Division Mailbox"
                badge={2}
                onClick={() => handleSubmenuClick('sales-mailbox')}
                isActive={activeSubmenu === 'sales-mailbox'}
              />
              <SubmenuItem
                icon="📊"
                label="Division Reports"
                onClick={() => handleSubmenuClick('sales-reports')}
                isActive={activeSubmenu === 'sales-reports'}
              />
              <SubmenuItem
                icon="✅"
                label="Task Management"
                badge={3}
                onClick={() => handleSubmenuClick('sales-approval')}
                isActive={activeSubmenu === 'sales-approval'}
              />
            </div>
          )}

          {/* OPERATIONS & FINANCE */}
          <MenuItem
            icon={<span>🏢</span>}
            label="Operations & Finance Div"
            badge={9}
            hasSubmenu
            isExpanded={expandedMenu === 'ops-finance'}
            onClick={() => toggleMenu('ops-finance')}
          />
          {expandedMenu === 'ops-finance' && (
            <div className="mt-2 mb-2 space-y-1">
              <SubmenuItem
                icon="📝"
                label="Operational Tasks"
                badge={6}
                onClick={() => handleSubmenuClick('ops-tasks')}
                isActive={activeSubmenu === 'ops-tasks'}
              />
              <SubmenuItem
                icon="📧"
                label="Division Mailbox"
                badge={1}
                onClick={() => handleSubmenuClick('ops-mailbox')}
                isActive={activeSubmenu === 'ops-mailbox'}
              />
              <SubmenuItem
                icon="📊"
                label="Financial Reports"
                onClick={() => handleSubmenuClick('ops-reports')}
                isActive={activeSubmenu === 'ops-reports'}
              />
              <SubmenuItem
                icon="✅"
                label="Approval & Sign-off"
                badge={2}
                onClick={() => handleSubmenuClick('ops-approval')}
                isActive={activeSubmenu === 'ops-approval'}
              />
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-2 py-4 border-t border-white/10 mt-auto">
        <h4 className="px-4 text-xs font-bold uppercase text-white/40 tracking-wider mb-3">
          Administration
        </h4>
        <MenuItem icon={<Settings size={18} />} label="Settings" />
        <MenuItem icon={<LogOut size={18} />} label="Logout" />
      </div>
    </div>
  );
};

export default DivisionalSidebar;
