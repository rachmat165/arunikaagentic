'use client';

import { useState } from 'react';
import {
  CheckCircle, Clock, Database, Shield, Server, Code2,
  Layers, BarChart3, ChevronDown, ChevronUp, AlertCircle,
  Zap, GitBranch, Lock, Activity
} from 'lucide-react';

// ============================================================
// APPROVAL WORKFLOW COMPLETE SYSTEM - 7 FASE IMPLEMENTATION
// PT. Arunika Teknologi Global | Direktur Utama: Adang A.Kunandar
// Target Go-Live: June 9, 2026 | contact: corsec@arunika2045.com
// ============================================================

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'pending';
  week: string;
  color: string;
  tasks: { label: string; done: boolean }[];
  details: React.ReactNode;
}

function PhaseCard({ phase, isOpen, onToggle }: {
  phase: Phase;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const statusConfig = {
    completed: { bg: 'bg-green-50 border-green-300', badge: 'bg-green-500', label: '✅ Completed' },
    'in-progress': { bg: 'bg-blue-50 border-blue-300', badge: 'bg-blue-500', label: '🔄 In Progress' },
    pending: { bg: 'bg-gray-50 border-gray-200', badge: 'bg-gray-400', label: '⏳ Pending' },
  };
  const cfg = statusConfig[phase.status];
  const doneTasks = phase.tasks.filter(t => t.done).length;

  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${cfg.bg}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:opacity-90 transition"
      >
        {/* Phase Number */}
        <div className={`w-12 h-12 rounded-full ${phase.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {phase.id}
        </div>

        {/* Icon + Title */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{phase.icon}</span>
            <h3 className="font-bold text-gray-900 text-lg">{phase.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{phase.subtitle}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-col items-end gap-1">
          <span className={`px-3 py-1 rounded-full text-xs text-white font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-500">{phase.week}</span>
          <span className="text-xs text-gray-600">{doneTasks}/{phase.tasks.length} tasks</span>
        </div>

        {/* Toggle */}
        <div className="text-gray-500 ml-2">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-5 pb-2">
        <div className="w-full h-1.5 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full transition-all ${phase.color}`}
            style={{ width: `${(doneTasks / phase.tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Expandable Detail */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-200 mt-3 pt-4 space-y-4">
          {/* Task Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {phase.tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {task.done
                  ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  : <Clock size={15} className="text-gray-400 flex-shrink-0" />
                }
                <span className={task.done ? 'text-gray-700' : 'text-gray-500'}>{task.label}</span>
              </div>
            ))}
          </div>

          {/* Technical Details */}
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-gray-100">
            {phase.details}
          </div>
        </div>
      )}
    </div>
  );
}

export function ApprovalWorkflowDashboard() {
  const [openPhase, setOpenPhase] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'agents' | 'metrics'>('overview');

  const togglePhase = (id: number) => {
    setOpenPhase(prev => prev === id ? null : id);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 1: SYSTEM ARCHITECTURE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase1: Phase = {
    id: 1,
    title: 'System Architecture',
    subtitle: 'Multi-Agent Ecosystem Design & High-Level Overview',
    icon: <Layers size={20} />,
    status: 'completed',
    week: 'Week 1 (May 11)',
    color: 'bg-purple-600',
    tasks: [
      { label: 'Agent layer design (4 agents)', done: true },
      { label: 'Approval queue layer design', done: true },
      { label: 'CEO Dashboard layer design', done: true },
      { label: 'Routing & Execution layer', done: true },
      { label: 'AI Model integration plan', done: true },
      { label: 'Audit trail design', done: true },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800 mb-2">🏗️ Arsitektur 4-Layer:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '🏢 Operations Agent', desc: 'direktur.operasional@arunika2045.com — Proposals, documents, reports' },
            { label: '📱 Sales & Marketing Agent', desc: 'direktur.marketing@arunika2045.com — Content, social posts, campaigns' },
            { label: '💰 Finance Agent', desc: 'direktur.finance@arunika2045.com — Invoices, reconciliation, reports' },
            { label: '👔 CEO Agent', desc: 'corsec@arunika2045.com — APPROVAL AUTHORITY untuk semua tasks' },
          ].map((item, i) => (
            <div key={i} className="bg-purple-50 border border-purple-100 p-3 rounded-lg">
              <div className="font-semibold text-purple-800">{item.label}</div>
              <div className="text-purple-600 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs mt-3">
          <div className="text-yellow-400 mb-1">// Flow:</div>
          <div>Agent → Submit Task → approval_queue</div>
          <div>CEO Dashboard → APPROVE / REVISE / REJECT</div>
          <div>If APPROVE → Auto-route ke next agent</div>
          <div>If REVISE → Agent implements → Re-submit</div>
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 2: DATABASE SCHEMA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase2: Phase = {
    id: 2,
    title: 'Database Schema',
    subtitle: 'PostgreSQL Tables: approval_queue, api_key_registry, agent_execution_log',
    icon: <Database size={20} />,
    status: 'in-progress',
    week: 'Week 1 (May 11-14)',
    color: 'bg-blue-600',
    tasks: [
      { label: 'approval_queue table', done: true },
      { label: 'api_key_registry table', done: true },
      { label: 'agent_execution_log table', done: true },
      { label: 'Performance indexes (6 indexes)', done: true },
      { label: 'JSONB fields (revision_prompts, approval_history)', done: true },
      { label: 'Run migrations di PostgreSQL', done: false },
      { label: 'Seed initial api_key_registry', done: false },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800">📊 3 Core Tables:</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 px-3 py-2 text-left font-semibold">Table</th>
                <th className="border border-blue-200 px-3 py-2 text-left font-semibold">Key Fields</th>
                <th className="border border-blue-200 px-3 py-2 text-left font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { table: 'approval_queue', fields: 'task_id, status, output_data, revision_prompts, ceo_command', purpose: 'Track all tasks awaiting CEO approval' },
                { table: 'api_key_registry', fields: 'key_name, provider, encrypted_value, accessible_by', purpose: 'Secure API key storage per agent' },
                { table: 'agent_execution_log', fields: 'agent_name, model_used, tokens_used, cost_usd', purpose: 'Audit trail & cost monitoring' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="border border-blue-200 px-3 py-2 font-mono font-semibold text-blue-800">{row.table}</td>
                  <td className="border border-blue-200 px-3 py-2 text-gray-600">{row.fields}</td>
                  <td className="border border-blue-200 px-3 py-2 text-gray-700">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
          <div className="text-yellow-400">-- Status values di approval_queue:</div>
          <div className="text-white">status: 'pending' | 'approved' | 'rejected'</div>
          <div className="text-white">       | 'revision_requested' | 'revision_resubmitted'</div>
          <div className="text-yellow-400 mt-2">-- CEO Command field:</div>
          <div className="text-white">ceo_command: 'APPROVE' | 'REVISE' | 'REJECT' | 'HOLD'</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-700 text-xs">
          ⚠️ <strong>Pending:</strong> Jalankan <code>psql -U postgres -d arunika_agentic -f database-migrations.sql</code>
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 3: CEO APPROVAL DASHBOARD
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase3: Phase = {
    id: 3,
    title: 'CEO Approval Dashboard',
    subtitle: 'React Component dengan 4 Action Buttons: Approve, Revise, Reject, Approve+Command',
    icon: <Code2 size={20} />,
    status: 'in-progress',
    week: 'Week 2 (May 15-21)',
    color: 'bg-green-600',
    tasks: [
      { label: 'CEOApprovalDashboard component', done: true },
      { label: 'Pending tasks list panel', done: true },
      { label: 'Task detail & output preview', done: true },
      { label: '[✅ APPROVE & AUTO-ROUTE] button', done: true },
      { label: '[📝 REQUEST REVISION] form', done: true },
      { label: '[❌ REJECT & ARCHIVE] button', done: true },
      { label: '[🔗 APPROVE + SEND COMMAND] button', done: true },
      { label: 'Auto-refresh tiap 30 detik', done: true },
      { label: 'Mount ke /approval page', done: false },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800">🖥️ 4 CEO Action Options:</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { color: 'bg-green-100 border-green-300 text-green-800', icon: '✅', title: 'APPROVE', desc: 'Task approved, auto-route ke next agent yang sudah ditentukan' },
            { color: 'bg-orange-100 border-orange-300 text-orange-800', icon: '📝', title: 'REQUEST REVISION', desc: 'CEO kirim instruction spesifik, agent implement & re-submit' },
            { color: 'bg-red-100 border-red-300 text-red-800', icon: '❌', title: 'REJECT', desc: 'Task ditolak dan diarchive, agent tidak execute' },
            { color: 'bg-blue-100 border-blue-300 text-blue-800', icon: '🔗', title: 'APPROVE + COMMAND', desc: 'Approve task DAN kirim instruksi spesifik ke next agent' },
          ].map((item, i) => (
            <div key={i} className={`border-2 p-3 rounded-lg ${item.color}`}>
              <div className="font-bold">{item.icon} {item.title}</div>
              <div className="text-xs mt-1 opacity-80">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs text-gray-600">
          📁 File: <code className="font-mono bg-gray-100 px-1 rounded">app/approval/ceo-dashboard.tsx</code><br/>
          🌐 Route: <code className="font-mono bg-gray-100 px-1 rounded">http://localhost:3000/approval</code>
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 4: AGENT IMPLEMENTATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase4: Phase = {
    id: 4,
    title: 'Agent Implementation & AI Integration',
    subtitle: 'AgentExecutionService: Claude (Anthropic) + OpenAI (GPT-4o) + Gemini',
    icon: <Zap size={20} />,
    status: 'pending',
    week: 'Week 2 (May 18-21)',
    color: 'bg-indigo-600',
    tasks: [
      { label: 'AgentExecutionService class', done: false },
      { label: 'executeTask() — main task execution', done: false },
      { label: 'executeWithRevision() — CEO revision handler', done: false },
      { label: 'executeWithApprovedOutput() — next task chain', done: false },
      { label: 'executeWithClaude() — claude-sonnet-4-6', done: false },
      { label: 'executeWithOpenAI() — gpt-4o', done: false },
      { label: 'executeWithGemini() — gemini-2.0-flash', done: false },
      { label: 'ApprovalRoutingService integration', done: false },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800">🤖 Multi-Model AI Support:</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Claude', model: 'claude-sonnet-4-6', provider: 'Anthropic', color: 'bg-orange-50 border-orange-200 text-orange-800', env: 'CLAUDE_API_KEY' },
            { name: 'GPT-4o', model: 'gpt-4o', provider: 'OpenAI', color: 'bg-green-50 border-green-200 text-green-800', env: 'OPENAI_API_KEY' },
            { name: 'Gemini', model: 'gemini-2.0-flash', provider: 'Google', color: 'bg-blue-50 border-blue-200 text-blue-800', env: 'GEMINI_API_KEY' },
          ].map((m, i) => (
            <div key={i} className={`border p-3 rounded-lg ${m.color}`}>
              <div className="font-bold">{m.name}</div>
              <div className="text-xs font-mono mt-1">{m.model}</div>
              <div className="text-xs opacity-70 mt-1">{m.provider}</div>
              <div className="text-xs font-mono mt-1 bg-white bg-opacity-50 px-1 rounded">{m.env}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
          <div className="text-yellow-400">// 4 core flows:</div>
          <div>1. executeTask() → submit for approval</div>
          <div>2. executeWithRevision() → CEO instruction → re-submit</div>
          <div>3. executeWithApprovedOutput() → next task chain</div>
          <div>4. [model-specific] Claude/OpenAI/Gemini adapters</div>
        </div>
        <div className="text-xs text-gray-500">
          📁 File: <code className="font-mono bg-gray-100 px-1 rounded">services/agent-execution-service.ts</code>
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 5: API ENDPOINTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase5: Phase = {
    id: 5,
    title: 'API Endpoints',
    subtitle: '5 REST Endpoints untuk Approval Workflow Operations',
    icon: <Server size={20} />,
    status: 'pending',
    week: 'Week 2-3 (May 18-25)',
    color: 'bg-teal-600',
    tasks: [
      { label: 'GET /api/approvals/pending', done: false },
      { label: 'POST /api/approvals/approve', done: false },
      { label: 'POST /api/approvals/revise', done: false },
      { label: 'POST /api/approvals/reject', done: false },
      { label: 'POST /api/approvals/approve-with-command', done: false },
      { label: 'Error handling & validation', done: false },
      { label: 'Integration dengan workflowExecutor', done: false },
    ],
    details: (
      <div className="space-y-2 text-sm">
        <div className="font-semibold text-gray-800">🌐 5 API Endpoints:</div>
        <div className="space-y-2">
          {[
            { method: 'GET', path: '/api/approvals/pending', desc: 'Fetch semua task dengan status pending/revision_requested', color: 'bg-green-100 text-green-800' },
            { method: 'POST', path: '/api/approvals/approve', desc: 'CEO approve task, auto-route ke next agent', color: 'bg-blue-100 text-blue-800' },
            { method: 'POST', path: '/api/approvals/revise', desc: 'CEO request revision dengan instruction, notif source agent', color: 'bg-orange-100 text-orange-800' },
            { method: 'POST', path: '/api/approvals/reject', desc: 'CEO reject & archive task, notif source agent', color: 'bg-red-100 text-red-800' },
            { method: 'POST', path: '/api/approvals/approve-with-command', desc: 'Approve + kirim instruksi spesifik ke next agent', color: 'bg-purple-100 text-purple-800' },
          ].map((ep, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 p-2 rounded-lg">
              <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${ep.color} flex-shrink-0`}>{ep.method}</span>
              <div>
                <div className="font-mono text-xs font-semibold text-gray-800">{ep.path}</div>
                <div className="text-xs text-gray-500 mt-0.5">{ep.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 6: SECURITY & API KEY MANAGEMENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase6: Phase = {
    id: 6,
    title: 'Security & API Key Management',
    subtitle: 'Encrypted key storage, access control per agent, key rotation & audit',
    icon: <Shield size={20} />,
    status: 'pending',
    week: 'Week 3 (May 22-28)',
    color: 'bg-red-600',
    tasks: [
      { label: 'APIKeyService class', done: false },
      { label: 'AES-256-CBC encryption for keys', done: false },
      { label: 'storeKey() — encrypt & save to DB', done: false },
      { label: 'getKey() — agent access control check', done: false },
      { label: 'rotateKey() — key rotation mechanism', done: false },
      { label: 'deactivateKey() — disable compromised keys', done: false },
      { label: 'Environment setup (.env.local)', done: false },
      { label: 'API_KEY_ENCRYPTION_KEY configuration', done: false },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800">🔐 Security Architecture:</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🔒', title: 'Encrypted Storage', desc: 'AES-256-CBC encryption sebelum disimpan ke PostgreSQL' },
            { icon: '🎯', title: 'Access Control', desc: 'Setiap agent hanya bisa akses key yang sudah diizinkan' },
            { icon: '🔄', title: 'Key Rotation', desc: 'Rotate API keys kapanpun tanpa downtime' },
            { icon: '📋', title: 'Audit Trail', desc: 'Setiap akses key dicatat di agent_execution_log' },
          ].map((item, i) => (
            <div key={i} className="bg-red-50 border border-red-100 p-3 rounded-lg">
              <div className="font-semibold text-red-800">{item.icon} {item.title}</div>
              <div className="text-xs text-red-600 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
          <div className="text-yellow-400"># Required Environment Variables:</div>
          <div>CLAUDE_API_KEY=sk-ant-xxxxx</div>
          <div>OPENAI_API_KEY=sk-proj-xxxxx</div>
          <div>GEMINI_API_KEY=xxxxx</div>
          <div>API_KEY_ENCRYPTION_KEY=&lt;32-byte hex&gt;</div>
          <div>DATABASE_URL=postgresql://...</div>
        </div>
        <div className="text-xs text-gray-500">
          📁 File: <code className="font-mono bg-gray-100 px-1 rounded">services/api-key-service.ts</code>
        </div>
      </div>
    ),
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FASE 7: DEPLOYMENT & MONITORING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const fase7: Phase = {
    id: 7,
    title: 'Deployment & Monitoring',
    subtitle: 'Production deployment, audit trail, monitoring & June 9 Go-Live',
    icon: <Activity size={20} />,
    status: 'pending',
    week: 'Week 4 (June 2-9)',
    color: 'bg-gray-700',
    tasks: [
      { label: 'AgentExecutionLogger service', done: false },
      { label: 'generateExecutionReport() function', done: false },
      { label: 'Staging deployment & testing', done: false },
      { label: 'End-to-end testing (task → approval → routing)', done: false },
      { label: 'Load testing', done: false },
      { label: 'Security audit', done: false },
      { label: 'CEO UAT (User Acceptance Testing)', done: false },
      { label: '🚀 Production deployment — June 9, 2026', done: false },
    ],
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-semibold text-gray-800">📅 Deployment Timeline:</div>
        <div className="space-y-2">
          {[
            { week: 'Week 1', date: 'May 11-14', task: 'PostgreSQL schema & API endpoint setup', status: 'in-progress' },
            { week: 'Week 2', date: 'May 15-21', task: 'CEO Dashboard component & agent services', status: 'pending' },
            { week: 'Week 3', date: 'May 22-28', task: 'Integration, E2E testing & security audit', status: 'pending' },
            { week: 'Week 4', date: 'June 2-8', task: 'UAT dengan CEO & production deployment prep', status: 'pending' },
            { week: 'GO-LIVE', date: 'June 9, 2026', task: '🚀 Live dengan Cowork Hybrid System', status: 'go-live' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${item.status === 'go-live' ? 'bg-green-100 border-2 border-green-400' : item.status === 'in-progress' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'go-live' ? 'bg-green-500 text-white' : item.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}>{item.week}</div>
              <div>
                <div className="text-xs text-gray-500">{item.date}</div>
                <div className="font-medium text-gray-800 text-xs">{item.task}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
          <div className="text-yellow-400">// Monitoring metrics:</div>
          <div>- Agent execution success rate</div>
          <div>- Average approval wait time</div>
          <div>- Revision count per task</div>
          <div>- API token usage & cost (USD)</div>
          <div>- CEO dashboard response time</div>
        </div>
      </div>
    ),
  };

  const phases = [fase1, fase2, fase3, fase4, fase5, fase6, fase7];
  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const inProgressPhases = phases.filter(p => p.status === 'in-progress').length;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AGENTS OVERVIEW (for Agents Tab)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const agents = [
    { name: 'CEO Agent', email: 'corsec@arunika2045.com', role: 'Approval Authority', model: 'claude-sonnet-4-6', color: 'bg-yellow-50 border-yellow-300', icon: '👔' },
    { name: 'Operations Agent', email: 'direktur.operasional@arunika2045.com', role: 'Proposals, Documents, Reports', model: 'claude-sonnet-4-6', color: 'bg-blue-50 border-blue-300', icon: '🏢' },
    { name: 'Sales & Marketing Agent', email: 'direktur.marketing@arunika2045.com', role: 'Content, Social Posts, Campaigns', model: 'gpt-4o', color: 'bg-green-50 border-green-300', icon: '📱' },
    { name: 'Finance Agent', email: 'direktur.finance@arunika2045.com', role: 'Invoices, Reconciliation, Reports', model: 'gemini-2.0-flash', color: 'bg-purple-50 border-purple-300', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <GitBranch size={28} />
              Approval Workflow System
            </h2>
            <p className="text-indigo-200 mt-1 text-sm">
              Multi-Agent Task Approval & CEO Command Dashboard — PT. Arunika Teknologi Global
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">June 9</div>
            <div className="text-indigo-200 text-sm">Target Go-Live</div>
            <div className="text-xs text-indigo-300 mt-1">corsec@arunika2045.com</div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-4 gap-4 mt-5">
          {[
            { label: 'Total Phases', value: '7', color: 'text-white' },
            { label: 'Completed', value: completedPhases.toString(), color: 'text-green-400' },
            { label: 'In Progress', value: inProgressPhases.toString(), color: 'text-yellow-400' },
            { label: 'Pending', value: (7 - completedPhases - inProgressPhases).toString(), color: 'text-gray-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-indigo-200 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Overall Implementation Progress</span>
            <span>{Math.round(((completedPhases + inProgressPhases * 0.5) / 7) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-white bg-opacity-20 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all"
              style={{ width: `${((completedPhases + inProgressPhases * 0.5) / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {[
          { id: 'overview', label: '📋 Overview' },
          { id: 'phases', label: '🚀 7 Phases' },
          { id: 'agents', label: '🤖 Agents' },
          { id: 'metrics', label: '📊 Metrics' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 font-medium text-sm rounded-t-lg transition border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Approval Flow */}
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4">🔄 Approval Flow</h3>
              <div className="space-y-3">
                {[
                  { step: '1', label: 'Agent executes daily task', desc: 'Operations/Sales/Finance agent generates output (proposal, content, report)', color: 'bg-blue-500' },
                  { step: '2', label: 'Submit to approval_queue', desc: 'Output tersimpan di PostgreSQL dengan status "pending"', color: 'bg-purple-500' },
                  { step: '3', label: 'CEO gets notified', desc: 'Dashboard shows pending task, CEO reviews output_data', color: 'bg-yellow-500' },
                  { step: '4', label: 'CEO makes decision', desc: 'APPROVE → next agent | REVISE → back to source | REJECT → archived', color: 'bg-orange-500' },
                  { step: '5', label: 'Execution continues', desc: 'Next agent receives approved output + CEO instruction, executes next task', color: 'bg-green-500' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full ${step.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{step.step}</div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{step.label}</div>
                      <div className="text-gray-500 text-xs">{step.desc}</div>
                    </div>
                    {i < 4 && <div className="absolute ml-3 mt-7 w-0.5 h-4 bg-gray-300" style={{ position: 'relative', left: '-3px', marginLeft: '10px' }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Status Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">📦 System Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Architecture Design', status: '✅ Done', color: 'text-green-600' },
                    { label: 'Database Schema', status: '🔄 In Progress', color: 'text-blue-600' },
                    { label: 'CEO Dashboard', status: '🔄 In Progress', color: 'text-blue-600' },
                    { label: 'Agent Services', status: '⏳ Pending', color: 'text-gray-500' },
                    { label: 'API Endpoints', status: '⏳ Pending', color: 'text-gray-500' },
                    { label: 'Security Layer', status: '⏳ Pending', color: 'text-gray-500' },
                    { label: 'Production Deploy', status: '📅 June 9', color: 'text-indigo-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <div className="font-bold text-indigo-800 mb-2">ℹ️ Version Info</div>
                <div className="text-xs space-y-1 text-indigo-700">
                  <div>Version: 1.0 — May 11, 2026</div>
                  <div>Target: June 9, 2026</div>
                  <div>Status: Ready for Implementation</div>
                  <div>Contact: corsec@arunika2045.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: 7 PHASES ── */}
      {activeTab === 'phases' && (
        <div className="space-y-3">
          {phases.map(phase => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isOpen={openPhase === phase.id}
              onToggle={() => togglePhase(phase.id)}
            />
          ))}
        </div>
      )}

      {/* ── TAB: AGENTS ── */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, i) => (
              <div key={i} className={`border-2 rounded-xl p-5 ${agent.color}`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{agent.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{agent.name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{agent.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{agent.role}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full font-mono">{agent.model}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revision Flow Explanation */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">🔄 Revision Flow (max 3x)</h3>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {['Agent Submit', '→', 'CEO Review', '→', 'Request Revision', '→', 'Agent Revises', '→', 'Re-Submit', '→', 'CEO Re-Review', '→', 'APPROVE/REJECT'].map((step, i) => (
                <span key={i} className={step === '→' ? 'text-gray-400' : 'bg-gray-100 px-3 py-1.5 rounded-lg font-medium text-gray-700'}>{step}</span>
              ))}
            </div>
            <div className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-200 p-3 rounded-lg">
              ⚠️ Jika revision_count ≥ max_revisions (3), hanya opsi APPROVE atau REJECT yang tersedia — tidak bisa request revision lagi.
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: METRICS ── */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Approval Time', value: 'N/A', sub: 'target: < 2 jam', icon: <Clock size={20} />, color: 'text-blue-600' },
              { label: 'Revision Rate', value: 'N/A', sub: 'target: < 20%', icon: <AlertCircle size={20} />, color: 'text-orange-600' },
              { label: 'Tasks Approved', value: '0', sub: 'belum live', icon: <CheckCircle size={20} />, color: 'text-green-600' },
              { label: 'Cost/Month (est.)', value: '$--', sub: 'Claude + GPT + Gemini', icon: <BarChart3 size={20} />, color: 'text-purple-600' },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className={`flex justify-center mb-2 ${m.color}`}>{m.icon}</div>
                <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-sm text-gray-700 font-medium mt-1">{m.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* API Key Registry */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">🔑 API Key Registry (Planned)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Key Name</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Provider</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Model</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Accessible By</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'CLAUDE_API_KEY', provider: 'Anthropic', model: 'claude-sonnet-4-6', agents: 'Operations, Sales, Finance', status: '⏳ Not configured' },
                    { key: 'OPENAI_API_KEY', provider: 'OpenAI', model: 'gpt-4o', agents: 'Sales & Marketing', status: '⏳ Not configured' },
                    { key: 'GEMINI_API_KEY', provider: 'Google', model: 'gemini-2.0-flash', agents: 'Operations', status: '⏳ Not configured' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs font-bold text-gray-800">{row.key}</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">{row.provider}</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono text-xs">{row.model}</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-600 text-xs">{row.agents}</td>
                      <td className="border border-gray-200 px-4 py-2 text-orange-600 text-xs">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
