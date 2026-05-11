// app/approval/page.tsx
// CEO Approval Dashboard Page
// PT. Arunika Teknologi Global | corsec@arunika2045.com

import { CEOApprovalDashboard } from './ceo-dashboard';

export const metadata = {
  title: 'CEO Approval Dashboard — Arunika Agentic AI',
  description: 'Multi-Agent Task Approval & Routing Dashboard for PT. Arunika Teknologi Global',
};

export default function ApprovalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">👔</span>
            <h1 className="text-2xl font-bold text-gray-900">CEO Approval Dashboard</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">
            PT. Arunika Teknologi Global — Review & approve agent task submissions
          </p>
        </div>

        {/* Dashboard */}
        <CEOApprovalDashboard />
      </div>
    </main>
  );
}
