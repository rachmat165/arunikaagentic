# ARUNIKA WORKFLOW SPECIFICATIONS
## Detailed Configuration Guide untuk Setiap Workflow

**Dokumen ini:** Template & specification untuk 12 core workflows yang akan di-implement di 4 Cowork instances

---

## WORKFLOW 1: DAILY SOCIAL MEDIA CONTENT GENERATION
**Instance:** Cowork Sales & Marketing  
**Model:** OpenAI (primary), Gemini (visual), Claude (analysis)  
**Trigger:** Daily at 09:00 WIB (Asia/Jakarta)  
**Target:** Post ke LinkedIn + Instagram + Twitter setiap hari  

### Configuration:

```
WORKFLOW NAME: Daily-Social-Media-Generation
FREQUENCY: Every day at 09:00 WIB
PLATFORMS: LinkedIn, Instagram, Twitter
OUTPUT: 3 posts minimum
REVIEW: 30 minutes before posting
```

### Step-by-Step Flow:

**STEP 1: Gather Daily Trends**
```
Trigger: 09:00 WIB
Action: Execute API call ke Google Trends
Query: "Indonesia technology news" + "PT. Arunika industry"
Input Parameter:
  - Region: Indonesia
  - Category: Technology
  - Time: Last 24 hours
Output: JSON dengan trending topics, search volume, trending keywords
```

**STEP 2: Claude Strategic Analysis**
```
Model: Claude 3.5 Sonnet
Input: Trending topics dari STEP 1
Prompt:
"""
Kamu adalah strategic marketing analyst untuk PT. Arunika Teknologi Global.
Analyze trending topics dan tentukan:
1. Mana yang relevan dengan industri PT. Arunika?
2. Apa angle/perspective unik yang bisa kami ambil?
3. Ada peluang untuk thought leadership?

Output format JSON:
{
  "trend": "nama trend",
  "relevance": "high/medium/low",
  "our_angle": "perspektif unik kami",
  "opportunity": "peluang apa"
}
"""
Output: 3-5 strategic recommendations
```

**STEP 3: OpenAI Content Generation**
```
Model: GPT-4o
For each recommendation dari STEP 2:
Prompt:
"""
Buat 3 social media posts untuk trend ini:
Trend: {trend_name}
Our Angle: {our_angle}
Opportunity: {opportunity}

Requirements per post:
- Platform: LinkedIn (professional) / Instagram (visual storytelling)
- Length: LinkedIn 150-200 words, Instagram caption 50-100 words
- Tone: Professional tapi approachable (tidak terlalu formal)
- Include: 3-5 relevant hashtags (#PtArunika #Technology #Indonesia #Innovation)
- Include: Clear CTA (Call To Action) - "Learn more", "Comment below", "Share your thoughts"
- Language: Indonesian (but can mix eng words jika natural)
- Avoid: Jargon teknis yang sulit dipahami, promotional language berlebihan
- Include: Current date/week reference jika relevan

Output format:
POST 1:
[Content untuk LinkedIn]

POST 2:
[Content untuk Instagram]

POST 3:
[Alternative content untuk pilihan]
"""
Output: 3 posts dengan hashtag & CTA
```

**STEP 4: Gemini Visual Recommendation**
```
Model: Gemini 2.0 Vision
Analyze: Post content dari STEP 3
Task: Recommend visual style
Prompt:
"""
Untuk setiap post ini, suggest:
1. Image type: photo/illustration/graphic/video
2. Visual style: modern/professional/casual/energetic
3. Color palette: sesuai PT. Arunika brand
4. Specific image suggestion: describe apa yang ideal

Output JSON:
{
  "post_number": 1,
  "image_type": "professional photo",
  "style": "modern corporate",
  "colors": ["primary_color", "secondary_color"],
  "description": "Deskripsi image ideal"
}
"""
Output: Visual specs untuk setiap post
```

**STEP 5: Canva Integration (Optional - Generate actual design)**
```
If visual recommendation tersedia:
Action: Call Canva API
Create: Template design berdasarkan visual specs
Output: Draft image untuk review
```

**STEP 6: Human Review & Approval**
```
Email: direktur.marketing@arunika2045.com
Subject: "Social Media Posts - Approval Needed for {DATE}"
Content:
- 3 posts text
- Visual recommendations
- Hashtags & CTAs
- Link ke Canva draft (jika ada)

Review Window: 30 minutes
Options:
- [APPROVE] → posts dijadwalkan
- [MINOR EDITS] → specify changes, Claude re-generate
- [REJECT] → skip hari ini, archive untuk referensi future
```

