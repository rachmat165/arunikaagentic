# 🔧 DETAILED INSTANCE SETUP GUIDE
## PT. Arunika Teknologi Global - Cowork Hybrid 4 Instances

**Preparation Date**: 2026-05-09  
**Setup Duration**: 4 weeks  
**Complexity**: Advanced  

---

## ⚙️ PRE-SETUP REQUIREMENTS

### API Keys Ready ✅
- [ ] Claude API key: `sk-ant-xxxx` (Active)
- [ ] OpenAI API key: `sk-xxxx` (Active)
- [ ] Google Gemini API key: `AIzaSyxxxx` (Active)
- [ ] Google OAuth credentials (for Drive, Gmail, Sheets)

### Access Credentials
- [ ] Email: corsec@arunika2045.com
- [ ] Google Workspace Admin Access
- [ ] Bank API credentials (for Finance instance)
- [ ] LinkedIn App credentials
- [ ] Instagram Business Account

### Infrastructure
- [ ] Dedicated workspace/project folder
- [ ] Google Cloud Project setup
- [ ] VPC/Network security configured
- [ ] Monitoring tools configured

---

## 🏗️ INSTANCE 1: CENTRAL-HUB SETUP

### 1.1 Project Initialization
```yaml
Instance Configuration:
  Name: Arunika-Central-Hub
  Type: Orchestration-Hub
  Environment: Production
  Region: us-central1 (GCP)
  Timezone: Asia/Jakarta
```

### 1.2 Model Configuration
```python
# Claude 3.5 Sonnet Configuration
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"
CLAUDE_MAX_TOKENS = 4096
CLAUDE_TEMPERATURE = 0.7  # Balanced for orchestration

# Gemini 2.0 Configuration  
GEMINI_MODEL = "gemini-2.0-pro"
GEMINI_MAX_TOKENS = 8192
GEMINI_TEMPERATURE = 0.5  # Conservative for data processing
```

### 1.3 Google Integrations Setup

#### Google Drive Setup
```
Purpose: Central repository for all instances
Structure:
  /Arunika-Central-Hub/
    /01-Workflows/
      /daily-briefings/
      /hourly-syncs/
      /alerts/
    /02-Data-Sync/
      /instance-1-data/
      /instance-2-data/
      /instance-3-data/
      /instance-4-data/
    /03-Reports/
      /system-health/
      /cost-tracking/
      /automation-metrics/
```

Configuration Steps:
1. Create shared drive: "Arunika-Central-Hub"
2. Set up folder structure (above)
3. Configure service account access
4. Enable revision history (30-day retention)
5. Set up automated backups

#### Gmail Setup
```
Purpose: Workflow notifications and automated responses
Configuration:
  - Labels created:
    * Central-Hub:Workflows
    * Central-Hub:Alerts
    * Central-Hub:Reports
  - Filters configured:
    * Route instance alerts → Central-Hub:Alerts
    * Route reports → Central-Hub:Reports
  - Auto-responses:
    * Acknowledge receipt (5 min)
    * Send daily summary (6 AM Jakarta time)
```

Setup Steps:
1. Create Gmail labels for categorization
2. Set up email filters for routing
3. Configure auto-responder templates
4. Enable API access (OAuth 2.0)
5. Test email routing with sample messages

#### Google Sheets Setup
```
Purpose: Real-time operational dashboard
Sheets Configuration:

Sheet 1: Daily-Metrics (Updated hourly)
  - Total workflows processed
  - Success rate (%)
  - Average processing time
  - Error count
  - API cost tracking

Sheet 2: Instance-Status (Real-time)
  - Instance name
  - Status (Active/Idle/Error)
  - Last sync time
  - Current processing queue
  - Resource utilization

Sheet 3: Alerts-Log (Continuous)
  - Timestamp
  - Alert type
  - Instance origin
  - Severity (Critical/High/Medium)
  - Status (Open/Resolved)

Sheet 4: Cost-Tracking (Monthly)
  - Instance name
  - Claude API cost
  - Gemini API cost
  - OpenAI cost
  - Total/month
  - % of budget used
```

