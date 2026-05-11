'use client';
// CEO Approval Dashboard Component
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 3: CEO Approval Dashboard

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Edit2, AlertCircle, Send, RefreshCw, Clock, User } from 'lucide-react';

interface ApprovalTask {
  id: string;
  task_id: string;
  task_type: string;
  source_agentic: string;
  source_email: string;
  task_title: string;
  output_data: any;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested' | 'revision_resubmitted';
  revision_count: number;
  max_revisions: number;
  next_task_id?: string;
  next_agentic?: string;
  hours_waiting?: number;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  revision_requested: 'bg-orange-100 text-orange-800',
  revision_resubmitted: 'bg-blue-100 text-blue-800',
};

const AGENT_COLORS: Record<string, string> = {
  'operations-agentic': 'bg-blue-100 text-blue-700',
  'sales-marketing-agentic': 'bg-green-100 text-green-700',
  'finance-agentic': 'bg-purple-100 text-purple-700',
};

export function CEOApprovalDashboard() {
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null);
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [nextAgentCommand, setNextAgentCommand] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPendingApprovals = useCallback(async () => {
    try {
      const response = await fetch('/api/approvals/pending');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingApprovals();
    const interval = setInterval(fetchPendingApprovals, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingApprovals]);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const resetForm = () => {
    setRevisionPrompt('');
    setNextAgentCommand('');
    setDecisionReason('');
    setSelectedTask(null);
  };

  // ── ACTION 1: APPROVE ──
  const handleApprove = async () => {
    if (!selectedTask) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/approvals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTask.task_id,
          approved_by: 'ceo-agentic',
          decision_reason: decisionReason || 'Approved by CEO',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', `✅ Approved! ${data.next_agentic ? `Routed to ${data.next_agentic}` : 'No next agent'}`);
        await fetchPendingApprovals();
        resetForm();
      } else {
        showFeedback('error', `❌ ${data.error}`);
      }
    } catch {
      showFeedback('error', '❌ Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── ACTION 2: REQUEST REVISION ──
  const handleRequestRevision = async () => {
    if (!selectedTask || !revisionPrompt.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/approvals/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTask.task_id,
          revision_instruction: revisionPrompt,
          requested_by: 'ceo-agentic',
          decision_reason: decisionReason || 'Revision requested',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', `📝 Revision #${data.revision_number} sent to ${data.agentic_notified}`);
        await fetchPendingApprovals();
        resetForm();
      } else {
        showFeedback('error', `❌ ${data.error}`);
      }
    } catch {
      showFeedback('error', '❌ Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── ACTION 3: REJECT ──
  const handleReject = async () => {
    if (!selectedTask || !decisionReason.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/approvals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTask.task_id,
          rejected_by: 'ceo-agentic',
          decision_reason: decisionReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', '🗑️ Task rejected and archived');
        await fetchPendingApprovals();
        resetForm();
      } else {
        showFeedback('error', `❌ ${data.error}`);
      }
    } catch {
      showFeedback('error', '❌ Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── ACTION 4: APPROVE + COMMAND ──
  const handleApproveWithCommand = async () => {
    if (!selectedTask || !nextAgentCommand.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/approvals/approve-with-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: selectedTask.task_id,
          approved_by: 'ceo-agentic',
          next_task_instruction: nextAgentCommand,
          decision_reason: decisionReason || 'Approved with instruction',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('success', `✅ Approved + instruction sent to ${data.next_agentic || 'next agent'}`);
        await fetchPendingApprovals();
        resetForm();
      } else {
        showFeedback('error', `❌ ${data.error}`);
      }
    } catch {
      showFeedback('error', '❌ Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-5 h-[calc(100vh-140px)]">

      {/* ── LEFT: TASK LIST ── */}
      <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-800">Pending Approvals</h2>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={fetchPendingApprovals}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-500 text-sm">All tasks reviewed!</p>
            </div>
          ) : tasks.map(task => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`w-full text-left p-3 rounded-xl border-2 transition ${
                selectedTask?.id === task.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm text-gray-900 truncate">{task.task_title}</div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${AGENT_COLORS[task.source_agentic] || 'bg-gray-100 text-gray-600'}`}>
                  {task.source_agentic.replace('-agentic', '')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[task.status] || 'bg-gray-100 text-gray-600'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                <Clock size={11} />
                <span>{task.hours_waiting ? `${task.hours_waiting.toFixed(1)}h ago` : new Date(task.created_at).toLocaleTimeString('id-ID')}</span>
                {task.revision_count > 0 && (
                  <span className="ml-auto text-orange-600 font-semibold">
                    Rev {task.revision_count}/{task.max_revisions}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: DETAIL & ACTIONS ── */}
      <div className="col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedTask ? (
          <>
            {/* Task Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTask.task_title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      {selectedTask.source_agentic}
                    </span>
                    <span>·</span>
                    <span>{selectedTask.task_type}</span>
                    {selectedTask.next_agentic && (
                      <>
                        <span>·</span>
                        <span className="text-indigo-600">→ {selectedTask.next_agentic}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[selectedTask.status] || 'bg-gray-100 text-gray-600'}`}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Feedback */}
              {feedbackMessage && (
                <div className={`p-3 rounded-xl text-sm font-medium ${feedbackMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {feedbackMessage.text}
                </div>
              )}

              {/* Output Preview */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Task Output Preview</div>
                <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(selectedTask.output_data, null, 2).substring(0, 1200)}
                    {JSON.stringify(selectedTask.output_data, null, 2).length > 1200 && '\n... (truncated)'}
                  </pre>
                </div>
              </div>

              {/* Decision Reason (shared field) */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Notes / Reason (optional for approve, required for reject)
                </label>
                <textarea
                  value={decisionReason}
                  onChange={e => setDecisionReason(e.target.value)}
                  placeholder="Add notes for this decision..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
                  rows={2}
                />
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* APPROVE */}
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
                >
                  <Check size={17} />
                  Approve & Auto-Route
                </button>

                {/* REJECT */}
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !decisionReason.trim()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition"
                >
                  <X size={17} />
                  Reject & Archive
                </button>
              </div>

              {/* REQUEST REVISION */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-3">
                <div className="text-sm font-bold text-orange-800">
                  📝 Request Revision from {selectedTask.source_agentic.replace('-agentic', '').toUpperCase()} Agent
                </div>
                <textarea
                  value={revisionPrompt}
                  onChange={e => setRevisionPrompt(e.target.value)}
                  placeholder={`Contoh: "Ubah judul proposal agar lebih fokus pada ROI. Ganti warna ke biru #003D7A. Maksimal 200 kata."`}
                  className="w-full p-3 border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 resize-none"
                  rows={3}
                  disabled={selectedTask.revision_count >= selectedTask.max_revisions}
                />
                {selectedTask.revision_count >= selectedTask.max_revisions ? (
                  <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    Max revisions ({selectedTask.max_revisions}) reached. Only APPROVE or REJECT available.
                  </div>
                ) : (
                  <button
                    onClick={handleRequestRevision}
                    disabled={isProcessing || !revisionPrompt.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 transition"
                  >
                    <Edit2 size={15} />
                    Send Revision Instruction
                  </button>
                )}
              </div>

              {/* APPROVE + NEXT AGENT COMMAND */}
              {selectedTask.next_agentic && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                  <div className="text-sm font-bold text-indigo-800">
                    🔗 Approve + Send Command to {selectedTask.next_agentic.replace('-agentic', '').toUpperCase()} Agent
                  </div>
                  <textarea
                    value={nextAgentCommand}
                    onChange={e => setNextAgentCommand(e.target.value)}
                    placeholder={`Contoh: "Kirim proposal ini ke PT. ABC Corp. Tambahkan follow-up reminder 5 hari. Minta mereka jadwalkan demo call."`}
                    className="w-full p-3 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleApproveWithCommand}
                    disabled={isProcessing || !nextAgentCommand.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 transition"
                  >
                    <Send size={15} />
                    Approve & Send Command
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="text-5xl">👈</div>
            <p className="font-medium">Select a task to review & approve</p>
            <p className="text-sm">{tasks.length} task{tasks.length !== 1 ? 's' : ''} awaiting review</p>
          </div>
        )}
      </div>
    </div>
  );
}
