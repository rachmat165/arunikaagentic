'use client'

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Download,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
  Plus,
  Loader,
} from 'lucide-react';
import { ProspectingView } from './ProspectingView';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'pending-approval' | 'completed' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  assignedDate: string;
  dueDate: string;
  assignee: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  isUnread: boolean;
  preview: string;
}

interface Report {
  id: string;
  title: string;
  generatedDate: string;
  status: 'complete' | 'processing' | 'pending';
}

interface Approval {
  id: string;
  title: string;
  fromDivision: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  amount?: string;
  priority: 'high' | 'medium' | 'low';
}

const TasksView: React.FC<{ division: string; loading?: boolean }> = ({ division, loading = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/divisions/${encodeURIComponent(division)}/tasks?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    if (division) {
      fetchTasks();
    }
  }, [division]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-700 font-medium">Error loading tasks</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    'pending-approval': 'bg-amber-100 text-amber-800',
    'completed': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
  };

  const priorityColor: Record<string, string> = {
    'high': 'text-red-600',
    'medium': 'text-amber-600',
    'low': 'text-green-600',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{division} - Tasks</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No tasks available for this division.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[task.status]}`}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm mb-4 py-3 border-t border-gray-100">
                <div>
                  <span className="text-gray-600">Priority</span>
                  <p className={`font-semibold ${priorityColor[task.priority]}`}>
                    {task.priority.toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Assigned</span>
                  <p className="font-semibold text-gray-900">{task.assignedDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Due Date</span>
                  <p className="font-semibold text-gray-900">{task.dueDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Assignee</span>
                  <p className="font-semibold text-gray-900">{task.assignee}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MailboxView: React.FC<{ division: string; loading?: boolean }> = ({ division, loading = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/divisions/${encodeURIComponent(division)}/messages?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data.data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    if (division) {
      fetchMessages();
    }
  }, [division]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-700 font-medium">Error loading messages</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{division} - Mailbox</h2>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
            <option>All Messages</option>
            <option>From CEO</option>
            <option>From Divisions</option>
            <option>System Notifications</option>
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
            Unread: 0
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No messages available for this division.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                msg.isUnread
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${msg.isUnread ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {msg.from}
                      </h4>
                      {msg.isUnread && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <h3 className={`text-sm ${msg.isUnread ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
                      {msg.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{msg.preview}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-4">{msg.date}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                  View
                </button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Reply
                </button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Mark as Read
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReportsView: React.FC<{ division: string; loading?: boolean }> = ({ division, loading = false }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is Sales & Marketing division
  const isSalesMarketing = division?.toLowerCase().includes('sales');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/divisions/${encodeURIComponent(division)}/reports?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    if (division) {
      fetchReports();
    }
  }, [division]);

  // For Sales & Marketing division, show prospecting data
  if (isSalesMarketing) {
    return <ProspectingView division={division} loading={loading} />;
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-700 font-medium">Error loading reports</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const statusIcon: Record<string, React.ReactNode> = {
    'complete': <CheckCircle2 size={18} className="text-green-600" />,
    'processing': <Clock size={18} className="text-amber-600" />,
    'pending': <AlertCircle size={18} className="text-gray-400" />,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{division} - Reports</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          Generate Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reports available for this division.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {statusIcon[report.status]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Generated: {report.generatedDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">
                    <Download size={18} />
                  </button>
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 text-sm font-medium">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ApprovalCenterView: React.FC<{ division: string; loading?: boolean }> = ({ division, loading = false }) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null);
  const [noteInputId, setNoteInputId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/divisions/${encodeURIComponent(division)}/approvals?limit=50`);
      if (!response.ok) throw new Error('Gagal memuat data approval');
      const data = await response.json();
      setApprovals(data.data || []);
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (division) fetchApprovals();
  }, [division]);

  const handleAction = async (approvalId: string, action: 'approve' | 'reject' | 'revision') => {
    setActionLoading(approvalId + action);
    try {
      const res = await fetch(
        `/api/divisions/${encodeURIComponent(division)}/approvals/${approvalId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            notes: noteText || undefined,
            approved_by: 'CEO - Adang A. Kunandar',
          }),
        }
      );
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal memproses aksi');
      }
      // Update local state optimistically
      const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';
      setApprovals(prev =>
        prev.map(a => a.id === approvalId ? { ...a, status: newStatus as any } : a)
      );
      setActionMessage({
        id: approvalId,
        text: action === 'approve' ? '✅ Berhasil Disetujui' : action === 'reject' ? '❌ Berhasil Ditolak' : '📝 Diminta Revisi',
        type: 'success',
      });
      setNoteInputId(null);
      setNoteText('');
    } catch (err) {
      setActionMessage({
        id: approvalId,
        text: err instanceof Error ? err.message : 'Gagal memproses',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
          <p className="text-red-700 font-medium">Error memuat data approval</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchApprovals}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const priorityColor: Record<string, string> = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-amber-100 text-amber-800',
    'low': 'bg-green-100 text-green-800',
    'urgent': 'bg-red-200 text-red-900',
    'normal': 'bg-gray-100 text-gray-700',
  };

  const statusColor: Record<string, string> = {
    'pending': 'bg-amber-100 text-amber-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'revision-needed': 'bg-blue-100 text-blue-800',
    'revoked': 'bg-gray-100 text-gray-600',
  };

  const requestTypeLabel: Record<string, string> = {
    budget: '💰 Anggaran',
    contract: '📄 Kontrak',
    procurement: '🛒 Pengadaan',
    report: '📊 Laporan',
    hiring: '👥 Rekrutmen',
    policy: '📋 Kebijakan',
    partnership: '🤝 Kerjasama',
    other: '📌 Lainnya',
  };

  const formatRupiah = (amount: number | null) => {
    if (!amount) return null;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredApprovals = filterStatus === 'all'
    ? approvals
    : approvals.filter(a => a.status === filterStatus);

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approval Center</h2>
          <p className="text-sm text-gray-500 mt-1">{division} — {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={fetchApprovals}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div
          onClick={() => setFilterStatus('all')}
          className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'all' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}
        >
          <p className="text-gray-500 text-xs font-medium uppercase">Total</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{approvals.length}</p>
        </div>
        <div
          onClick={() => setFilterStatus('pending')}
          className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'pending' ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200'}`}
        >
          <p className="text-amber-600 text-xs font-medium uppercase">Menunggu</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          {pendingCount > 0 && <p className="text-xs text-amber-500 mt-1">Perlu tindakan</p>}
        </div>
        <div
          onClick={() => setFilterStatus('approved')}
          className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'approved' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}
        >
          <p className="text-green-600 text-xs font-medium uppercase">Disetujui</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</p>
        </div>
        <div
          onClick={() => setFilterStatus('rejected')}
          className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'rejected' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'}`}
        >
          <p className="text-red-600 text-xs font-medium uppercase">Ditolak</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{rejectedCount}</p>
        </div>
      </div>

      {/* Approval Cards */}
      {filteredApprovals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-lg">Tidak ada permohonan approval</p>
          <p className="text-gray-400 text-sm mt-1">
            {filterStatus === 'pending' ? 'Semua permohonan sudah ditindaklanjuti.' : 'Belum ada data untuk filter ini.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval) => {
            const isPending = approval.status === 'pending';
            const isActing = actionLoading?.startsWith(approval.id);
            const msg = actionMessage?.id === approval.id ? actionMessage : null;
            const rawData = approval as any;
            const fromName = rawData.from_division_name || approval.fromDivision || 'Divisi';
            const submittedDate = rawData.created_at
              ? new Date(rawData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : (approval.submittedDate || '-');
            const amountDisplay = rawData.amount ? formatRupiah(parseFloat(rawData.amount)) : null;
            const reqType = rawData.request_type || '';

            return (
              <div
                key={approval.id}
                className={`bg-white rounded-xl border-l-4 shadow-sm transition-all ${
                  isPending
                    ? 'border-l-amber-500 border border-amber-100'
                    : approval.status === 'approved'
                    ? 'border-l-green-500 border border-green-50'
                    : 'border-l-red-400 border border-red-50'
                }`}
              >
                <div className="p-5">
                  {/* Top badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityColor[approval.priority] || priorityColor['normal']}`}>
                      {approval.priority?.toUpperCase() || 'NORMAL'}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor[approval.status] || 'bg-gray-100 text-gray-700'}`}>
                      {approval.status === 'pending' ? '⏳ MENUNGGU APPROVAL' :
                       approval.status === 'approved' ? '✅ DISETUJUI' :
                       approval.status === 'rejected' ? '❌ DITOLAK' :
                       approval.status?.toUpperCase()}
                    </span>
                    {reqType && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {requestTypeLabel[reqType] || reqType}
                      </span>
                    )}
                  </div>

                  {/* Title & description */}
                  <h3 className="font-bold text-gray-900 text-base mb-1">{approval.title}</h3>
                  {rawData.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{rawData.description}</p>
                  )}

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500">Dari Divisi:</span>
                      <span className="ml-2 font-semibold text-gray-800">{fromName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Diajukan:</span>
                      <span className="ml-2 font-semibold text-gray-800">{submittedDate}</span>
                    </div>
                    {amountDisplay && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Nilai:</span>
                        <span className="ml-2 font-bold text-indigo-700 text-base">{amountDisplay}</span>
                      </div>
                    )}
                  </div>

                  {/* Feedback message */}
                  {msg && (
                    <div className={`mb-3 px-4 py-2 rounded-lg text-sm font-medium ${
                      msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Note input for revision/rejection */}
                  {noteInputId === approval.id && (
                    <div className="mb-3">
                      <textarea
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Tambahkan catatan/alasan (opsional)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-indigo-400"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Action buttons */}
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(approval.id, 'approve')}
                        disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === approval.id + 'approve'
                          ? <Loader size={16} className="animate-spin" />
                          : <ThumbsUp size={16} />
                        }
                        Setujui
                      </button>
                      <button
                        onClick={() => {
                          setNoteInputId(noteInputId === approval.id ? null : approval.id);
                          setNoteText('');
                        }}
                        disabled={isActing}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium text-sm disabled:opacity-50 transition-colors"
                      >
                        <MessageSquare size={16} />
                        Revisi
                      </button>
                      <button
                        onClick={() => handleAction(approval.id, 'reject')}
                        disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === approval.id + 'reject'
                          ? <Loader size={16} className="animate-spin" />
                          : <ThumbsDown size={16} />
                        }
                        Tolak
                      </button>
                      {noteInputId === approval.id && (
                        <button
                          onClick={() => handleAction(approval.id, 'revision')}
                          disabled={isActing}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50 transition-colors"
                        >
                          Kirim Revisi
                        </button>
                      )}
                    </div>
                  )}
                  {!isPending && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                      {approval.status === 'approved'
                        ? <><CheckCircle2 size={16} className="text-green-500" /> <span>Telah disetujui</span></>
                        : <><AlertCircle size={16} className="text-red-400" /> <span>Permohonan ditolak</span></>
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface DivisionalContentProps {
  activeMenu: string | null;
  division: string;
}

export const DivisionalContent: React.FC<DivisionalContentProps> = ({
  activeMenu,
  division,
}) => {
  const mainContentClass = "flex-1 overflow-y-auto";

  const renderContent = () => {
    switch (activeMenu) {
      case 'tasks':
        return <TasksView division={division} />;
      case 'mailbox':
        return <MailboxView division={division} />;
      case 'reports':
        return <ReportsView division={division} />;
      case 'approvals':
        return <ApprovalCenterView division={division} />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">Select a menu item to get started</p>
          </div>
        );
    }
  };

  return (
    <div className={mainContentClass}>
      <div className="p-8 max-w-7xl">
        {renderContent()}
      </div>
    </div>
  );
};

export { TasksView, MailboxView, ReportsView, ApprovalCenterView };