### 1.4 Central Orchestration Workflows

**Workflow 1: Hourly Data Synchronization**
```
Trigger: Every hour at :00
Steps:
  1. Fetch data from Instance 2 (Sales-Marketing)
     - Latest campaigns created
     - Performance metrics
     - Lead generation data
  
  2. Fetch data from Instance 3 (Finance-Operations)
     - Documents processed today
     - Expenses recorded
     - Compliance status
  
  3. Fetch data from Instance 4 (CEO-Dashboard)
     - Executive alerts generated
     - Strategic recommendations
     - Decision support requests
  
  4. Consolidate in Google Sheets (Sync-Log sheet)
  
  5. Validate data integrity
     - Check for missing fields
     - Verify data types
     - Flag anomalies
  
  6. Archive previous sync (Google Drive)
  
  7. Send status to Central-Hub Gmail (weekly digest)

Success Criteria:
  - Sync completion time: <5 minutes
  - Data integrity: 100%
  - Missing data alerts: 0
```

**Workflow 2: Alert Routing & Escalation**
```
Trigger: Alert received from any instance
Steps:
  1. Receive alert (via email or webhook)
     - Parse alert metadata
     - Assign severity (Critical/High/Medium/Low)
     - Identify source instance
  
  2. Route based on severity:
     CRITICAL:
       → Immediate email to CEO
       → Add to Alerts-Log
       → Create task in Operations
       → Notify Central-Hub admin
     
     HIGH:
       → Email to department head
       → Add to Alerts-Log
       → Create monitoring task
     
     MEDIUM:
       → Add to daily briefing
       → Add to Alerts-Log
     
     LOW:
       → Log only in Alerts-Log

  3. Follow-up tracking:
     - Status updates every 4 hours (if Critical)
     - Resolution verification
     - Post-incident review

Success Criteria:
  - Critical alerts to CEO: <5 min
  - All alerts logged: 100%
  - Resolution tracking: Complete
```

**Workflow 3: Daily Briefing Generation**
```
Trigger: Every day at 6:00 AM Jakarta time
Steps:
  1. Gather inputs:
     - Sales-Marketing: Campaign performance
     - Finance-Operations: Daily expenses, processed documents
     - CEO-Dashboard: KPI changes, alerts
  
  2. Analyze and synthesize:
     - Use Claude for natural language summary
     - Calculate key metrics
     - Identify trends and anomalies
  
  3. Format briefing:
     Subject: "[Daily Brief] {Date} - Arunika Operations"
     Body:
       Executive Summary (2-3 sentences)
       Key Metrics (5-7 items)
       Alerts/Issues (if any)
       Recommended Actions (if any)
       Attachments: Full metrics CSV
  
  4. Send to:
     - CEO (corsec@arunika2045.com)
     - CFO
     - Sales Head
     - Operations Manager
  
  5. Archive in Google Drive
     Path: /01-Workflows/daily-briefings/{YYYY-MM-DD}.pdf

Success Criteria:
  - Briefing generation: <15 min
  - Delivery time: 6:05 AM or earlier
  - Content completeness: 100%
```

### 1.5 Monitoring & Health Checks

```python
# Health Check Configuration
HEALTH_CHECK_INTERVAL = 30  # minutes

Check Parameters:
  ✓ API connectivity (all services)
  ✓ Quota usage (vs limits)
  ✓ Error rates
  ✓ Processing latency
  ✓ Storage usage
  ✓ Budget burn rate

Alert Thresholds:
  ⚠️ Error rate > 5%
  ⚠️ Processing time > 10 min
  ⚠️ 80%+ monthly budget used
  ⚠️ API quota > 90% used
  ⚠️ Any critical service down

Logging:
  - All API calls logged to Google Sheets
  - Errors logged with full stack trace
  - Performance metrics tracked
  - Cost per operation calculated
```

---

## 📱 INSTANCE 2: SALES-MARKETING SETUP

### 2.1 Model & Integration Configuration

