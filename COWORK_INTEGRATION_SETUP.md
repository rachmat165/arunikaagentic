# 🔗 COWORK INTEGRATION SETUP GUIDE
## PT. Arunika Teknologi Global - Dashboard & Automation

**Date:** May 10, 2026  
**Status:** Ready for Implementation  
**Integration Type:** Full Cowork Hybrid Automation

---

## 📋 OVERVIEW

Sistem integrasi ini menghubungkan **Arunika Agentic AI Dashboard** dengan **4 Cowork instances** dan **12+ automated workflows** untuk menciptakan sistem monitoring & execution yang komprehensif.

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   Web Dashboard (Next.js)                    │
│  (KPI Cards, 3D Visualization, Executive Summary, Reports)  │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼──────────────┐
         │             │              │
    ┌────▼───┐  ┌─────▼───┐  ┌──────▼───┐
    │ Cowork │  │ Cowork  │  │ Cowork   │
    │ Hub    │  │ Sales & │  │ Finance &│
    │        │  │ Marketing  │Operations│
    └────────┘  └─────────┘  └──────────┘
         │             │              │
         └─────────────┼──────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼───┐  ┌──────▼───┐  ┌───────▼──┐
   │ Workflow│  │ Task     │  │ Reporting│
   │Executor │  │Monitor   │  │ Engine   │
   └─────────┘  └──────────┘  └──────────┘
```

---

## 🚀 QUICK START (5 MINUTES)

### Prerequisites
- Node.js v16+ installed
- Next.js 14 project running
- Cowork instances configured
- API keys configured

### Step 1: Install Dependencies (Already Included)
```bash
# Already in package.json:
# - axios (for API calls)
# - zustand (for state management)
# - lucide-react (for icons)
npm install
```

### Step 2: Configure Environment Variables
```bash
# In .env.local
COWORK_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional
COWORK_WEBHOOK_SECRET=webhook_secret
COWORK_RETRY_ATTEMPTS=3
COWORK_TIMEOUT=300000
```

### Step 3: Start Dashboard
```bash
npm run dev
# Visit http://localhost:3000
# Scroll to "Cowork Workflows" section to see all workflows
```

### Step 4: Execute Workflows
- Click **"Run Daily Workflows"** button to execute daily automated tasks
- Click **"Execute Now"** on any workflow card to run manually
- Monitor **"Overall Performance"** statistics

---

## 🏗️ ARCHITECTURE DETAILS

### 4 Cowork Instances

#### 1. **Central-Hub** (Orchestration)
- Role: Command center & coordination
- Models: Claude 3.5 Sonnet, Gemini 2.0
- Key Workflows:
  - Daily Briefing Aggregation
  - Alert Routing
  - Data Synchronization
  - Workflow Validation
- Budget: $10/month
- Automation: 90%

#### 2. **Sales-Marketing** (Creative Automation)
- Role: Campaign & content generation
- Models: GPT-4o, Gemini, Claude
- Key Workflows:
  - Daily Social Media Generation (09:00 WIB daily)
  - Weekly Email Campaign (Monday 10:00 WIB)
  - Lead Nurturing Automation
  - Monthly Content Calendar (1st of month)
- Budget: $10/month
- Automation: 85%

#### 3. **Finance-Operations** (Document Automation)
- Role: Invoice, payroll, reconciliation
- Models: Gemini 2.0, Claude 3.5, OpenAI
- Key Workflows:
  - Invoice Processing (continuous)
  - Expense Report Automation (16:00 WIB daily)
  - Payroll Processing (25th monthly)
  - Bank Reconciliation (17:00 WIB daily)
  - Tax Compliance Reports
- Budget: $10/month
- Automation: 90%

#### 4. **CEO-Dashboard** (Executive Intelligence)
- Role: Reports & executive insights
- Models: Claude, Gemini
- Key Workflows:
  - Weekly Performance Review (Friday 17:00 WIB)
  - Monthly Financial Summary (last day)
  - Quarterly Business Review
- Budget: $10/month
- Automation: 85%

---

## 📊 WORKFLOW DEFINITIONS

### Daily Workflows (Executed: 08:00 WIB)
1. **social-media-daily** - Generate 3-5 social posts (LinkedIn, Instagram, Twitter)
2. **expense-report-automation** - Process receipt OCR & categorize
3. **bank-reconciliation** - Auto-match transactions & flag discrepancies
4. **daily-briefing** - Aggregate metrics for CEO

### Weekly Workflows (Executed: Monday 10:00 WIB)
1. **email-campaign-weekly** - Generate & send email campaigns
2. **weekly-performance-review** - Comprehensive performance analysis

### Monthly Workflows (Executed: 1st of month, 08:00 WIB)
1. **content-calendar-generation** - 30-day calendar with SEO keywords
2. **payroll-processing** - Validate & process payroll
3. **monthly-financial-summary** - Complete financial analysis

### On-Demand Workflows
- Can be executed manually anytime
- No scheduling dependency
- Useful for testing & urgent tasks

---

## 🔌 API ENDPOINTS

### Execute Workflow
```bash
POST /api/workflows/execute
Content-Type: application/json

