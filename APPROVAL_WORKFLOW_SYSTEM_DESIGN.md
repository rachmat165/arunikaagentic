# MULTI-AGENT APPROVAL WORKFLOW SYSTEM
## Arunika Agentic - Task Approval & Routing Architecture

### JAWABAN: YA, SISTEM INI BISA DIBANGUN!

**User Question:**
- Ketika tugas harian dari satu agentic disetujui oleh agentic ceo, maka agentic tersebut melanjutkan ketugas berikutnya atau berdasarkan perintah dari agentic melalui prompt perintah dari agentic ceo
- Ketika ditolak atau diperbaiki, maka agentic tersebut tidak menjalankannya atau memperbaiki sesuai dengan prompt perintah perbaikan dari agentic ceo

**Answer:** ✅ YES - Sistem approval workflow dengan routing dinamis sudah dirancang di bawah ini.

---

## CURRENT STATE (dari GitHub analysis)

### ✅ Yang Sudah Ada:
1. Dashboard Workflows (`cowork-workflows-dashboard.tsx`)
2. Workflow Executor dengan retry logic (`workflow-executor.ts`)
3. Basic approval steps dalam specification files
4. Email-based review mechanism

### ❌ Yang BELUM Ada (perlu dibangun):
1. **Integrated CEO Approval Dashboard** dengan unified UI
2. **Task Routing Logic** setelah approval → auto-execute next agentic
3. **Dynamic Revision Prompts** - CEO kirim instruction, agentic implement
4. **Approval Queue Database** untuk track status & history

---

## COMPLETE SOLUTION: 4 COMPONENTS

### 1️⃣ DATABASE SCHEMA

```sql
CREATE TABLE approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) UNIQUE NOT NULL,
  task_type VARCHAR(50) NOT NULL, -- 'proposal', 'content', 'report', etc
  source_agentic VARCHAR(100) NOT NULL, -- 'operations', 'sales', 'marketing'
  task_title VARCHAR(200) NOT NULL,
  output_data JSONB NOT NULL, -- Actual task output
  
  status VARCHAR(20) DEFAULT 'pending', 
  -- Values: pending, approved, rejected, revision_requested
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_by VARCHAR(100),
  
  -- CEO Review
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  -- Revision Tracking
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 3,
  revision_prompts JSONB, -- Array of CEO instructions
  
  -- Next Step Routing
  next_task_id VARCHAR(100),
  next_agentic VARCHAR(100),
  
  -- Audit
  approval_history JSONB,
  is_completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_status_created ON approval_queue(status, created_at DESC);
CREATE INDEX idx_review_pending ON approval_queue(status) WHERE status IN ('pending', 'revision_requested');
```

---

### 2️⃣ CEO APPROVAL DASHBOARD

**File:** `app/approval/ceo-dashboard.tsx`

Key Features:
- 📋 List semua pending approvals
- 👁️ Preview task output (proposal, content, report)
- ✅ [APPROVE] → Auto-execute next agentic
- 📝 [REQUEST REVISION] → Send specific instruction to agentic
- ❌ [REJECT] → Archive & notify source agentic

---

### 3️⃣ API ENDPOINTS

#### POST `/api/approvals/approve`
```
Request: { task_id, approved_by, timestamp }
→ Update DB status to 'approved'
→ Notify source agentic: "Your task approved!"
→ If next_task exists: Auto-route to next_agentic
→ Response: { next_task, next_agentic }
```

#### POST `/api/approvals/revise`
```
Request: { task_id, revision_instruction, requested_by }
→ Update DB status to 'revision_requested'
→ Send to source agentic: "Please revise: {instruction}"
→ Agentic implements revision (max 3x)
→ Re-submit for approval (loop back to dashboard)
```

#### POST `/api/approvals/reject`
```
Request: { task_id, rejected_by, timestamp }
→ Update DB status to 'rejected'
→ Archive task
→ Notify source agentic: "Task rejected, archived"
```

---

### 4️⃣ WORKFLOW SERVICE

**File:** `services/approval-routing-service.ts`

```typescript
// After agentic completes task
await approvalRoutingService.submitForApproval({
  taskId: 'proposal-001',
  taskType: 'proposal',
  sourceAgentic: 'operations-agentic',
  outputData: { /* actual proposal */ },
  nextTask: {
    task_id: 'send-proposal-001',
    target_agentic: 'sales-agentic'
  }
});

// Result: Task goes to approval_queue with status='pending'
// CEO gets notification in dashboard
```

---

## COMPLETE FLOW DIAGRAM