```python
OPENAI_MODEL = "gpt-4o"
OPENAI_MAX_TOKENS = 2048
OPENAI_TEMPERATURE = 0.8  # Creative for content

GEMINI_MODEL = "gemini-2.0-vision"  # For image analysis
CLAUDE_MODEL = "claude-3-5-sonnet"  # For strategy
```

### 2.2 LinkedIn Integration

**API Setup**:
```
App Registration:
  - App Name: Arunika-Auto-Campaigns
  - Scope: w_member_social, r_basicprofile
  - Redirect URI: https://central-hub.arunika.internal/auth/linkedin/callback

Authentication:
  - OAuth 2.0 flow
  - Token refresh: Every 24 hours
  - Rate limit: 200 posts/day (API limit)
```

**Auto-Posting Workflow**:
```
Trigger: Daily at 8:00 AM, 12:00 PM, 4:00 PM Jakarta time
Content Pipeline:
  1. Generate post variations (using GPT-4o):
     - Professional tone
     - Thought leadership angle
     - Industry insights
     - Company updates
  
  2. Create 3 variations (A/B testing):
     Post A: Informative (80-100 chars)
     Post B: Engaging (100-120 chars)
     Post C: Call-to-action (120-150 chars)
  
  3. Add hashtags (AI-generated):
     - Industry relevant (#TechInnovation, #AI, etc.)
     - Company brand (#Arunika, #ArunikaTech, etc.)
     - Trending (API from trends source)
  
  4. Schedule posting:
     Post A: 8:00 AM
     Post B: 12:00 PM
     Post C: 4:00 PM
  
  5. Track metrics:
     - Impressions
     - Likes/Comments
     - Click-through rate
     - Engagement rate

Engagement Response:
  - Monitor comments (real-time)
  - Generate AI responses to comments (moderate first)
  - Track lead inquiries
```

### 2.3 Instagram Integration

**API Setup**:
```
Configuration:
  - Connected to Arunika Instagram Business Account
  - API: Instagram Graph API
  - Permissions: manage_pages, instagram_basic
```

**Auto-Caption Generation**:
```
Trigger: When image uploaded to /Arunika-Content/Images/To-Post/
Steps:
  1. Image processing:
     - Use Gemini Vision to analyze image
     - Extract key elements
     - Identify style/mood
  
  2. Caption generation:
     - Create 5 caption variations
     - Different tones (professional, casual, inspirational)
     - Include relevant emojis
     - Add CTAs where appropriate
  
  3. Hashtag generation:
     - 15-30 relevant hashtags
     - Mix of popular + niche tags
     - Brand-related tags
  
  4. Post scheduling:
     - Optimal times (based on audience analytics)
     - 1-3 posts per week
  
  5. Performance tracking:
     - Reach
     - Impressions  
     - Saves/Shares
     - DM inquiries
```

### 2.4 Email Campaign Automation

**Email Sequence Structure**:
```
Lead Nurture Sequence (7 emails over 21 days):

Email 1: Welcome (Day 0)
  Subject: "Welcome to Arunika! 🚀"
  Content: Company overview, value proposition
  CTA: Schedule demo

Email 2: Problem Identification (Day 3)
  Subject: "Are you struggling with [problem]?"
  Content: Industry insights, pain point validation
  CTA: Read case study

Email 3: Solution Overview (Day 7)
  Subject: "How Arunika solves [problem]"
  Content: Product features, benefits
  CTA: Watch demo video

Email 4: Social Proof (Day 10)
  Subject: "[Company Name] saved 40% with Arunika"
  Content: Case study, testimonial, results
  CTA: Schedule call

Email 5: Offer (Day 14)
  Subject: "Special offer for leads like you"
  Content: Limited-time offer, pricing
  CTA: Accept offer

Email 6: Urgency (Day 17)
  Subject: "Only 3 spots left this month"
  Content: Scarcity messaging, next steps
  CTA: Claim spot

Email 7: Final (Day 21)
  Subject: "Final opportunity - ends tomorrow"
  Content: Last chance messaging
  CTA: Get started

Generation Process:
  1. Input: Lead profile, product, pain points
  2. Claude generates email variations
  3. GPT-4o optimizes subject lines (A/B test)
  4. Schedule in Google Sheets
  5. Send via Gmail integration
```

