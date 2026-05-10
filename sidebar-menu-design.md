# Desain Sidebar Menu Multi-Divisi
## Arunika Agentic AI Dashboard

---

## 📋 Ringkasan Fitur

Menambahkan menu sidebar yang terstruktur untuk setiap divisi/agen utama dengan fitur:
- **Tugas-Tugas (Tasks)** - Daftar tugas per divisi
- **Mailbox** - Komunikasi antar divisi
- **Laporan Divisi** - Hasil laporan dari masing-masing divisi
- **Approval Buttons** - Tombol persetujuan tugas

---

## 🎯 Struktur Sidebar Baru

### Level 1: Menu Utama (Existing)
```
Arunika
├── Executive Summary (existing)
├── To-Do Lists (existing)
├── Costs & Budget (existing)
├── Analytics (existing)
├── AI Agents (existing)
├── Divisional Management (NEW - section header)
│   ├── CEO Office
│   ├── Sales & Marketing Division
│   └── Operations & Finance Division
└── Settings & Admin (existing)
```

---

## 📊 Menu Detail Per Divisi

### 1️⃣ CEO OFFICE
**Menu Path:** `Divisional Management > CEO Office`

#### Sub-Menus:
```
CEO Office
├── 📝 CEO Tasks
│   ├── Assigned to Me
│   ├── Pending Approval
│   ├── Completed Tasks
│   └── Overdue Tasks
│
├── 📧 CEO Mailbox
│   ├── Messages from Divisions (3)
│   ├── Reports Pending Review
│   ├── Urgent Items
│   └── Archived Messages
│
├── 📋 Division Reports
│   ├── Sales & Marketing Report
│   ├── Operations & Finance Report
│   ├── Performance Dashboard
│   └── Weekly Summary
│
└── ✅ Approval Center
    ├── Pending Approvals (5)
    ├── Approved Items (24)
    ├── Rejected Items (2)
    └── Approval History
```

---

### 2️⃣ DIVISION: SALES & MARKETING
**Menu Path:** `Divisional Management > Sales & Marketing Division`

#### Sub-Menus:
```
Sales & Marketing Division
├── 📝 Team Tasks
│   ├── My Tasks (7)
│   ├── Team Tasks (15)
│   ├── Blocked Tasks (2)
│   └── In Progress (5)
│
├── 📧 Division Mailbox
│   ├── From CEO Office (2)
│   ├── From Ops & Finance (3)
│   ├── Internal Team Messages (12)
│   └── Notifications (8)
│
├── 📊 Division Reports
│   ├── Sales Performance
│   ├── Marketing Campaign Results
│   ├── Lead Generation Metrics
│   └── Monthly Summary
│
└── ✅ Task Management
    ├── Request Approval (8 waiting)
    ├── My Approvals (3)
    ├── Completed This Month (24)
    └── Performance Tracker
```

---

### 3️⃣ DIVISION: OPERATIONS & FINANCE
**Menu Path:** `Divisional Management > Operations & Finance Division`

#### Sub-Menus:
```
Operations & Finance Division
├── 📝 Operational Tasks
│   ├── Finance Tasks (6)
│   ├── Operations Tasks (8)
│   ├── Compliance Tasks (2)
│   └── In Review (4)
│
├── 📧 Division Mailbox
│   ├── From CEO Office (1)
│   ├── From Sales & Marketing (2)
│   ├── Interdepartmental Messages (7)
│   └── Alerts & Notices (5)
│
├── 📊 Financial & Operational Reports
│   ├── Monthly Financial Report
│   ├── Budget Analysis
│   ├── Cash Flow Report
│   ├── Operational Efficiency
│   └── Compliance Status
│
└── ✅ Approval & Sign-off
    ├── Finance Approvals (4)
    ├── Budget Approvals (2)
    ├── Compliance Sign-off (1)
    └── Audit Trail
```

---

## 🎨 Desain UI/UX

### Sidebar Layout
```
[Arunika Logo]
┌─────────────────────────────┐
│ Search agents, tasks...      │
└─────────────────────────────┘

📊 Executive Summary
📋 To-Do Lists
💰 Costs & Budget
📈 Analytics
🤖 AI Agents

─── Divisional Management ───

👔 CEO Office
├─ CEO Tasks
├─ CEO Mailbox
├─ Division Reports
└─ Approval Center

💼 Sales & Marketing Division
├─ Team Tasks
├─ Division Mailbox
├─ Division Reports
└─ Task Management

🏢 Operations & Finance Division
├─ Operational Tasks
├─ Division Mailbox
├─ Financial Reports
└─ Approval & Sign-off

─── Administration ───

⚙️ Settings
🚪 Logout
```

---

## 📱 Dashboard Views untuk Setiap Menu