```
┌─ AGENTIC (e.g., Operations)
│  Task: Generate proposal
└──────────────────┬────────────────────
                   │ SUBMIT FOR APPROVAL
                   ▼
        ┌──────────────────────────┐
        │ APPROVAL_QUEUE (DB)      │
        │ status='pending'          │
        │ next_agentic='sales'      │
        └──────────────┬────────────┘
                       │ NOTIFICATION
                       ▼
        ┌──────────────────────────┐
        │ CEO DASHBOARD            │
        │ ┌────────────────────┐   │
        │ │ Pending: Proposal  │   │
        │ │ From: Operations   │   │
        │ │ [APPROVE] [REVISE] │   │
        │ │ [REJECT]           │   │
        │ └────────────────────┘   │
        └──────────────┬────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      APPROVE      REVISE      REJECT
        │            │            │
        ▼            ▼            ▼
   PATH A        PATH B       PATH C
        │            │            │
        ▼            ▼            ▼
    Update:     Send:         Archive:
    approved    "Fix the"     Rejected
        │       heading"           │
        │            │            │
        ▼            ▼            ▼
   Auto-route   Agentic    Notify source
   to Sales     revises    Don't execute
   agentic      & resub.
        │            │
        └────────────┘
             │
             ▼
        Submit again
        (loop to CEO dashboard)
             │
             ▼
        [APPROVE] → Sales executes
                    final task
```

---

## INTEGRATION EXAMPLE: Daily Social Media

### Current Flow (STEP 1-5):
```
1. OpenAI generates 3 posts
2. Gemini recommends visuals
3. Canva creates drafts
4. Content ready
5. Human review email
```

### With Approval System (STEP 6):
```
6. SUBMIT FOR APPROVAL
   approvalRoutingService.submitForApproval({
     taskId: 'social-daily-2026-05-11',
     taskType: 'social_post',
     sourceAgentic: 'marketing-agentic',
     outputData: { posts: [...], platforms: ['LinkedIn', 'Instagram'] },
     nextTask: {
       task_id: 'social-schedule-2026-05-11',
       target_agentic: 'scheduling-agentic'
     }
   });
   
   ↓ CEO opens dashboard
   ↓ Sees 3 posts preview
   
   Option A: [APPROVE]
   → Instant: Notify scheduling-agentic
   → Automatic: scheduling-agentic executes next task (publish)
   
   Option B: [REVISE]
   → Send: "Change post #1 title to emphasize ROI"
   → Marketing-agentic revises & re-submits
   → Loop back to CEO dashboard
   
   Option C: [REJECT]
   → Archived
   → Marketing-agentic notified
   → Skip today, try tomorrow
```

---

## KEY BENEFITS

✅ **CEO Has Control**: All decisions in one dashboard
✅ **Auto-Routing**: After approve → next agentic auto-executes
✅ **Dynamic Instructions**: CEO can send specific revision prompts
✅ **Revision Limits**: Max 3 revisions prevent infinite loops
✅ **Full Audit Trail**: Track every decision & instruction
✅ **No Manual Handoffs**: Everything automated via API

---

## IMPLEMENTATION ROADMAP

### Phase 1: Setup (Week 1)
- [ ] Create `approval_queue` table
- [ ] Build CEO Approval Dashboard component
- [ ] Create 3 API endpoints (approve, revise, reject)

### Phase 2: Integration (Week 2)
- [ ] Integrate with daily workflow executors
- [ ] Add email notifications
- [ ] Test approve → next agentic execution

### Phase 3: Polish (Week 3)
- [ ] Test revision flow (revise → resubmit → re-approve)
- [ ] Test rejection flow (reject → archive)
- [ ] Add audit logging
- [ ] Document approval SLAs

### Phase 4: Deployment (Week 4)
- [ ] UAT dengan CEO
- [ ] Deploy to production
- [ ] Monitor & optimize

---

## NEXT STEPS

1. **Review this design** dengan tim (terutama CEO & product)
2. **Choose database**: PostgreSQL (recommended) or MongoDB
3. **Setup database schema** dari SQL di atas
4. **Implement CEO Dashboard** (React component)
5. **Create API endpoints** (3 routes)
6. **Integrate dengan existing workflows** (submit for approval step)
7. **Test & deploy**

---

## QUESTIONS TO RESOLVE

1. **Notification method**: Email, Slack, In-app, or combination?
2. **Response time SLA**: Berapa lama CEO harus review? (recommend: 30-60 min)
3. **Revision timeout**: Agentic harus revise dalam berapa lama? (recommend: 2 hours)
4. **Multi-level approval**: Hanya CEO atau ada director approval juga?
5. **Mobile support**: CEO access dashboard from mobile?

---

File lengkap dengan code samples ada di folder workspace ini.
Untuk implementasi, hubungi tim engineering untuk prioritas.