**STEP 7: Schedule & Publish**
```
If APPROVED:
Action: Schedule posts di:
  - LinkedIn: 10:00 WIB (waktu optimal engagement)
  - Instagram: 10:30 WIB
  - Twitter: 11:00 WIB

Or publish immediately sesuai preference Direktur

Log ke Google Sheets:
- Columns: Date, Content, Platform, Posted_Time, Status
```

**STEP 8: Post-Publication Monitoring**
```
Trigger: Setiap jam selama 6 jam setelah posting
Monitor:
- Likes, comments, shares
- Engagement rate
- Click-through rate (jika ada link)
- Any negative comments (flag untuk immediate response)

Alert Direktur: Jika engagement rate < 2% atau ada negative sentiment
```

### Success Metrics:
- Posts generated: 3 per hari (21 per minggu)
- Approval rate: >90% (meaning content is good)
- Engagement: Target >3% (likes+comments/views)
- Time saved: 2-3 jam per hari vs manual creation

---

## WORKFLOW 2: EMAIL CAMPAIGN AUTOMATION
**Instance:** Cowork Sales & Marketing  
**Model:** OpenAI (copy), Claude (strategy)  
**Trigger:** Weekly campaign schedule  

### Configuration:

```
WORKFLOW NAME: Weekly-Email-Campaign
FREQUENCY: Every Monday at 10:00 WIB
TEMPLATE: Email marketing to PT. Arunika leads & customers
SEGMENT: Leads yang engagement-nya tinggi (engaged opportunities)
```

### Step-by-Step Flow:

**STEP 1: Get Lead List & Engagement Data**
```
Source: Google Sheets "CRM_Leads" atau HubSpot
Filter:
  - Last engaged: Last 30 days
  - Company size: Relevant target (mid-large)
  - Industry: Tech-related preferred
  - Status: NOT "Closed Won" (sudah jadi customer)
Output: CSV dengan 50-200 leads
```

**STEP 2: Claude Campaign Strategy**
```
Model: Claude 3.5 Sonnet
Input: Engagement data + this week's news/events
Prompt:
"""
Kamu adalah marketing strategist untuk PT. Arunika.
Analyze leads engagement dan tentukan:
1. Apa pain points mereka? (based on interaction history)
2. Apa yang mereka butuh? (infer dari company profile)
3. Campaign angle apa yang paling effective?

Output:
{
  "campaign_theme": "theme name",
  "value_proposition": "what we're offering",
  "target_pain_point": "their problem",
  "cta": "specific call to action",
  "success_metrics": ["metric1", "metric2"]
}
"""
Output: Campaign strategy
```

**STEP 3: OpenAI Email Copy Generation**
```
Model: GPT-4o
Input: Campaign strategy dari STEP 2
For each lead segment:
Prompt:
"""
Generate email untuk campaign theme: {campaign_theme}
Target audience: {segment_name} (e.g., "Tech Directors at E-commerce companies")

Email structure:
1. Subject line: 40-60 characters, action-oriented
2. Preheader: 40-80 chars, teaser dari main message
3. Body:
   - Opening: Personal touch jika possible (nama, company)
   - Hook: Relevant pain point atau opportunity
   - Value: Apa yang kami offer & why it matters
   - Proof: Social proof, case study, atau stat
   - CTA: Clear, action-oriented
   - Signature: Professional
4. P.S.: Additional motivation atau offer

Requirements:
- Tone: Professional but personable
- Length: 200-300 words
- Include: Clear CTA button
- Format: HTML-friendly
- Mobile-optimized: Short paragraphs, clear structure
- Language: Indonesian (with eng terms jika natural)

Output: Complete email template
"""
Output: Email draft
```

**STEP 4: A/B Test Configuration**
```
Version A: Subject line angle 1 (benefit-focused)
Version B: Subject line angle 2 (curiosity-focused)

Example:
A: "Tingkatkan efisiensi operasional 40% dengan AI automation"
B: "Apa yang PT. Tokopedia lakukan untuk automasi?"

Segment: Split leads 50-50 untuk A/B test
Track: Open rate, click rate, conversion rate untuk setiap version
```

**STEP 5: Personalization Engine (Optional - untuk premium campaigns)**
```
If personalization required:
Use Google Sheets data + Gemini untuk generate personal touches:
- Name insertion: {first_name}
- Company reference: {company_name}
- Relevant case study: Based on their industry
- Custom CTA: Based on their job role

Output: Individualized email per lead
```

**STEP 6: Send Schedule**
```
Tool: Gmail API integration
Schedule:
- Tuesday 10:00 WIB: Send Version A (50% leads)
- Tuesday 10:30 WIB: Send Version B (50% leads)
Spacing: Avoid spam issues (not all at once)

Log to Google Sheets:
- Columns: Lead_Email, Version_Sent, Send_Time, Open_Time, Click_Time
```