### 2.5 Content Calendar Automation

**Google Sheets Calendar**:
```
Structure:
  Column A: Date
  Column B: Day of Week
  Column C: Content Type (Blog/LinkedIn/Instagram/Email)
  Column D: Topic
  Column E: Status (Draft/Ready/Published)
  Column F: Performance (Impressions/Engagement)

Auto-Generation:
  1. Weekly run on Monday 9 AM:
     - Generate 7 content topics (using Claude)
     - Assign to calendar slots
     - Create draft outlines
  
  2. Daily at 11 PM:
     - Check status of tomorrow's content
     - Finalize any pending posts
     - Queue final content
  
  3. Post-publication:
     - Log actual performance metrics
     - Calculate ROI
     - Feed back into content strategy
```

---

## 💼 INSTANCE 3: FINANCE-OPERATIONS SETUP

### 3.1 Document Processing Configuration

**Gemini OCR Setup** (Heavy lifting for documents):
```python
GEMINI_VISION_MODEL = "gemini-2.0-vision"
OCR_CONFIDENCE_THRESHOLD = 0.95  # 95% accuracy required

Supported Document Types:
  ✓ Invoices (PDF/Image)
  ✓ Receipts (PDF/Image)
  ✓ Purchase Orders
  ✓ Contracts
  ✓ Tax documents
  ✓ Bank statements
  ✓ Payroll slips
```

### 3.2 Invoice Processing Workflow

**Automation Pipeline**:
```
Trigger: Email with attachment received in finance@arunika.com

Step 1: Document Reception
  - Email arrives with invoice attachment
  - Check: Is it invoice? (file format, content check)
  - Extract attachment to /Finance-Operations/inbox/

Step 2: OCR & Data Extraction (Gemini)
  Fields extracted:
    ✓ Vendor name
    ✓ Invoice number & date
    ✓ Amount (currency)
    ✓ Payment terms
    ✓ Line items (description, qty, unit price, total)
    ✓ Tax amount
    ✓ Total amount due
    ✓ Payment instructions
  
  Confidence check:
    - All fields > 95% confidence
    - If < 95%, flag for manual review
    - Manual review queue: <24 hours

Step 3: Vendor Validation (Claude)
  - Match vendor name to vendor database
  - Check if vendor active/blocked
  - Verify invoice format matches vendor profile
  - Alert: Unknown vendor → Manual review

Step 4: Amount Validation (OpenAI)
  - Check amount reasonable (vs average invoice)
  - Flag unusual line items
  - Validate tax calculation
  - Alert: Unusual amounts → Manual review

Step 5: Three-Way Match (Claude)
  - Match to Purchase Order
  - Match to Receipt/Delivery confirmation
  - Match to Invoice
  - Result: Match ✓ or Mismatch ⚠️

Step 6: Budget Check (Claude)
  - Check departmental budget
  - Check project allocation
  - Verify amount available
  - Alert: Budget exceeded → Manager approval needed

Step 7: Approval Routing
  Amount < $1,000:
    → Auto-approved
    → Record to Google Sheets
  
  Amount $1,000-$5,000:
    → Department head approval
    → 24-hour wait
  
  Amount > $5,000:
    → CFO approval
    → 48-hour wait

Step 8: Payment Processing
  - Generate payment instruction
  - Update cash flow forecast
  - Schedule payment date
  - Log to accounting system (Google Sheets)

Step 9: Filing & Archival
  - Save original to /Finance-Operations/invoices/{YYYY-MM}/
  - Create standardized PDF
  - Log metadata to database
  - Link to Purchase Order

Success Metrics:
  ✓ Processing time: 2-5 minutes
  ✓ Accuracy: 97%+
  ✓ Manual review rate: <3%
  ✓ On-time payment: 100%
```

### 3.3 Expense Report Automation

