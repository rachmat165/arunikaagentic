# ⚡ QUICK START - COWORK INTEGRATION

**Time Required:** 5 minutes  
**Difficulty:** Beginner-friendly  
**Status:** Ready to execute

---

## 🎯 WHAT YOU'LL ACCOMPLISH

By the end of this guide, you will:
✅ Start the dashboard with Cowork integration  
✅ See all 12+ workflows  
✅ Execute workflows manually  
✅ Monitor workflow execution in real-time  
✅ View performance statistics  

---

## STEP 1: Open Terminal (1 minute)

### Windows
```
1. Press Windows Key + R
2. Type: cmd
3. Press Enter
```

### Mac/Linux
```
1. Open Terminal application
2. Or press Ctrl+Alt+T
```

---

## STEP 2: Navigate to Project (1 minute)

```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"
```

**Or if using Mac/Linux:**
```bash
cd ~/ArunikaTeknologiGlobal/Project/ArunikaAgentic/ArunikaAgenticAi
```

---

## STEP 3: Start Dashboard (2 minutes)

```bash
npm run dev
```

You should see:
```
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## STEP 4: Open in Browser (1 minute)

Click this link or paste in browser:
```
http://localhost:3000
```

You should see the dashboard with:
- Executive Summary (top)
- KPI Cards
- 3D Visualization
- Performance Trends
- **Cowork Workflows** (scroll down to see!)

---

## STEP 5: Execute Workflows

### Option A: Run All Daily Workflows (Recommended for First Time)
```
1. Scroll to "Cowork Workflows" section (bottom)
2. Click green button: "Run Daily Workflows"
3. Wait 2-5 seconds for execution
4. See summary: "X successful, Y failed"
```

This executes 4 daily workflows:
- Daily Social Media Generation
- Expense Report Automation
- Bank Reconciliation
- Daily Briefing

### Option B: Execute Individual Workflow
```
1. In Cowork Workflows section, find any workflow card
2. Scroll through the cards to find a workflow
3. Click "Execute Now" button on any workflow
4. See status change: Pending → Running → Completed
5. Check statistics update in real-time
```

### Option C: Use API (Advanced)
```bash
curl -X POST http://localhost:3000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d '{"workflowId": "daily-briefing", "priority": "high"}'
```

---

## 📊 WHAT YOU'LL SEE

### Cowork Workflows Dashboard Shows:

**Header:**
- Total workflows: 12+
- Refresh button
- Run Daily Workflows button

**Filters:**
- All Instances
- Arunika-Central-Hub
- Arunika-Sales-Marketing
- Arunika-Finance-Operations
- Arunika-CEO-Dashboard

**Each Workflow Card Shows:**
```
┌─────────────────────────────────────┐
│ Daily Social Media Content Generation │
│ Auto-generate posts for LinkedIn,    │
│ Instagram, Twitter                   │
├─────────────────────────────────────┤
│ ⏰ Daily at 09:00 WIB                │
├─────────────────────────────────────┤
│ Success Rate: 97.6%                  │
│ Executions: 42                       │
│ Avg Duration: 45.2s                  │
│ Last: May 10, 2026 at 09:00 AM      │
├─────────────────────────────────────┤
│ ✅ Active                            │
│                                      │
│ [  Execute Now  ]                   │
└─────────────────────────────────────┘
```

**Overall Performance Summary:**
```
Total Workflows: 12+
Successful: XXX
Failed: XX
Success Rate: XX.X%
Avg Duration: XXs
```

---

## 🔄 WORKFLOW CATEGORIES

### Sales & Marketing (4 workflows)
- Daily Social Media Content Generation
- Weekly Email Campaign Automation
- Lead Nurturing Automation
- Monthly Content Calendar Generation

### Finance & Operations (5 workflows)
- Invoice Processing
- Expense Report Automation
- Payroll Processing
- Bank Reconciliation
- Tax Compliance Reporting

### Executive & Coordination (3 workflows)
- Daily Briefing Aggregation
- Weekly Performance Review
- Monthly Financial Summary
- Quarterly Business Review

---

## ✅ VERIFICATION

After completing steps 1-5, verify:

1. **Dashboard Loads:** Can you see the main dashboard?
   - [ ] Yes, main page loads
   - [ ] Executive Summary visible
   - [ ] KPI cards showing

2. **Cowork Section Visible:** Scroll to bottom, do you see "Cowork Workflows"?
   - [ ] Yes, section visible
   - [ ] Workflow cards showing
   - [ ] Buttons clickable

3. **Workflows Display:** Can you see workflow cards?
   - [ ] 12+ workflow cards visible
   - [ ] Each shows name & description
   - [ ] Statistics displaying
   - [ ] Execute buttons present

4. **Execution Works:** Did you successfully execute a workflow?
   - [ ] Clicked button
   - [ ] Status updated
   - [ ] Completed or error shown
   - [ ] Stats refreshed

---

## 🚨 TROUBLESHOOTING

### Issue: Port 3000 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution 1: Kill Process**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Solution 2: Use Different Port**
```bash
PORT=3001 npm run dev
# Then visit: http://localhost:3001
```

### Issue: "Cannot find module" Error

**Error Message:**
```
Cannot find module '@/services/cowork-api'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

