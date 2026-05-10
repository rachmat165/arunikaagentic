# 📋 Implementation Guide
## Divisional Management System untuk Arunika Agentic AI

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Installation & Setup](#installation--setup)
5. [Integration Steps](#integration-steps)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Configuration](#configuration)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Sistem Divisional Management menambahkan kemampuan untuk mengelola tugas, komunikasi, laporan, dan approval workflow antar divisi dalam Arunika Agentic AI.

### Key Features
- ✅ Multi-divisional menu structure
- ✅ Real-time task management
- ✅ Inter-division mailbox system
- ✅ Automated report generation
- ✅ Multi-level approval workflow
- ✅ Audit trail & activity logging

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│           Arunika Dashboard (Main App)              │
│  (localhost:3000/summary)                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│         New Route: /divisional-management           │
│  (localhost:3000/divisional-management)             │
└─────────────────────────────────────────────────────┘
                      ↓
        ┌─────────────┴────────────────┐
        ↓                              ↓
   ┌─────────────┐           ┌──────────────────┐
   │  Sidebar    │           │  Main Content    │
   │  Component  │◄─────────►│  Component       │
   └─────────────┘           └──────────────────┘
        ↓                              ↓
   ┌─────────────────────────────────────────┐
   │   API Layer (REST Endpoints)            │
   └─────────────────────────────────────────┘
        ↓
   ┌─────────────────────────────────────────┐
   │   Database Layer (PostgreSQL)           │
   └─────────────────────────────────────────┘
```

---

## Components

### 1. **DivisionalSidebar.tsx**
Menu navigasi untuk semua divisi dengan submenu items.

**Props:**
```typescript
interface DivisionalSidebarProps {
  onMenuSelect?: (menu: string) => void;
}
```

**Features:**
- Collapsible submenu items
- Badge untuk menampilkan jumlah pending items
- Active state management
- Responsive design

### 2. **DivisionalContent.tsx**
Menampilkan konten berdasarkan menu yang dipilih.

**Components:**
- `TasksView` - Daftar tugas per divisi
- `MailboxView` - Komunikasi antar divisi
- `ReportsView` - Laporan divisi
- `ApprovalCenterView` - Approval workflow

### 3. **DivisionalManagement.tsx**
Main container component yang mengintegrasikan semua parts.

---

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- React 18+
- TypeScript 4.5+
- Tailwind CSS 3+
- Lucide React Icons

### Step 1: Copy Component Files
```bash
# Copy the component files to your project
cp DivisionalSidebar.tsx src/components/
cp DivisionalContent.tsx src/components/
cp DivisionalManagement.tsx src/pages/
```

### Step 2: Install Dependencies (if needed)
```bash
npm install lucide-react --save
```

### Step 3: Ensure Tailwind CSS is configured
```bash
# Check your tailwind.config.js includes the correct content paths
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Integration Steps

### Step 1: Add Route
Update your routing configuration (e.g., `App.tsx` or router config):

```typescript
import DivisionalManagement from './pages/DivisionalManagement';

// In your router configuration
{
  path: '/divisional-management',
  element: <DivisionalManagement />,
  name: 'Divisional Management'
}
```

### Step 2: Update Navigation
Add link to divisional management in your main navigation:

```typescript
// In your main layout/navigation component
<Link to="/divisional-management" className="nav-link">
  Divisional Management
</Link>
```

### Step 3: Setup API Integration
Create API service file `src/services/divisionalApi.ts`:

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const divisionalApi = {
  // Tasks
  getTasks: (divisionId: string) => 
    axios.get(`${API_BASE}/tasks?division=${divisionId}`),
  createTask: (task: any) => 
    axios.post(`${API_BASE}/tasks`, task),
  updateTask: (id: string, task: any) => 
    axios.put(`${API_BASE}/tasks/${id}`, task),
  
  // Messages
  getMessages: (divisionId: string) => 
    axios.get(`${API_BASE}/messages?division=${divisionId}`),
  sendMessage: (message: any) => 
    axios.post(`${API_BASE}/messages`, message),
  
  // Reports
  getReports: (divisionId: string) => 
    axios.get(`${API_BASE}/reports?division=${divisionId}`),
  generateReport: (divisionId: string, type: string) => 
    axios.post(`${API_BASE}/reports/generate`, { divisionId, type }),
  
  // Approvals
  getApprovals: (status?: string) => 
    axios.get(`${API_BASE}/approvals`, { params: { status } }),
  approveItem: (id: string, comment?: string) => 
    axios.post(`${API_BASE}/approvals/${id}/approve`, { comment }),
  rejectItem: (id: string, reason: string) => 
    axios.post(`${API_BASE}/approvals/${id}/reject`, { reason }),
};
```

### Step 4: Update DivisionalContent Component
Integrate dengan API calls:

```typescript
import { useEffect, useState } from 'react';
import { divisionalApi } from '../services/divisionalApi';

const TasksView: React.FC<{ division: string }> = ({ division }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await divisionalApi.getTasks(division);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [division]);

  // ... rest of component
};
```

---

## Database Schema

### Tables Required

#### 1. `divisions`
```sql
CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  head_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  division_id UUID NOT NULL REFERENCES divisions(id),
  assigned_to UUID,
  assigned_by UUID,
  status VARCHAR(50) DEFAULT 'new', -- new, in-progress, pending-approval, completed, rejected
  priority VARCHAR(20) DEFAULT 'medium', -- high, medium, low
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  INDEX (division_id, status)
);
```

#### 3. `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_division_id UUID NOT NULL REFERENCES divisions(id),
  to_division_id UUID NOT NULL REFERENCES divisions(id),
  sender_id UUID,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (to_division_id, is_read)
);
```

#### 4. `reports`
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES divisions(id),
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100), -- sales, marketing, financial, operational, etc.
  content JSONB,
  file_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'processing', -- processing, complete, failed
  generated_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (division_id, created_at)
);
```