**STEP 7: Follow-up Automation**
```
Trigger: After 3 days (jika tidak ada response)
Action: Send follow-up email

Follow-up content:
"""
Hi {name},

Belum sempat baca email saya minggu lalu?
Tidak apa, sering terjadi inbox overload! 😊

Singkat saja - kami punya solusi untuk {pain_point}.
Cocok untuk {company_type} seperti {company_name}.

Mau coba demo gratis 30 menit? [BOOK DEMO]

Atau kalau kurang fit, tidak apa. Kami tidak aggressive!

Regards,
Direktur Marketing
PT. Arunika
"""
```

**STEP 8: Performance Report**
```
Trigger: Friday 17:00 WIB (after full week tracking)
Metrics:
- Total sends: X emails
- Open rate: X% (target >20%)
- Click rate: X% (target >5%)
- Conversion rate: X% (target >1%)
- A/B winner: Version A atau B
- Top performing subject line

Report to: direktur.marketing@arunika2045.com
Format: Email + embedded data visualization
Next action: Iterate untuk minggu depan
```

### Success Metrics:
- Email delivery rate: >98%
- Open rate: >20% (good untuk cold outreach)
- Click rate: >5%
- Conversion rate: >1% (demo booked, proposal sent, dll)
- Cost per email: < $0.01 (AI automation)

---

## WORKFLOW 3: DAILY INVOICE PROCESSING
**Instance:** Cowork Finance & Operations  
**Model:** Gemini (OCR), Claude (validation/decision), OpenAI (reporting)  
**Trigger:** Email received dengan attachment  

### Configuration:

```
WORKFLOW NAME: Invoice-Processing-Automation
FREQUENCY: Continuous (triggered by email)
INPUT: Invoice PDF/image attachment
OUTPUT: Structured data → Google Sheets + Approval email
```

### Step-by-Step Flow:

**STEP 1: Email Trigger & Attachment Detection**
```
Trigger: New email received
Filter:
  - From: Known vendors (approved vendor list)
  - Subject: contains "invoice" OR "bill" OR "tagihan"
  - Attachment: PDF or image file

Action: Download attachment, validate file type, extract to processing queue
```

**STEP 2: Gemini Document Processing**
```
Model: Gemini 2.0 Vision (dengan Document AI capability)
Input: Invoice image/PDF
Prompt:
"""
Extract informasi dari invoice ini dengan sangat teliti:

1. HEADER INFO:
   - Vendor name: [exact]
   - Vendor address: [exact]
   - Vendor tax ID: [exact]
   - Invoice number: [exact]
   - Invoice date: [format: YYYY-MM-DD]

2. PAYMENT INFO:
   - Currency: [IDR/USD/etc]
   - Subtotal: [number]
   - Tax rate: [number]
   - Tax amount: [number]
   - Total amount: [number]
   - Due date: [format: YYYY-MM-DD]

3. DETAIL ITEMS:
   For each line item:
   - Item description: [exact]
   - Quantity: [number]
   - Unit price: [number]
   - Amount: [number]

4. PAYMENT TERMS:
   - Payment method: [bank transfer/credit card/etc]
   - Bank account: [partial, last 4 digits only]
   - PO reference (jika ada): [number]

5. DATA QUALITY CHECK:
   - Handwritten or printed: [printed/handwritten/mixed]
   - Image quality: [clear/blurry/poor]
   - Suspicious flags: [any irregularities]

Output JSON format dengan EXACT values dari dokumen.
JANGAN estimate atau assume nilai - extract EXACTLY sebagaimana tertulis.
"""

Output: Structured JSON dengan semua fields
Confidence score: How confident AI dalam extraction (0-100%)
```

**STEP 3: Validation Against PO & Master Vendor Data**
```
Model: Claude 3.5 Sonnet
Input: Extracted invoice data dari STEP 2
Cross-reference:
  - Master vendor list (Google Sheets "Approved_Vendors")
  - Purchase orders (Google Sheets "PO_Register")
  - Historical invoice patterns

Validation rules:
1. Vendor blacklist check: Is vendor in suspended/blacklist?
2. PO match: Apakah ada PO matching? 
   - If yes: verify PO amount vs invoice amount (tolerance ±5%)
   - If no: flag untuk approval
3. Amount reasonableness: 
   - Compare dengan historical invoices dari vendor ini
   - Flag jika significantly different (>20% variance)
4. Date validation:
   - Invoice date should be <= today
   - Due date should be > invoice date
5. Tax validation:
   - Tax rate should match Indonesia rate (typical 0%, 5%, 10%)
   - Tax amount = subtotal × tax rate (verify calculation)
6. Item validation:
   - Item descriptions should match PO (if available)
   - Quantity should match PO

Prompt untuk Claude:
"""
Validate invoice berdasarkan criteria di atas.
Output decision:
- Status: APPROVED / FLAG_MINOR / FLAG_CRITICAL / REJECT
- Confidence: 0-100%
- Issues: List any issues found
- Recommendation: What to do next
- Auto-pay eligible: Yes/No (based on amount & risk)
"""
```

