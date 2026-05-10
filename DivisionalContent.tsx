import React, { useState } from 'react';
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

const TasksView: React.FC<{ division: string }> = ({ division }) => {
  const tasks: Task[] = [
    {
      id: 'T001',
      title: 'Campaign Q2 Launch',
      description: 'Prepare and execute Q2 marketing campaign',
      status: 'in-progress',
      priority: 'high',
      assignedDate: '5/10/2026',
      dueDate: '5/20/2026',
      assignee: 'John Doe',
    },
    {
      id: 'T002',
      title: 'Market Research Report',
      description: 'Comprehensive market analysis for new segments',
      status: 'pending-approval',
      priority: 'high',
      assignedDate: '5/9/2026',
      dueDate: '5/15/2026',
      assignee: 'Jane Smith',
    },
    {
      id: 'T003',
      title: 'Budget Allocation Review',
      description: 'Review and approve monthly budget allocation',
      status: 'new',
      priority: 'medium',
      assignedDate: '5/11/2026',
      dueDate: '5/12/2026',
      assignee: 'Mike Johnson',
    },
  ];

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
              {task.status === 'pending-approval' && (
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium">
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MailboxView: React.FC<{ division: string }> = ({ division }) => {
  const messages: Message[] = [
    {
      id: 'M001',
      from: 'CEO Office',
      subject: 'Budget Approval Needed',
      date: '5/11/2026 10:45 AM',
      isUnread: true,
      preview: 'Please review and approve the Q2 budget allocation...',
    },
    {
      id: 'M002',
      from: 'Operations & Finance',
      subject: 'Invoice Payment Status',
      date: '5/11/2026 9:15 AM',
      isUnread: true,
      preview: 'The following invoices have been processed and are ready for payment...',
    },
    {
      id: 'M003',
      from: 'System',
      subject: 'Task Completion Notification',
      date: '5/10/2026 3:30 PM',
      isUnread: false,
      preview: 'Your task "Market Research Report" has been marked as pending approval...',
    },
  ];

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
            Unread: 2
          </button>
        </div>
      </div>

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
    </div>
  );
};

const ReportsView: React.FC<{ division: string }> = ({ division }) => {
  const reports: Report[] = [
    {
      id: 'R001',
      title: 'Sales Performance Report',
      generatedDate: '5/11/2026',
      status: 'complete',
    },
    {
      id: 'R002',
      title: 'Marketing Campaign Results',
      generatedDate: '5/10/2026',
      status: 'complete',
    },
    {
      id: 'R003',
      title: 'Monthly Financial Analysis',
      generatedDate: '5/11/2026',
      status: 'processing',
    },
  ];

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
                  <span className={`inline-block text-xs font-semibold mt-2 px-2 py-1 rounded ${
                    report.status === 'complete'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {report.status === 'complete' ? '✅ Complete' : '⏳ Processing'}
                  </span>
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
    </div>
  );
};

const ApprovalCenterView: React.FC<{ division: string }> = ({ division }) => {
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: 'AP001',
      title: 'Budget Allocation Q2',
      fromDivision: 'Sales & Marketing',
      submittedDate: '5/11/2026 11:30 AM',
      status: 'pending',
      amount: '$150,000',
      priority: 'high',
    },
    {
      id: 'AP002',
      title: 'New Hire - Marketing Manager',
      fromDivision: 'Sales & Marketing',
      submittedDate: '5/10/2026 2:15 PM',
      status: 'pending',
      amount: '$85,000/year',
      priority: 'high',
    },
    {
      id: 'AP003',
      title: 'Monthly Financial Report Sign-off',
      fromDivision: 'Operations & Finance',
      submittedDate: '5/11/2026 9:00 AM',
      status: 'pending',
      priority: 'medium',
    },
  ]);

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
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-3xl font-bold text-indigo-600">24</p>
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
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
                  View Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
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
      case 'ceo-tasks':
      case 'sales-tasks':
      case 'ops-tasks':
        return <TasksView division={division} />;
      case 'ceo-mailbox':
      case 'sales-mailbox':
      case 'ops-mailbox':
        return <MailboxView division={division} />;
      case 'ceo-reports':
      case 'sales-reports':
      case 'ops-reports':
        return <ReportsView division={division} />;
      case 'approval-center':
      case 'sales-approval':
      case 'ops-approval':
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
