# Verification Checklist - Arunika Agentic AI Dashboard Fix

✅ = Working correctly  
❌ = Not working  
🔲 = Not checked yet

---

## Phase 1: Server Startup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Server says "ready - started server on 0.0.0.0:3000"
- [ ] No errors in console

**Status**: ☐

---

## Phase 2: Dashboard Access

- [ ] Browser can reach http://localhost:3000
- [ ] Dashboard page loads (not blank page)
- [ ] Dashboard shows widgets/cards
- [ ] Dashboard has sample data visible
- [ ] No JavaScript errors in browser console
- [ ] Page is responsive (can scroll)

**Status**: ☐

---

## Phase 3: API Endpoints

### Test Stats Endpoint

```bash
curl http://localhost:3000/api/workflows/stats
```

- [ ] Response is HTTP 200
- [ ] Response is valid JSON
- [ ] Response has `success: true`
- [ ] Response has `stats` object
- [ ] Response has `summary` object
- [ ] `dataSource` is "EXECUTION_TRACKER"

**Example Response Check**:
```json
{
  "success": true,
  "dataSource": "EXECUTION_TRACKER",
  "stats": { /* ... */ },
  "summary": { /* ... */ }
}
```

**Status**: ☐

---

## Phase 4: Execution Reporting

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

- [ ] Response is HTTP 200
- [ ] Response is valid JSON
- [ ] Response has `success: true`
- [ ] Response includes `timestamp`
- [ ] Console shows `[API] Reporting execution`
- [ ] No errors in server console

**Expected Response**:
```json
{
  "success": true,
  "message": "Execution recorded for test-workflow",
  "result": { /* ... */ },
  "timestamp": "2026-05-10T12:30:00Z"
}
```

**Status**: ☐

---

## Phase 5: Data Persistence

### Check Data File

```bash
ls -la .cowork-data/execution-history.json
```

- [ ] File exists
- [ ] File size > 0 bytes
- [ ] File is readable
- [ ] File contains valid JSON

### View File Content

```bash
cat .cowork-data/execution-history.json | head -20
```

- [ ] File contains JSON structure
- [ ] File has workflow entries
- [ ] File has test-workflow entry
- [ ] Data matches what was sent

**Status**: ☐

---

## Phase 6: Dashboard Data Display

### After reporting test execution:

- [ ] Refresh browser (F5)
- [ ] Dashboard still loads
- [ ] Stats show updated counts
- [ ] Test workflow appears in list
- [ ] Test execution visible in stats
- [ ] Success rate calculated correctly
- [ ] Average duration calculated

**Status**: ☐

---

## Phase 7: Sample Data Loading

### Check Server Logs

When server starts, console should show:
```
[INIT] ExecutionTracker is empty, loading sample data...
[INIT] Sample data loaded successfully
```

- [ ] See `[INIT]` messages on startup
- [ ] Sample workflows appear on dashboard
- [ ] Sample execution data shows in stats
- [ ] Dashboard shows multiple workflows

**Status**: ☐

---

## Phase 8: Integration Readiness

### Check Critical Files Exist

- [ ] `services/execution-tracker.ts` (5.4 KB)
- [ ] `lib/init-tracker.ts` (0.9 KB)
- [ ] `app/api/workflows/report-execution/route.ts` (2.3 KB)
- [ ] `app/api/workflows/stats/route.ts` (4.2 KB)
- [ ] `app/layout.tsx` has `initializeTracker` import
- [ ] `app/layout.tsx` calls `initializeTracker()`

**Status**: ☐

---

## Phase 9: Documentation Available

- [ ] `QUICK_START.md` exists
- [ ] `INTEGRATION_GUIDE.md` exists
- [ ] `SCHEDULED_TASK_EXAMPLE.md` exists
- [ ] `README_EXECUTION_TRACKING.md` exists
- [ ] `FIX_SUMMARY_2026-05-10.md` exists
- [ ] Can read and understand examples