#### 5. `approvals`
```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id VARCHAR(255), -- FK to whatever needs approval
  request_type VARCHAR(100), -- task, budget, hiring, etc.
  from_division_id UUID NOT NULL REFERENCES divisions(id),
  to_division_id UUID NOT NULL REFERENCES divisions(id),
  approver_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  details JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  approval_comment TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX (status, approver_id)
);
```

#### 6. `audit_log`
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  action VARCHAR(100),
  old_value JSONB,
  new_value JSONB,
  performed_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (entity_type, entity_id)
);
```

---

## API Endpoints

### Tasks
```
GET    /api/tasks?division=xxx&status=pending
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Messages/Mailbox
```
GET    /api/messages?division=xxx&unread=true
POST   /api/messages
PUT    /api/messages/:id/read
DELETE /api/messages/:id
```

### Reports
```
GET    /api/reports?division=xxx
POST   /api/reports/generate
GET    /api/reports/:id/download
```

### Approvals
```
GET    /api/approvals?status=pending
POST   /api/approvals/:id/approve
POST   /api/approvals/:id/reject
GET    /api/approvals/:id/history
```

---

## Configuration

### Environment Variables
```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_MAX_UPLOAD_SIZE=10485760 # 10MB
REACT_APP_ENABLE_AUDIT_LOG=true
REACT_APP_NOTIFICATION_TIMEOUT=5000 # ms
```

### Feature Flags
```typescript
// config/features.ts
export const FEATURES = {
  DIVISIONAL_MANAGEMENT: true,
  APPROVAL_WORKFLOW: true,
  AUTO_REPORT_GENERATION: true,
  INTER_DIVISION_MESSAGING: true,
  AUDIT_LOGGING: true,
};
```

---

## Testing

### Unit Tests
```bash
# Test individual components
npm test DivisionalSidebar.test.tsx
npm test DivisionalContent.test.tsx
npm test DivisionalManagement.test.tsx
```

### Integration Tests
```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import DivisionalManagement from './DivisionalManagement';

describe('DivisionalManagement', () => {
  it('renders sidebar with all divisions', () => {
    render(<DivisionalManagement />);
    expect(screen.getByText('CEO Office')).toBeInTheDocument();
    expect(screen.getByText('Sales & Marketing Div')).toBeInTheDocument();
    expect(screen.getByText('Operations & Finance Div')).toBeInTheDocument();
  });

  it('opens submenu when clicking division', () => {
    render(<DivisionalManagement />);
    const ceoMenu = screen.getByText('CEO Office');
    fireEvent.click(ceoMenu);
    expect(screen.getByText('CEO Tasks')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Issue: Sidebar not showing
**Solution:** Ensure Tailwind CSS is properly configured and imported in your main CSS file.

### Issue: API calls failing
**Solution:** Check that backend API is running on correct port and CORS is configured properly.

```typescript
// Backend CORS configuration (Express.js example)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: Styles not applying
**Solution:** Clear node_modules and rebuild:
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: State management issues
**Solution:** Consider implementing Redux or Context API for complex state:
```typescript
// Example with Context API
const DivisionalContext = createContext();

export const DivisionalProvider: React.FC = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeDivision, setActiveDivision] = useState('CEO Office');

  return (
    <DivisionalContext.Provider value={{
      activeMenu,
      setActiveMenu,
      activeDivision,
      setActiveDivision,
    }}>
      {children}
    </DivisionalContext.Provider>
  );
};
```

---

## Performance Optimization

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const DivisionalContent = lazy(() => import('./DivisionalContent'));

<Suspense fallback={<LoadingSpinner />}>
  <DivisionalContent />
</Suspense>
```

### Memoization
```typescript
const DivisionalSidebar = React.memo(DivisionalSidebarComponent);
const TasksView = React.memo(TasksViewComponent);
```

### Virtual List (for large datasets)
```bash
npm install react-virtual
```

---

## Security Considerations

1. **Authentication & Authorization**
   - Implement role-based access control (RBAC)
   - Validate user permissions before showing content

2. **Data Validation**
   - Validate all inputs on frontend and backend
   - Sanitize HTML in text fields

3. **API Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Add request signing/verification

4. **Audit Logging**
   - Log all approval actions
   - Track data access and modifications

---

## Deployment Checklist

- [ ] All components properly exported
- [ ] API endpoints tested and working
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Tailwind CSS optimized for production
- [ ] Performance testing completed
- [ ] Security review passed
- [ ] User documentation completed
- [ ] Team training conducted
- [ ] Rollback plan prepared

---

## Support & Maintenance

For issues or questions:
1. Check troubleshooting section above
2. Review API documentation
3. Check application logs
4. Contact development team

**Documentation Updated:** 5/11/2026
**Version:** 1.0.0