**STEP 4: Amount-Based Routing**
```
Decision Tree:

IF amount < IDR 5,000,000 AND status = APPROVED AND auto-pay eligible:
  → STEP 5: Auto-approval & payment scheduling
  
ELSE IF amount >= IDR 5,000,000 OR status = FLAG_MINOR:
  → STEP 6: Manual review approval needed
  
ELSE IF status = FLAG_CRITICAL OR REJECT:
  → STEP 7: Alert to Finance Director
```

**STEP 5: Auto-Approval & Payment (untuk small amounts)**
```
Condition: Amount < IDR 5M, all validations passed
Action:
1. Record invoice to Google Sheets "Invoice_Log"
   - Date: today
   - Vendor: from invoice
   - Amount: total amount
   - Status: AUTO-APPROVED
   - Processing_Time: < 2 minutes
   
2. Create payment schedule:
   - Due date = invoice due date
   - Amount = total (including tax)
   - Method = bank transfer (default)

3. Notification:
   - Auto send email to vendor: "Invoice received and approved"
   - Log entry to Google Sheets: timestamp, amount, invoice#
   - Weekly summary: aggregate all auto-approved invoices
```

**STEP 6: Manual Approval (untuk flagged items)**
```
Condition: Amount >= IDR 5M OR flag_minor OR no matching PO
Action:
1. Create approval email template

Email to: direktur.finance@arunika2045.com
Subject: "Invoice Approval Required - [Vendor Name] - IDR [Amount]"

Content:
---
VENDOR: [Vendor]
INVOICE #: [Invoice#]
AMOUNT: IDR [Amount]
DUE DATE: [Date]

EXTRACTED DATA:
[All data dari STEP 2 in readable format]

VALIDATION RESULTS:
- PO Match: [Yes/No] [PO#]
- Amount vs history: [Variance %]
- Tax calculation: [Correct/Incorrect]
- Flags: [List any]

RECOMMENDATION: [APPROVED/NEEDS REVIEW/REJECT]
CONFIDENCE: [X]%

ACTION REQUIRED:
- [APPROVE] - Process payment immediately
- [EDIT] - Correct data & approve
- [REQUEST INFO] - Ask vendor for clarification
- [REJECT] - Decline invoice (specify reason)

REPLY BY: [2 hours jika urgent, 1 hari untuk normal]
---

2. Wait for Direktur response (max 2 hours for urgent)
3. Process response:
   - If APPROVE: go to payment scheduling
   - If EDIT: update Google Sheets, process
   - If REQUEST: send email ke vendor
   - If REJECT: create credit memo, notify vendor
```

**STEP 7: Critical Flag Alert**
```
Condition: Flag_critical detected (potential fraud/duplicate/etc)
Action:
1. IMMEDIATE alert to Direktur Keuangan via:
   - Email (urgent flag)
   - Slack (if connected)
   - Phone call (if amount very large)

2. Invoice placed in "HOLD" status
3. Do NOT process payment automatically
4. Flag details:
   - What triggered the flag
   - Risk level assessment
   - Recommended action
5. Await Direktur instruction
```

**STEP 8: Payment Processing**
```
Condition: Invoice approved (either auto or manual)
Action:
1. Extract payment details:
   - Vendor bank account
   - Amount to transfer
   - Reference (invoice number)
   
2. Create payment instruction:
   - In: Bank transfer system atau accounting software
   - Amount: Total amount
   - Beneficiary: Vendor bank details
   - Description: "Invoice [#] - PT. Arunika"
   
3. Schedule:
   - Default: 1-2 days sebelum due date
   - Can be manual reviewed before final transfer
   
4. Confirmation:
   - Record transfer details ke Google Sheets
   - Archive invoice document
   - Send confirmation email to vendor (optional)
```

**STEP 9: Reconciliation & Reporting**
```
Daily report (15:00 WIB):
- Invoices processed: [X]
- Auto-approved: [X]
- Needs manual review: [X]
- Flagged for issues: [X]
- Total amount: [IDR X]
- Average processing time: [X minutes]
- Error rate: [X%]

Weekly report (Friday 17:00):
- Compare processing time vs. manual (should be 20× faster)
- Cost savings: # of automated invoices × time saved × hourly rate
- Vendor performance: Which vendors have most flags?
- Opportunities: Where to improve automation
```