{
  "workflowId": "social-media-daily",
  "parameters": {
    "platform": "linkedin",
    "postCount": 3
  },
  "priority": "high"
}

Response:
{
  "success": true,
  "taskId": "task_123",
  "workflowId": "social-media-daily",
  "status": "running",
  "startTime": "2026-05-10T09:00:00Z"
}
```

### Get All Workflows
```bash
GET /api/workflows?instance=sales-marketing&stats=true

Response:
{
  "success": true,
  "count": 4,
  "workflows": [
    {
      "id": "social-media-daily",
      "name": "Daily Social Media Content Generation",
      "frequency": "Daily at 09:00 WIB",
      "stats": {
        "totalExecutions": 42,
        "successCount": 41,
        "successRate": 97.6
      }
    }
  ]
}
```

### Get Workflow Statistics
```bash
GET /api/workflows/stats?workflowId=social-media-daily&health=true

Response:
{
  "success": true,
  "stats": {
    "social-media-daily": {
      "totalExecutions": 42,
      "successCount": 41,
      "failureCount": 1,
      "successRate": 97.6,
      "avgDuration": 45000
    }
  },
  "health": {
    "sales-marketing": {
      "status": "healthy",
      "uptime": "99.9%"
    }
  }
}
```

### Execute Scheduled Workflows
```bash
# Daily workflows
POST /api/workflows/schedule/daily

# Weekly workflows
POST /api/workflows/schedule/weekly

# Monthly workflows
POST /api/workflows/schedule/monthly

Response:
{
  "success": true,
  "timestamp": "2026-05-10T08:00:00Z",
  "summary": {
    "totalWorkflows": 4,
    "successful": 4,
    "failed": 0,
    "avgDuration": 45000
  }
}
```

---

## 📱 DASHBOARD USAGE

### 1. Cowork Workflows Section
Located at bottom of dashboard, shows:
- **12+ workflows** organized by instance
- **Real-time execution status**
- **Success rates & statistics**
- **Manual execution buttons**
- **Performance metrics**

### 2. Controls
- **Refresh Button** - Get latest stats
- **Run Daily Workflows** - Execute all daily automated tasks
- **Instance Filter** - Filter by Cowork instance
- **Execute Now Button** - Run any workflow manually

### 3. Monitoring
- **Success Rate** - Target >90%
- **Execution Count** - Total runs
- **Average Duration** - Performance metric
- **Last Execution** - Timestamp of last run
- **Overall Performance** - Summary statistics

---

## ⚙️ SCHEDULING SYSTEM

### Automatic Scheduling (When Enabled)
The WorkflowExecutor automatically schedules workflows based on their frequency:

```
Daily Workflows          Weekly Workflows       Monthly Workflows
├─ 09:00 WIB: Social    ├─ Monday 10:00: Email ├─ 1st, 08:00: Calendar
├─ 16:00 WIB: Expenses  ├─ Friday 17:00: Review├─ 25th, 09:00: Payroll
├─ 17:00 WIB: Bank Rec  └─ (Continuing...)     └─ 28th, 17:00: Finance
└─ 08:00 WIB: Briefing

Each workflow can be:
✓ Auto-scheduled (set & forget)
✓ Manually executed (on-demand)
✓ API triggered (external systems)
✓ Event-based (email received, etc.)
```

### Cron Expression Configuration (Advanced)
```typescript
// In production, use node-cron for precise scheduling
// Example cron configurations:

"0 9 * * *"        // Daily at 09:00 AM
"0 9 * * 1-5"      // Weekdays at 09:00 AM
"0 10 * * 1"       // Every Monday at 10:00 AM
"0 0 1 * *"        // 1st of every month
"0 0 1 1 *"        // January 1st
"*/15 * * * *"     // Every 15 minutes
```

---

## 📊 REPORTING & ANALYTICS

### Available Reports
1. **Daily Briefing** - Summary of all daily workflows
2. **Weekly Performance** - Trend analysis & insights
3. **Monthly Financial Summary** - Full financial breakdown
4. **Quarterly Business Review** - Strategic analysis

### Report Generation
- Automatic: Via scheduled workflows
- Manual: Click "Generate Report" in dashboard
- Email: Automatically sent to corsec@arunika2045.com
- Format: PDF, Excel, JSON available

---

## 🔐 SECURITY & BEST PRACTICES

### API Key Management
```bash
# Never commit API keys
# Use environment variables only
# Rotate keys quarterly

COWORK_API_KEY=sk_live_... (production)
COWORK_API_KEY=sk_test_... (development)
```

### Rate Limiting
- Default: 100 requests/minute
- Can be configured in .env
- Automatic backoff on rate limit

### Error Handling
- Automatic retry (3 attempts by default)
- 5-second delay between retries
- Comprehensive error logging
- Webhook notifications on failure

### Monitoring
- Real-time health checks
- Performance metrics tracking
- Uptime monitoring (target 99.9%)
- Cost tracking (monthly, per instance)

---

## 🚨 TROUBLESHOOTING

### Workflow Fails to Execute
```
Check:
1. API key configured in .env.local
2. Cowork instance is online (check /api/workflows/stats?health=true)
3. Network connectivity
4. Workflow parameters valid
```

### Performance Issues
```
Solutions:
1. Check API response times in stats
2. Reduce parallel execution if needed
3. Increase timeout value in config
4. Check cloud resource utilization
```

### Missing Workflows
```
Fix:
1. Refresh page (Ctrl+F5)
2. Check instance configuration
3. Verify API connection
4. Check browser console for errors
```

---

## 📈 SCALING & OPTIMIZATION

### For >100 Workflows
1. Implement workflow sharding
2. Use async/await instead of sync
3. Add database for persistence
4. Implement queue system (Bull, RabbitMQ)

### Cost Optimization
- Current: $40/month (4 instances × $10)
- Monitor usage patterns
- Adjust instance allocation
- Use lower-cost models where possible

### Performance Tuning
- Parallel execution (enabled)
- Caching layer (recommended)
- Batch processing for reports
- Database indexing for queries

---

## 📚 DOCUMENTATION REFERENCE

### Core Files
- `services/cowork-api.ts` - API client & workflow definitions
- `services/workflow-executor.ts` - Execution engine
- `app/api/workflows/` - API routes
- `components/cowork-workflows-dashboard.tsx` - UI component

### Configuration
- `.env.example` - Environment template
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

---

## 🎯 SUCCESS METRICS

### Target KPIs
- Workflow success rate: >95%
- Average execution time: <5 minutes
- Uptime: 99.9%
- Cost efficiency: <$50/month

### Monitoring Dashboard
- Real-time metrics in UI
- Historical data in database
- Performance trends in reports
- Alert system for anomalies

---

## 📞 SUPPORT & CONTACT

**Email:** corsec@arunika2045.com  
**Website:** arunika2045.com  
**Address:** Jl. Calung No. 7, Kota Bandung, Jawa Barat, Indonesia

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Environment variables configured
- [ ] Cowork instances online & verified
- [ ] Dashboard running on localhost:3000
- [ ] Workflows visible in UI
- [ ] Execute at least one workflow manually
- [ ] Check stats & performance metrics
- [ ] Review API logs for errors
- [ ] Test daily/weekly/monthly schedules
- [ ] Verify email notifications (if enabled)
- [ ] Setup monitoring & alerting
- [ ] Document any customizations
- [ ] Ready for production

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** May 10, 2026  
**Version:** 1.0.0