### Issue: Workflows Not Showing

**Possible Causes & Solutions:**
```
1. JavaScript error in console?
   → Press F12, check console tab
   → Reload page (Ctrl+F5)

2. Component not rendering?
   → Try refresh (Ctrl+F5)
   → Check browser console for errors

3. API endpoint not responding?
   → Check if server is running
   → Look for error messages

4. Scroll to bottom not visible?
   → Try scrolling down more
   → Check if page is loading completely
```

---

## 📱 LAYOUT REFERENCE

```
┌─────────────────────────────────────────┐
│         DASHBOARD HEADER                │
│    Executive Summary • Period Toggle     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         KPI CARDS (4 cards)             │
│ Agents | Tasks | Costs | Success Rate   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  3D VISUALIZATION | TASKS & COSTS CARDS │
│  (Left 2/3)      | (Right 1/3)          │
├─────────────────────────────────────────┤
│  PERFORMANCE TRENDS                     │
├─────────────────────────────────────────┤
│  EXECUTIVE SUMMARY                      │
├─────────────────────────────────────────┤
│  COWORK WORKFLOWS SECTION  ← YOU ARE HERE
│  ┌───────────────────────────────────┐  │
│  │ Refresh | Run Daily Workflows     │  │
│  ├───────────────────────────────────┤  │
│  │ All Instances | Central Hub | ... │  │
│  ├───────────────────────────────────┤  │
│  │ [Workflow Card 1] [Workflow Card 2]  │
│  │ [Workflow Card 3] [Workflow Card 4]  │
│  │ [More cards...]                     │
│  ├───────────────────────────────────┤  │
│  │ Overall Performance Summary        │  │
│  │ [Stats: Total | Successful | etc] │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🎮 INTERACTIVE DEMO

### Try This Flow (2 minutes)

1. **Find the social-media-daily workflow card**
   - Scroll through workflow cards
   - Find one with "Social Media" in name
   - Note: It should show high success rate

2. **Click "Execute Now" button**
   - Button turns to "Running..."
   - Wait 1-2 seconds
   - Status changes to "Completed"

3. **Check the statistics**
   - Success Rate increases (or stays >90%)
   - Execution count increments
   - Last execution timestamp updates

4. **Refresh dashboard** (optional)
   - Click "Refresh" button
   - Statistics might update
   - New metrics appear

5. **View Overall Summary**
   - Look at bottom "Overall Performance"
   - See total count increase
   - Check success rate percentage

---

## 📞 NEXT STEPS

### What to Do Next

**Immediate (Now):**
- [ ] Start dashboard (npm run dev)
- [ ] View Cowork Workflows section
- [ ] Execute one workflow
- [ ] Verify it works

**Later Today:**
- [ ] Read COWORK_INTEGRATION_SETUP.md for details
- [ ] Review workflow schedule
- [ ] Check API endpoints
- [ ] Test different workflows

**This Week:**
- [ ] Setup daily automation
- [ ] Configure email notifications
- [ ] Review performance reports
- [ ] Adjust as needed

**Next Week:**
- [ ] Go live with automation
- [ ] Monitor 24/7
- [ ] Collect metrics
- [ ] Plan optimizations

---

## 📚 ADDITIONAL RESOURCES

### Documentation Files
- **COWORK_INTEGRATION_SETUP.md** - Complete setup guide (detailed)
- **COWORK_INTEGRATION_SUMMARY.md** - Features & capabilities summary
- **README.md** - General dashboard documentation
- **SETUP_GUIDE.md** - Dashboard setup instructions

### Key Files
- **services/cowork-api.ts** - Workflow definitions & API client
- **services/workflow-executor.ts** - Execution engine
- **components/cowork-workflows-dashboard.tsx** - Dashboard UI
- **app/api/workflows/** - API routes

---

## ✨ KEY FEATURES YOU NOW HAVE

✅ **12+ Automated Workflows**  
✅ **4 Cowork Instances Connected**  
✅ **Real-Time Monitoring**  
✅ **On-Demand Execution**  
✅ **Automatic Scheduling** (daily, weekly, monthly)  
✅ **Performance Statistics**  
✅ **Error Handling & Retry**  
✅ **Health Monitoring**  

---

## 🎉 YOU'RE DONE!

Congratulations! You now have:
- ✅ Dashboard running locally
- ✅ Cowork workflows integrated
- ✅ Ability to execute workflows
- ✅ Real-time monitoring
- ✅ Complete automation system

**Next: Check the documentation for advanced features!**

---

**Duration:** 5-10 minutes total  
**Status:** Ready to use  
**Support:** corsec@arunika2045.com

Last Updated: May 10, 2026