### Success Metrics:
- Processing time: Target <2 minutes (auto) vs 30 min (manual)
- Accuracy: >99% correct extraction
- Auto-approval rate: Target 80% (less manual work)
- Fraud detection: Alert rate untuk suspicious items
- Cost savings: X hours/week × hourly rate

---

## WORKFLOW 4: MONTHLY ACCOUNT RECONCILIATION
**Instance:** Cowork Finance & Operations  
**Model:** Gemini (data extraction), Claude (analysis & reconciliation)  
**Trigger:** Every 15th of month  

### Configuration:

```
WORKFLOW NAME: Monthly-GL-Reconciliation
FREQUENCY: Every 15th of month at 14:00 WIB
DURATION: Can take 2-4 hours (complex process)
OUTPUT: Reconciliation report + unreconciled items list
```

### Step-by-Step Flow:

**STEP 1: Data Gathering**
```
Trigger: 15th of month, 14:00 WIB
Action: Pull data from multiple sources

Source 1: General Ledger (GL)
- From: Accounting software (e.g., QuickBooks, Jurnal.app)
- Extract: All GL accounts for current month
- Format: CSV with: Account, Account_Name, Debit, Credit, Balance

Source 2: Bank Statements
- From: Bank API or manual download
- Extract: All transactions for current month
- Format: CSV with: Date, Description, Amount, Balance

Source 3: Subledgers
- AR Aging (Accounts Receivable): Customer balances
- AP Aging (Accounts Payable): Vendor balances
- Fixed Assets: Depreciation tracking
- Payroll: Employee accruals

Data Validation:
- Check file formats
- Verify no missing data
- Validate date ranges (should all be current month)
- Output: Consolidated data ready for reconciliation
```

**STEP 2: Gemini Document Extraction (jika ada manual records)**
```
If bank statement in PDF format:
Model: Gemini 2.0 Vision
Process: Convert PDF to structured data
Output: Same format sebagai automated extract
```

**STEP 3: Claude Reconciliation Analysis**
```
Model: Claude 3.5 Sonnet
Input: GL, Bank, Subledgers data dari STEP 1

Reconciliation logic:

A. CASH RECONCILIATION (GL Cash account vs. Bank statement)
   1. Start with GL cash balance
   2. Add: Deposits in transit (on GL but not on bank yet)
   3. Subtract: Outstanding checks (on bank but not on GL yet)
   4. Should equal: Bank statement balance
   
   If NOT equal:
   - Identify discrepancy amount
   - List unmatched transactions
   - Flag for investigation

B. ACCOUNTS RECEIVABLE
   1. Sum all customer invoices (from GL AR subledger)
   2. Subtract: Payments received
   3. Should equal: GL AR balance
   
   Check:
   - AR aging: which customers haven't paid?
   - Overdue analysis: >60 days overdue?
   - Allowance for doubtful accounts adequate?

C. ACCOUNTS PAYABLE
   1. Sum all vendor invoices (from GL AP subledger)
   2. Subtract: Payments made
   3. Should equal: GL AP balance
   
   Check:
   - AP aging: which vendors unpaid?
   - Early payment discount opportunities?
   - Accrued expenses not yet invoiced?

D. FIXED ASSETS
   1. Verify assets recorded match physical location
   2. Check depreciation calculation correct
   3. Identify fully depreciated assets (for retirement)
   4. Verify accumulated depreciation matches GL

E. PAYROLL ACCRUALS
   1. Verify accrued salaries match employee count
   2. Check benefits accrual (health, CPP, etc.)
   3. Verify payroll tax withholding

Prompt untuk Claude:
"""
Perform full reconciliation analysis based on data provided.
For each account/category:
1. Identify balance per GL
2. Identify balance per supporting documents
3. Calculate variance
4. Explain variance (timing differences, errors, etc.)
5. Assess if variance is acceptable

Output format:
{
  "account": "name",
  "gl_balance": X,
  "actual_balance": Y,
  "variance": Z,
  "variance_explanation": "...",
  "status": "RECONCILED / RECONCILED_WITH_TIMING_DIFFERENCE / UNRECONCILED",
  "action_required": "None / Investigate / Adjust",
  "risk_level": "Low / Medium / High"
}

Also identify:
- Most critical unreconciled items (highest dollar amount)
- Pattern analysis (recurring issues?)
- Recommendations for prevention
"""

Output: Detailed reconciliation analysis
```

**STEP 4: Exception Handling**
```
For each unreconciled item:

If variance < IDR 500K (small):
  → Likely timing difference
  → Recommend: Review next month transactions
  
If variance IDR 500K - 5M (medium):
  → Could be data entry error
  → Recommend: Manual review of journal entries
  
If variance > IDR 5M (large):
  → Could be fraud or system error
  → Recommend: Investigate immediately
  → Alert: Send to Direktur Finance

Types of variances to investigate:
1. Timing differences: Cash in transit, outstanding checks
2. Data entry errors: Typos, duplicate entries
3. Unrecorded transactions: Item recorded in GL but not subledger
4. Accrual issues: Month-end adjustments missing
5. Currency differences: FX gains/losses not accounted
6. System issues: Data corruption or sync failures
```