**Status**: ☐

---

## Phase 10: Ready for Production

### All Tests Passing?

- [ ] Phase 1: Server startup ✅
- [ ] Phase 2: Dashboard access ✅
- [ ] Phase 3: API endpoints ✅
- [ ] Phase 4: Execution reporting ✅
- [ ] Phase 5: Data persistence ✅
- [ ] Phase 6: Dashboard display ✅
- [ ] Phase 7: Sample data ✅
- [ ] Phase 8: Files exist ✅
- [ ] Phase 9: Documentation ✅

**Status**: ☐ READY FOR PRODUCTION

---

## Quick Test Script

Run all tests in order:

```bash
#!/bin/bash
echo "=== Phase 1: Server ==="
npm run dev &
SERVER_PID=$!
sleep 5

echo "=== Phase 2: Dashboard ==="
curl -s http://localhost:3000 | grep -q "html" && echo "✓ Dashboard loads" || echo "✗ Dashboard failed"

echo "=== Phase 3: Stats API ==="
curl -s http://localhost:3000/api/workflows/stats | jq .success

echo "=== Phase 4: Report Execution ==="
curl -X POST http://localhost:3000/api/workflows/report-execution \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "test",
    "taskId": "test-123",
    "status": "completed",
    "duration": 2500
  }' | jq .success

echo "=== Phase 5: Data File ==="
cat .cowork-data/execution-history.json | jq keys

echo "=== All Tests Complete ==="
kill $SERVER_PID
```

---

## Troubleshooting Guide

### Phase 1 Fails

If server won't start:
1. Check Node version: `node --version` (need 18+)
2. Clear cache: `rm -rf node_modules .next`
3. Reinstall: `npm install`
4. Check errors: `npm run dev` (read all console output)

### Phase 2 Fails

If dashboard won't load:
1. Check server is running
2. Check http://localhost:3000 (not https://)
3. Check firewall isn't blocking port 3000
4. Check browser console for errors (F12)

### Phase 3 Fails

If API endpoints don't respond:
1. Verify server is running
2. Check URL is exactly: `http://localhost:3000/api/workflows/stats`
3. Try without curl first: browser address bar
4. Check server console for errors

### Phase 4 Fails

If reporting doesn't work:
1. Check Content-Type header
2. Check JSON is valid (`jq` the payload first)
3. Check required fields present (workflowId, taskId, status)
4. Check server console for error message

### Phase 5 Fails

If data doesn't persist:
1. Check `.cowork-data/` directory exists
2. Check `execution-history.json` is readable: `ls -la .cowork-data/`
3. Check file permissions: `chmod 644 .cowork-data/execution-history.json`
4. Check disk space available

### Phase 6 Fails

If dashboard doesn't update:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check API still returns data: curl stats endpoint
4. Check execution was actually stored: cat JSON file

---

## Success Criteria

✅ **System is working if:**

1. Server starts without errors
2. Dashboard loads at http://localhost:3000
3. Stats API returns JSON data
4. Can POST execution report and get 200 response
5. Execution data stored in `.cowork-data/execution-history.json`
6. Dashboard updates after sending test report
7. Documentation files exist and are readable
8. No errors in browser console
9. No errors in server console

---

## Next Action

**If all phases pass**: 
→ System is ready! Integrate your scheduled tasks using `SCHEDULED_TASK_EXAMPLE.md`

**If any phase fails**: 
→ See troubleshooting section above or check detailed guides in documentation

---

## Support Resources

| Phase | Guide |
|-------|-------|
| General Setup | QUICK_START.md |
| Technical Details | INTEGRATION_GUIDE.md |
| Code Examples | SCHEDULED_TASK_EXAMPLE.md |
| System Overview | README_EXECUTION_TRACKING.md |
| What Was Fixed | FIX_SUMMARY_2026-05-10.md |

---

**Start with**: `npm run dev` then visit `http://localhost:3000`

**Mark progress above as you complete each phase** ✅