**Workflow**:
```
Trigger: Employee submits expense form (Google Form)

Steps:
  1. Receipt Collection:
     - Image/PDF receipt uploaded
     - Timestamp recorded
  
  2. OCR Processing (Gemini):
     - Extract receipt details
     - Vendor, date, amount, items
  
  3. Categorization (Claude):
     - Classify: Travel, Meals, Office, etc.
     - Sub-category assignment
     - Project/cost center allocation
  
  4. Validation:
     - Amount reasonable for category
     - Policy compliance check
     - Approval authority determination
  
  5. Approval Flow:
     - Manager approval (online via Gmail)
     - Finance review
     - Payment processing
  
  6. Reimbursement:
     - Direct bank transfer
     - Same-day or next-day
     - Confirmation email to employee

Processing SLA: 24-48 hours
```

### 3.4 Bank Reconciliation Automation

**Configuration**:
```
Bank API Integration:
  - Daily fetch: Statement data
  - Transaction matching: Automated
  - Discrepancy flagging: Real-time
  - Reconciliation report: Weekly

Process:
  1. Daily (6 PM):
     - Fetch bank transactions
     - Match to company ledger
     - Auto-match 95%+ of transactions
  
  2. Weekly (Friday 2 PM):
     - Create reconciliation report
     - Flag 5% unmatched
     - Alert CFO
     - Identify patterns
  
  3. Monthly (Last day):
     - Complete reconciliation
     - Prepare for financial close
     - Variance analysis
```

### 3.5 Tax Compliance Automation

**Monthly Reports**:
```
Generated Automatically:
  ✓ VAT/GST Report (if applicable)
  ✓ Withholding tax summary
  ✓ Social security contributions
  ✓ Income tax provisions

Quarterly:
  ✓ Corporate tax estimation
  ✓ Estimated payment calculation

Annually:
  ✓ Tax reconciliation
  ✓ Year-end adjustments
  ✓ Filing package preparation
```

---

## 👔 INSTANCE 4: CEO-DASHBOARD SETUP

### 4.1 Executive Dashboard Architecture

```
Real-Time Dashboards:
  Dashboard 1: Operations (Updated hourly)
  Dashboard 2: Sales Pipeline (Real-time)
  Dashboard 3: Financial Health (Real-time)
  Dashboard 4: Team Performance (Daily)
  Dashboard 5: Risk Dashboard (Real-time)
```

### 4.2 Daily Executive Briefing Workflow

**Trigger**: Every day 5:30 AM Jakarta time

**Content Structure**:
```
📊 DAILY EXECUTIVE BRIEF - {Date}
Prepared for: Adang A. Kunandar (CEO)

═════════════════════════════════════

🎯 EXECUTIVE SUMMARY (2-3 sentences)
[Use Claude to synthesize key events]

═════════════════════════════════════

📈 KEY METRICS (Update from each instance)

Sales-Marketing:
  • Campaigns created today: X
  • Lead generation: X (↑/↓ vs yesterday)
  • Email open rate: X%
  • Social engagement: X interactions

Finance-Operations:
  • Daily revenue: $X
  • Expenses: $X
  • Cash position: $X
  • Invoices processed: X
  • Budget utilization: X%

Operations:
  • Team productivity: X%
  • Automation success rate: X%
  • System uptime: X%
  • Processing queue: X items

═════════════════════════════════════

⚠️ ALERTS & ISSUES (if any)
  [Critical items highlighted]
  - Issue: {description}
    Impact: {business impact}
    Recommended action: {action}

═════════════════════════════════════

💡 OPPORTUNITIES
  [Strategic recommendations]
  - Opportunity: {description}
    Expected value: {estimate}
    Recommended action: {action}

═════════════════════════════════════

📋 TODAY'S PRIORITIES
  1. {Priority 1}
  2. {Priority 2}
  3. {Priority 3}

═════════════════════════════════════

Attachments:
  • Full metrics dashboard (CSV)
  • Alert log
  • Cost tracking report
```

### 4.3 Weekly Strategic Review

**Trigger**: Every Monday 8:00 AM