**STEP 5: Reconciliation Report Generation**
```
OpenAI: Generate executive summary
Claude: Generate detailed analysis

Report structure:

EXECUTIVE SUMMARY
- Overall GL reconciliation status
- Total variance amount
- Number of unreconciled items
- Risk assessment

DETAILED FINDINGS
For each account:
- Balance reconciliation
- Key variances
- Root cause analysis
- Recommendations

OUTSTANDING ITEMS
- List of items still requiring follow-up
- Owner: who will investigate
- Due date: by when must be resolved

RECOMMENDATIONS
- Process improvements
- Control enhancements
- Training needs (if error patterns detected)

APPROVALS
- Prepared by: [AI]
- Reviewed by: Direktur Finance
- Approved by: CFO or Finance Director
```

**STEP 6: Distribution & Follow-up**
```
Send report to:
1. Direktur Finance & Operations
2. CFO (if applicable)
3. Accounting team (for follow-up)
4. Archive in Google Drive "Finance_Reports"

Follow-up tasks:
1. Assign investigation to staff (jika ada unreconciled items)
2. Set deadline untuk resolution (usually by 25th of month)
3. Schedule verification meeting
4. Document all adjustments made

Next month reconciliation will include:
- Verification that prior month issues resolved
- Pattern analysis of recurring items
```

### Success Metrics:
- Reconciliation completion: Target <4 hours (vs 1-2 days manual)
- Accuracy: 99%+ (minimal unreconciled items)
- Time saved: 4-8 hours per month per accountant
- Early detection: Fraud/errors caught same month (vs next month)

---

## WORKFLOW 5: WEEKLY SALES PIPELINE REVIEW
**Instance:** Cowork Central Hub  
**Model:** Claude (analysis & insights), Gemini (data visualization)  
**Trigger:** Every Monday 09:00 WIB  

### Configuration:

```
WORKFLOW NAME: Weekly-Sales-Pipeline-Review
FREQUENCY: Every Monday 09:00 WIB
INPUT: Sales pipeline data (CRM export)
OUTPUT: Strategic insights + action recommendations
```

### Step-by-Step Flow:

**STEP 1: Data Export from CRM**
```
Source: HubSpot / Pipedrive / other sales CRM
Extract:
- All open opportunities
- Deal stage
- Deal amount
- Expected close date
- Last activity date
- Probability
- Owner/salesperson

Filter:
- Status: Open (exclude closed deals)
- Pipeline: All sales pipelines
- Date range: Current month forward

Output: CSV or direct API pull into Google Sheets
```

**STEP 2: Claude Pipeline Analysis**
```
Model: Claude 3.5 Sonnet
Input: Pipeline data

Analysis dimensions:

1. FORECAST ANALYSIS
   - Sum probable deal value = weighted by probability
   - Forecast for: This month, next month, quarter
   - Compare: vs. target/quota
   - Gap analysis: How much more do we need?

2. VELOCITY ANALYSIS
   - Time in each stage: How long deals take
   - Stuck deals: Same stage >30 days (red flag)
   - Fast movers: Moving stage <1 week (positive signal)
   - Predict: Close date accuracy assessment

3. DEAL HEALTH ANALYSIS
   - Deal scoring: Risk assessment per deal
   - Red flags: No activity >7 days? Probability decreased?
   - Competition threats: Any deals at risk?
   - Win probability: Historical accuracy of estimates?

4. SALESPERSON PERFORMANCE
   - By person: # of deals, avg deal size, pipeline coverage
   - Quota analysis: On track? Behind? Ahead?
   - Activity level: # of calls/emails per day (productivity)
   - Coaching opportunities: Where to help?

5. PIPELINE HEALTH
   - Ratio analysis:
     * New leads vs closed deals (should be >3:1)
     * Pipeline:Quota (should be >3x)
     * Avg deal size vs forecast
   - Growth trend: Pipeline growing? Shrinking?
   - Churn analysis: Lost deals - why?

Prompt untuk Claude:
"""
Analyze sales pipeline dengan fokus ke actionable insights.
Provide:
1. This month forecast vs target (variance analysis)
2. Top 5 deals at risk (high value but low probability of closing)
3. Top 5 deals most likely to close (high probability, ready to close)
4. Individual salesperson recommendations (who needs help/coaching)
5. Pipeline gaps (what's missing in pipeline for future months)
6. Strategic recommendations (what to do this week to improve)

Focus pada: What should the VP Sales DO THIS WEEK to improve outcomes?
Not: Just reporting numbers, but actionable insights.
"""

Output: Strategic insights + 3-5 recommended actions
```

