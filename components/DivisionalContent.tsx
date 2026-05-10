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

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchTasks = async () => {
    //   try {
    //     const response = await fetch(`/api/divisions/${division}/tasks`);
    //     const data = await response.json();
    //     setTasks(data);
    //   } catch (error) {
    //     console.error('Error fetching tasks:', error);
    //   }
    // };
    // fetchTasks();
  }, [division]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
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
          <p className="text-gray-500">No tasks available. Data akan dimuat dari API.</p>
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

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchMessages = async () => {
    //   try {
    //     const response = await fetch(`/api/divisions/${division}/messages`);
    //     const data = await response.json();
    //     setMessages(data);
    //   } catch (error) {
    //     console.error('Error fetching messages:', error);
    //   }
    // };
    // fetchMessages();
  }, [division]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
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
          <p className="text-gray-500">No messages. Data akan dimuat dari API.</p>
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

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchReports = async () => {
    //   try {
    //     const response = await fetch(`/api/divisions/${division}/reports`);
    //     const data = await response.json();
    //     setReports(data);
    //   } catch (error) {
    //     console.error('Error fetching reports:', error);
    //   }
    // };
    // fetchReports();
  }, [division]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
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
          <p className="text-gray-500">No reports available. Data akan dimuat dari API.</p>
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

  useEffect(() => {
    // TODO: Fetch real data from API
    // const fetchApprovals = async () => {
    //   try {
    //     const response = await fetch(`/api/divisions/${division}/approvals`);
    //     const data = await response.json();
    //     setApprovals(data);
    //   } catch (error) {
    //     console.error('Error fetching approvals:', error);
    //   }
    // };
    // fetchApprovals();
  }, [division]);

  const handleApprove = (id: string) => {
    setApprovals(approvals.map(a =>
      a.id === id ? { ...a, status: 'approved' as const } : a
    ));
  };

  const handleReject = (id: string) => {
    setApprovals(approvals.map(a =>
      a.id === id ? { ...a, status: 'rejected' as const } : a
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const priorityColor: Record<string, string> = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-amber-100 text-amber-800',
    'low': 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Approval Center - {division}</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          Approval History
        </button>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No approvals pending. Data akan dimuat dari API.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 grid grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {approvals.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {approvals.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {approvals.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-indigo-600">{approvals.length}</p>
            </div>
          </div>

          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="bg-white rounded-lg border border-gray-200 p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${priorityColor[approval.priority]}`}>
                        {approval.priority.toUpperCase()}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        approval.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : approval.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {approval.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{approval.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      From: <strong>{approval.fromDivision}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted: {approval.submittedDate}
                    </p>
                    {approval.amount && (
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        Amount: {approval.amount}
                      </p>
                    )}
                  </div>
                </div>

                {approval.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                    >
                      <ThumbsUp size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                    >
                      <ThumbsDown size={18} />
                      Reject
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
                      <MessageSquare size={18} />
                      Comment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
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