**Content**:
```
1. Week Summary
   - Key wins
   - Challenges faced
   - Lessons learned

2. Financial Summary
   - Revenue vs target
   - Expense summary
   - Cash flow analysis

3. Sales Update
   - Pipeline progress
   - New opportunities
   - Deal closures

4. Team Update
   - Productivity metrics
   - Team engagement
   - Any issues/concerns

5. Strategic Initiatives
   - Progress on key projects
   - Timeline adjustments (if any)
   - Resource needs

6. Risk Assessment
   - New risks identified
   - Mitigation strategies
   - Compliance status
```

### 4.4 Board Report Generation

**Trigger**: Quarterly (or on-demand)

**Automated Deck Generation** (Google Slides):
```
Slide 1: Title
Slide 2: Financial Summary (Charts)
Slide 3: Sales Pipeline (Visualizations)
Slide 4: Key Metrics Dashboard
Slide 5: Strategic Initiatives Progress
Slide 6: Risk & Mitigation
Slide 7: Recommendations & Next Steps
Slide 8: Appendix (Detailed data)

Generation Process:
  1. Claude: Write narrative + insights
  2. Gemini: Generate visualizations
  3. Google Slides API: Assemble deck
  4. Review & edit: Manual approval
  5. Distribution: Email to board members
```

---

## 🔗 INTER-INSTANCE DATA FLOWS

### Data Sync Patterns

**Hourly Sync (Central-Hub ↔ All)**:
```
0:00 → Central-Hub pulls from Instance 2,3,4
       Validates & consolidates
       Updates dashboards
       Logs to audit trail

Example Data:
  From Sales-Marketing:
    - Campaigns created/modified
    - Lead counts
    - Performance metrics
  
  From Finance-Operations:
    - Documents processed
    - Expenses recorded
    - Compliance updates
  
  From CEO-Dashboard:
    - Alert status
    - Decision support requests
    - Report generation status
```

**Weekly Reporting Sync**:
```
Every Friday 5 PM:
  1. Compile all weekly metrics
  2. Calculate month-to-date numbers
  3. Forecast month-end numbers
  4. Generate trend analysis
  5. Create visualization dashboards
  6. Send to executive distribution
```

---

## 🛡️ ERROR HANDLING & RECOVERY

### Error Levels

**Level 1: Warning** (Non-critical)
```
Examples:
  - API response time > 2 seconds
  - Quota usage > 80%
  - Processing queue building up

Action:
  - Log to dashboard
  - Monitor trend
  - Alert (daily summary)
```

**Level 2: Error** (Service impact)
```
Examples:
  - API returns error (rate limit, auth)
  - Document OCR confidence < 95%
  - Data validation failure

Action:
  - Queue for retry (exponential backoff)
  - Alert instance owner (email)
  - Escalate if error persists >1 hour
```

**Level 3: Critical** (Service down)
```
Examples:
  - API service unavailable
  - Data corruption detected
  - Sync failure >2 hours

Action:
  - Immediate alert to CEO
  - Initiate incident response
  - Failover to manual process
  - Post-incident review
```

### Recovery Procedures

```python
# Retry Logic
MAX_RETRIES = 3
RETRY_DELAY = [1, 2, 5]  # seconds (exponential)

# Fallback Options
IF sync_fails:
  1st attempt: Automatic retry
  2nd attempt: Manual trigger option
  3rd attempt: Escalate to admin
  4th attempt: Use cached data (24h old)

# Data Integrity
- Version control on all shared files
- 30-day revision history
- Daily backups
- Test restore monthly
```

---

## 📝 CHECKLIST: READY TO LAUNCH

### Pre-Launch Verification
- [ ] All API keys validated
- [ ] Google integrations tested
- [ ] Workflows tested end-to-end
- [ ] Budget tracking configured
- [ ] Monitoring set up
- [ ] Team trained
- [ ] Documentation updated
- [ ] Backup procedures tested
- [ ] Incident response plan ready
- [ ] Launch communication prepared

### Go-Live Criteria
- [ ] 99%+ uptime in staging for 1 week
- [ ] Zero critical errors in staging
- [ ] Cost tracking shows <$10/month
- [ ] All team members trained
- [ ] Executive sign-off received

**Ready to proceed?** → Go to Implementation Roadmap

---

**Next**: Execute Instance Setup following detailed steps above 🚀