**STEP 3: Gemini Data Visualization**
```
Model: Gemini 2.0
Task: Create visual summary of pipeline

Visualizations to create:
1. Pipeline funnel: Deals by stage (visual width = deal count)
2. Forecast chart: This month vs target (bar chart)
3. Deal health heatmap: Color coded by risk
4. Salesperson scorecard: Performance metrics per person

Output: Suggestions untuk dashboard design
```

**STEP 4: Action Item Generation**
```
Based on analysis, generate specific action items:

Format:
[PRIORITY] ACTION - Owner - Deadline

Examples:
[HIGH] Call customer ABC Corp (deal at risk, $5M, closing this week) - John - Today
[MEDIUM] Schedule pipeline coaching with Sales Rep X (behind quota) - Manager - Wed
[MEDIUM] Follow up on 3 proposals sent last week - All sales - Fri
[LOW] Update competitor intel for Deal XYZ - Marketing - Next Mon

Assign to: Respective sales reps, manager, or marketing
Track: In shared task list / CRM
Review: Next week pipeline review
```

**STEP 5: Report & Distribution**
```
Email to: VP Sales / Sales Director
Subject: "Weekly Pipeline Review - Insights & Actions"

Content:
- Executive summary (2-3 sentences)
- This week forecast vs target
- Top risks & opportunities
- Recommended actions
- Data attachments
- Dashboard link

Meeting option:
- If report shows significant variance: Schedule 30-min call
- Format: Share screen, discuss top actions, align on next steps
```

### Success Metrics:
- Forecast accuracy: Actual closes vs. predicted (target: 80%+ accuracy)
- Deal velocity: Avg time to close (track trending)
- Close rate: % of pipeline that closes (benchmark: 15-20%)
- Quota attainment: $ closed vs. $ target
- Insights utilization: % of recommendations acted on

---

## WORKFLOW 6: DAILY STANDUP GENERATION
**Instance:** Cowork Central Hub  
**Model:** Claude (synthesis)  
**Trigger:** Every morning 08:00 WIB  

### Configuration:

```
WORKFLOW NAME: Daily-Standup-Generation
FREQUENCY: Every weekday 08:00 WIB
OUTPUT: Team standup summary ready to present in meeting
```

### Step-by-Step Flow:

**STEP 1: Data Collection**
```
Gather from all 3 department Coworks:
- Workflows completed yesterday
- Errors or issues encountered
- Metrics: invoices processed, posts generated, leads contacted
- Blockers or risks
- Today's planned activities

Data sources:
- Cowork execution logs
- Google Sheets tracking
- Email alerts
- Error logs
```

**STEP 2: Claude Synthesis**
```
Model: Claude 3.5 Sonnet
Input: Aggregated daily data

Task: Synthesize into standup format
```

Format:
```
STANDUP - {DATE}

MARKETING DEPARTMENT
Yesterday:
- 3 social media posts generated & posted (LinkedIn, Instagram, Twitter)
- 1 email campaign sent (50 leads, 18% open rate)
- Engagement metrics stable

Today:
- Weekly content calendar planning
- Design briefs for month 2 campaigns
- Social media monitoring & response

Blockers: None

FINANCE DEPARTMENT
Yesterday:
- 27 invoices processed automatically
- 3 invoices flagged for review
- Account reconciliation 80% complete

Today:
- Complete monthly reconciliation
- Processing B2B vendor payments
- Quarterly budget review meeting 2 PM

Blockers: Waiting on 2 invoices from Vendor ABC

OPERATIONS DEPARTMENT
Yesterday:
- 15 documents processed & filed
- 5 calendar events auto-scheduled
- No critical issues

Today:
- HR onboarding process optimization
- Document management audit
- Compliance reporting update

Blockers: None

AI AUTOMATION STATUS
- Total tasks automated: 45
- Manual interventions: 3 (all resolved)
- API costs: $18.50/day (on budget)
- System health: 99.2% uptime

WEEKLY METRICS (YTD)
- Automation rate: 87.2% (target: 87.5%)
- Time saved: 42 hours
- Error rate: 0.8%
```

**STEP 3: Presentation Format**
```
Send as:
1. Email (text + attachment)
2. Slack message (if channel exists)
3. PDF (for printing/archiving)
4. Calendar invite (for standup meeting)

Include:
- Metrics dashboard link
- Full logs (for those who want details)
- Yesterday's action items (completed? completed ✓ / at risk)
```

### Success Metrics:
- Standup generation time: <5 minutes (automatic)
- Information accuracy: All items verified
- Team satisfaction: >90% prefer this summary vs. manual collection
- Time saved: 30 min/day × team size = significant

