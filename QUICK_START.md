# Quick Start Guide

**Get the Arunika Agentic AI Dashboard Running with Real Data - 5 Minutes**

---

## 1. Start the Development Server

```bash
cd "P:\ArunikaTeknologiGlobal\Project\ArunikaAgentic\Arunika Agentic Ai"
npm install
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

---

## 2. Open Dashboard in Browser

Go to: **http://localhost:3000**

✅ You should see dashboard with sample execution data already loaded

---

## 3. Verify Execution Tracking Works

### Test API Endpoint

```bash
curl http://localhost:3000/api/workflows/stats
```

You should see JSON response with execution statistics.

### Send Test Execution Report

```bash
curl -X POST http://localhost:3000/api/workflows/report-execution \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "test-workflow",
    "taskId": "test-123",
    "status": "completed",
    "duration": 2500,
    "outputs": {"message": "Test successful"}
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Execution recorded for test-workflow",
  "timestamp": "2026-05-10T12:30:00Z"
}
```

### Refresh Dashboard

Refresh browser (F5) - you should see new execution in dashboard!

---

## 4. Integrate Your Scheduled Tasks

For each scheduled task in your Cowork space that you want to track:

### Add This Function to Your Task

```typescript
async function reportToDashboard(config) {
  try {
    const response = await fetch(
      'http://localhost:3000/api/workflows/report-execution',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: config.workflowId,
          taskId: `${config.workflowId}-${Date.now()}`,
          status: config.status,
          duration: config.duration,
          outputs: config.outputs,
          error: config.error,
          executedAt: new Date().toISOString()
        })
      }
    );
    
    if (!response.ok) {
      console.error('[DASHBOARD] Report failed:', await response.text());
    } else {
      console.log('[DASHBOARD] ✓ Execution reported');
    }
  } catch (error) {
    console.error('[DASHBOARD] Error:', error.message);
  }
}
```

### Call at End of Task

```typescript
// Your task logic...
const startTime = Date.now();

try {
  // Do work...
  const result = await doSomething();
  
  // Report success
  await reportToDashboard({
    workflowId: "my-task-name",
    status: "completed",
    duration: Date.now() - startTime,
    outputs: { result }
  });
} catch (error) {
  // Report failure
  await reportToDashboard({
    workflowId: "my-task-name",
    status: "failed",
    duration: Date.now() - startTime,
    error: error.message
  });
}
```

---

## 5. Watch Dashboard Update in Real-Time

After you run a scheduled task:
1. Refresh dashboard browser tab
2. You should see execution appear in stats
3. Success rate and average duration will update automatically

---

## Important Files

| File | Purpose |
|------|---------|
| `/services/execution-tracker.ts` | Tracks executions locally |
| `/app/api/workflows/report-execution/route.ts` | Receives reports from tasks |
| `/app/api/workflows/stats/route.ts` | Provides data to dashboard |
| `/.cowork-data/execution-history.json` | Local storage of execution data |

---

## What You Get

✅ **Real execution tracking** - Dashboard shows actual task performance  
✅ **Automatic persistence** - Data stored locally, survives restarts  
✅ **Sample data** - Dashboard populated immediately with test data  
✅ **Zero configuration** - No external services needed  
✅ **Easy integration** - 5 lines of code to report executions  

---

## Verify Everything Works

### Check 1: Server Started
Look for "ready - started server" in terminal

### Check 2: Dashboard Loads
Visit http://localhost:3000 and page loads without errors

### Check 3: API Responds
```bash
curl http://localhost:3000/api/workflows/stats | grep success
```
Should return: `"success": true`

### Check 4: Data File Exists
```bash
ls -la .cowork-data/execution-history.json
```
Should show file with data

### Check 5: New Report Works
Send test report using curl command above
Should return success response

---

## Done! 🎉

Your Arunika Agentic AI Dashboard is now:
- ✅ Running locally
- ✅ Tracking real executions
- ✅ Storing data persistently
- ✅ Ready for scheduled tasks to report results

**Next**: Integrate your scheduled tasks from Cowork space to start seeing real performance metrics!

See `SCHEDULED_TASK_EXAMPLE.md` for detailed integration examples.