### 1. Tasks View
```
┌─────────────────────────────────────┐
│  MY TASKS - Sales & Marketing        │
├─────────────────────────────────────┤
│ Filters: [All] [Pending] [In Progress] [Completed] │
│                                     │
│ ┌─ TASK #001                    ┐   │
│ │ Campaign Q2 Launch             │   │
│ │ Assigned: 2 days ago           │   │
│ │ Status: [In Progress] ⏳       │   │
│ │ [View Details] [Edit] [Approve]│   │
│ └─────────────────────────────────┘   │
│                                     │
│ ┌─ TASK #002                    ┐   │
│ │ Market Research Report         │   │
│ │ Assigned: 1 day ago            │   │
│ │ Status: [Pending] ⏱            │   │
│ │ [View Details] [Edit] [Reject] │   │
│ └─────────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 2. Mailbox View
```
┌─────────────────────────────────────┐
│  DIVISION MAILBOX                    │
├─────────────────────────────────────┤
│ From: [All ▼] To: [Me] Unread: [4] │
│                                     │
│ ┌─ MSG #1 [URGENT] ⚠️            ┐ │
│ │ From: CEO Office                 │ │
│ │ Subject: Budget Approval Needed  │ │
│ │ Date: Today 10:45 AM             │ │
│ │ [View] [Reply] [Mark as Read]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ MSG #2                        ┐ │
│ │ From: Ops & Finance Div          │ │
│ │ Subject: Invoice Payment Status  │ │
│ │ Date: Today 9:15 AM              │ │
│ │ [View] [Reply] [Archive]         │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 3. Reports View
```
┌─────────────────────────────────────┐
│  DIVISION REPORTS - Sales & Mkt      │
├─────────────────────────────────────┤
│ Period: [May 2026 ▼] Export: [PDF] │
│                                     │
│ ┌─ Report: Sales Performance    ┐  │
│ │ Generated: 5/11/2026           │  │
│ │ Status: ✅ Complete            │  │
│ │ [View Report] [Download]       │  │
│ └─────────────────────────────────┘  │
│                                     │
│ ┌─ Report: Marketing Campaigns  ┐  │
│ │ Generated: 5/10/2026           │  │
│ │ Status: ⏳ Processing          │  │
│ │ [View Report] [Refresh]        │  │
│ └─────────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 4. Approval Center View
```
┌─────────────────────────────────────┐
│  APPROVAL CENTER - CEO               │
├─────────────────────────────────────┤
│ Filter: [Pending: 8] [Approved: 24] │
│                                     │
│ ┌─ APPROVAL #AP001             ┐  │
│ │ Task: Budget Allocation Q2      │  │
│ │ From: Finance Division          │  │
│ │ Amount: $150,000                │  │
│ │ Submitted: 5/11 11:30 AM        │  │
│ │ [✅ Approve] [❌ Reject]         │  │
│ │ [View Details] [Add Comment]    │  │
│ └─────────────────────────────────┘  │
│                                     │
│ ┌─ APPROVAL #AP002             ┐  │
│ │ Task: New Hire - Marketing Dir  │  │
│ │ From: HR Division               │  │
│ │ Salary: $85,000/year            │  │
│ │ Submitted: 5/10 2:15 PM         │  │
│ │ [✅ Approve] [❌ Reject]         │  │
│ │ [View Details] [Add Comment]    │  │
│ └─────────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Workflow & Approval Flow

### Siklus Tugas dengan Approval
```
1. Task Creation
   ↓
2. Assignment to Division
   ↓
3. Execution & Completion
   ↓
4. Submission for Approval
   ↓
5. Mailbox Notification (CEO/Approver)
   ↓
6. Review & Decision
   ├→ ✅ APPROVED → Task Completed
   ├→ ❌ REJECTED → Back to Division for Revision
   └→ 📝 PENDING COMMENT → Waiting for Response
```

---

## 📊 Key Features

### Untuk Setiap Divisi:

1. **Real-time Task Management**
   - Status tracking (New, In Progress, Pending Approval, Completed, Rejected)
   - Due date tracking
   - Priority levels (High, Medium, Low)
   - Assignee information

2. **Inter-Division Communication**
   - Mailbox dengan filter berdasarkan pengirim
   - Read/Unread status
   - Message threading
   - Attachment support

3. **Reporting Dashboard**
   - Automated reports generation
   - Export to PDF/Excel
   - Historical data tracking
   - Performance metrics

4. **Approval System**
   - Multi-level approval workflow
   - Comment & feedback system
   - Audit trail untuk setiap approval
   - Bulk approval capability

---

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend:** React.js with TypeScript
- **UI Components:** shadcn/ui + Tailwind CSS
- **State Management:** Redux/Context API
- **Database:** PostgreSQL (for tasks, messages, approvals)
- **API:** RESTful endpoints

### Key Endpoints Needed
```
GET  /api/divisions
GET  /api/tasks?division_id=xxx
POST /api/tasks
PUT  /api/tasks/:id
DELETE /api/tasks/:id

GET  /api/mailbox?division_id=xxx
POST /api/messages
PUT  /api/messages/:id/read

GET  /api/reports?division_id=xxx
GET  /api/reports/:id/export

GET  /api/approvals?status=pending
POST /api/approvals/:id/approve
POST /api/approvals/:id/reject
```

---

## 📈 Benefit & Expected Impact

✅ **Improved Workflow** - Tugas terstruktur per divisi
✅ **Better Communication** - Mailbox terintegrasi antar divisi
✅ **Transparent Approval** - Clear approval workflow
✅ **Data-Driven Decisions** - Reports terintegrasi
✅ **Accountability** - Audit trail lengkap
✅ **Scalability** - Mudah ditambah divisi baru

---

## 📅 Implementation Timeline

- **Phase 1 (Week 1-2):** Backend setup & database schema
- **Phase 2 (Week 3-4):** Frontend component development
- **Phase 3 (Week 5):** Integration & testing
- **Phase 4 (Week 6):** Deployment & user training

---

*Document Version: 1.0*
*Last Updated: 5/11/2026*