---

## WORKFLOW 7: MONTHLY AI PERFORMANCE REPORT
**Instance:** Cowork Central Hub  
**Model:** Claude (analysis), OpenAI (executive summary)  
**Trigger:** Last day of month 16:00 WIB  

### Configuration:

```
WORKFLOW NAME: Monthly-AI-Performance-Report
FREQUENCY: Last day of every month 16:00 WIB
OUTPUT: Executive report on AI transformation progress vs. 87.5% target
```

### Step-by-Step Flow:

**STEP 1: Data Aggregation**
```
Collect metrics dari all 4 Cowork instances:
- Marketing: Posts/week, engagement, cost/post
- Finance: Invoices processed, reconciliation accuracy, time saved
- Operations: Documents processed, errors, automation %
- Central Hub: Overall system health, uptime, costs

Month-to-month comparison:
- Current month vs. previous month
- Current month vs. 12-month average
- Trend analysis: Improving? Degrading?
```

**STEP 2: Claude Analysis**
```
Model: Claude 3.5 Sonnet

Analyze:
1. PROGRESS TOWARD 87.5% AUTOMATION TARGET
   - Current automation rate: X%
   - Progress vs. target: On track / Behind / Ahead
   - Estimated reach date for target

2. FINANCIAL ANALYSIS
   - Total AI costs (Claude + OpenAI + Gemini): $X/month
   - Estimated human cost if all manual: $Y/month
   - Savings: $(Y-X) = benefit
   - ROI: (Y-X) / X × 100%
   - Payback period: Months to break even

3. OPERATIONAL METRICS
   - Time saved: X hours/month
   - Accuracy: Y% (target >99%)
   - Error rate: Z% (target <1%)
   - System uptime: A% (target >99%)

4. DEPARTMENTAL PERFORMANCE
   Per department: Improvements, challenges, recommendations

5. PROBLEM AREAS
   - Workflows below expectation: why?
   - Integration issues: any?
   - Staff adoption: any resistance?
   - Training gaps: what's needed?

6. OPPORTUNITIES
   - New workflows to automate
   - Model improvements: try new Claude version?
   - Integration additions: new tools?
   - Scaling recommendations

Output: Comprehensive analysis document
```

**STEP 3: OpenAI Executive Summary**
```
Model: GPT-4o
Input: Claude analysis

Task: Write concise 1-page executive summary
For: Direktur Utama (CEO) level

Content:
- One sentence summary (the TL;DR)
- Key metrics & status
- Highlights: What went well?
- Challenges: What needs attention?
- Next month focus: Top 3 priorities
```

**STEP 4: Report Distribution**
```
Email to: Direktur Utama + department heads
Subject: "Monthly AI Transformation Progress Report - [Month]"

Attachments:
- Executive summary (1 page, PDF)
- Detailed analysis (full report)
- Data visualization (charts)
- ROI calculation (spreadsheet)
- Appendix: Detailed logs

Schedule: 30-min presentation meeting (optional)
Agenda:
  - Highlights & achievements
  - Challenges & solutions
  - Next month priorities
  - Q&A
```

### Success Metrics:
- Report accuracy: Verified data
- Leadership adoption: % who read it
- Decision impact: Actions taken based on recommendations
- Continuous improvement: % recommendations implemented month-to-month

---

## IMPLEMENTATION TIMELINE

### Week 1-2: Setup & Testing
- [ ] Setup all 4 Cowork instances
- [ ] Create all API keys
- [ ] Test Workflow 1 (Social Media) - manually
- [ ] Test Workflow 3 (Invoice Processing) - with sample data
- [ ] Staff training on how to use each system

### Week 3: Soft Launch
- [ ] Workflow 1 (Social Media) → production
- [ ] Workflow 3 (Invoice Processing) → production
- [ ] Workflow 4 (Reconciliation) → first run
- [ ] Monitor closely, fix issues

### Week 4: Expansion
- [ ] Add Workflow 2 (Email Campaigns)
- [ ] Add Workflow 5 (Sales Pipeline Review)
- [ ] Add Workflow 6 (Daily Standup)
- [ ] Add Workflow 7 (Monthly Report)

### Month 2+: Optimization & Scaling
- [ ] Additional workflows as identified
- [ ] Model improvements & A/B testing
- [ ] New integrations
- [ ] Increase automation % toward 87.5% target

---

**END OF WORKFLOW SPECIFICATIONS**

This document is a living guide. Update as:
- New workflows added
- Processes improved
- Lessons learned
- New PT. Arunika business needs identified

Document Version: 1.0
Last Updated: 2026-05-08
Next Review: 2026-06-08 (post-deployment)
