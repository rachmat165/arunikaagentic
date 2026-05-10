# Scheduled Task Integration Example

**How to integrate your Cowork scheduled tasks with the Arunika Agentic AI Dashboard**

---

## Quick Integration Template

Copy-paste ini ke dalam scheduled task Anda untuk automatically report execution results ke dashboard:

### 1. Helper Function (Add to your task)

```typescript
/**
 * Report task execution to Arunika Dashboard
 * Call this at the end of your scheduled task
 */
async function reportToDashboard(config: {
  workflowId: string;      // e.g., "daily-briefing"
  status: 'completed' | 'failed';
  duration: number;        // milliseconds
  outputs?: Record<string, any>;
  error?: string;
}) {
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
      const errorText = await response.text();
      console.error(
        `[DASHBOARD] Failed to report execution: ${response.status}`,
        errorText
      );
    } else {
      console.log(`[DASHBOARD] ✓ Execution reported for ${config.workflowId}`);
    }
  } catch (error) {
    // Don't throw - just log so task can complete
    console.error(
      '[DASHBOARD] Error reporting execution:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

export { reportToDashboard };
```

---

## Example 1: Daily Briefing Task

### Scheduled Task Code

```typescript
import { reportToDashboard } from './dashboard-reporter';

export async function runDailyBriefing() {
  const startTime = Date.now();
  const WORKFLOW_ID = 'daily-briefing';

  console.log('[TASK] Starting daily briefing generation...');

  try {
    // Step 1: Generate briefing content
    const briefing = await generateExecutiveBriefing();
    console.log(`[TASK] Generated briefing with ${briefing.sections.length} sections`);

    // Step 2: Send to recipients
    const recipientCount = await sendBriefingEmails(briefing);
    console.log(`[TASK] Sent briefing to ${recipientCount} recipients`);

    // Step 3: Store results
    const resultsFile = await saveToGoogleDrive(briefing);
    console.log(`[TASK] Results saved to: ${resultsFile}`);

    // Step 4: Report success to dashboard
    const duration = Date.now() - startTime;
    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'completed',
      duration,
      outputs: {
        summary: 'Daily briefing generated and sent successfully',
        briefingSections: briefing.sections.length,
        recipientsSent: recipientCount,
        resultsFile: resultsFile,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`[TASK] ✓ Task completed in ${duration}ms`);
    return { success: true, recipientCount, resultsFile };

  } catch (error) {
    // Report failure to dashboard
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[TASK] ✗ Error: ${errorMessage}`);

    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'failed',
      duration,
      error: errorMessage
    });

    throw error;
  }
}
```

### Dashboard Will Show

```
Daily Briefing
- Total Executions: 47
- Success Rate: 97%
- Avg Duration: 2.3s
- Last Run: 2:30 PM today (Success)
```

---

## Example 2: Invoice Processing Task

### Scheduled Task Code

```typescript
import { reportToDashboard } from './dashboard-reporter';

export async function processInvoices() {
  const startTime = Date.now();
  const WORKFLOW_ID = 'invoice-processing';

  console.log('[TASK] Starting invoice processing...');

  try {
    // Process invoices
    const invoices = await fetchPendingInvoices();
    console.log(`[TASK] Found ${invoices.length} invoices to process`);

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const invoice of invoices) {
      try {
        await validateAndProcessInvoice(invoice);
        successCount++;
      } catch (error) {
        failureCount++;
        errors.push(`Invoice ${invoice.id}: ${error}`);
      }
    }

    console.log(
      `[TASK] Processing complete: ${successCount} success, ${failureCount} failures`
    );

    // Report to dashboard
    const duration = Date.now() - startTime;
    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: failureCount === 0 ? 'completed' : 'failed',
      duration,
      outputs: {
        summary: `Processed ${successCount + failureCount} invoices`,
        totalProcessed: successCount + failureCount,
        successCount,
        failureCount,
        errors: errors.slice(0, 5), // Only report first 5 errors
        processingRate: `${invoices.length}/${duration}ms`
      },
      error: failureCount > 0 ? `${failureCount} invoices failed` : undefined
    });

    return { successCount, failureCount };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'failed',
      duration,
      error: errorMessage
    });

    throw error;
  }
}
```

### Dashboard Will Show

```
Invoice Processing
- Total Executions: 23
- Success Rate: 91%
- Avg Duration: 45s
- Last Run: Error (5 invoices failed)
```

---

## Example 3: Sales & Marketing Report Task

### Scheduled Task Code

```typescript
import { reportToDashboard } from './dashboard-reporter';

export async function generateSalesMarketingReport() {
  const startTime = Date.now();
  const WORKFLOW_ID = 'sales-marketing-report';

  console.log('[TASK] Generating Sales & Marketing report...');

  try {
    // Collect data
    const salesData = await getSalesMetrics();
    const marketingData = await getMarketingMetrics();

    console.log('[TASK] Compiling report data...');

    // Create report
    const report = {
      generatedAt: new Date().toISOString(),
      period: 'daily',
      sales: {
        newLeads: salesData.newLeads,
        conversions: salesData.conversions,
        revenue: salesData.revenue,
        conversionRate: (salesData.conversions / salesData.newLeads * 100).toFixed(2) + '%'
      },
      marketing: {
        impressions: marketingData.impressions,
        clicks: marketingData.clicks,
        engagement: marketingData.engagement,
        ctr: (marketingData.clicks / marketingData.impressions * 100).toFixed(2) + '%'
      }
    };

    // Save report
    const reportFile = await saveReportToGoogleDrive(report);
    console.log(`[TASK] Report saved: ${reportFile}`);

    // Report to dashboard
    const duration = Date.now() - startTime;
    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'completed',
      duration,
      outputs: {
        summary: 'Daily Sales & Marketing report generated',
        newLeads: salesData.newLeads,
        conversions: salesData.conversions,
        revenue: salesData.revenue,
        impressions: marketingData.impressions,
        engagement: marketingData.engagement,
        reportFile: reportFile
      }
    });

    console.log('[TASK] ✓ Report generation complete');
    return { success: true, reportFile };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[TASK] ✗ Failed: ${errorMessage}`);

    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'failed',
      duration,
      error: errorMessage
    });

    throw error;
  }
}
```

### Dashboard Will Show

```
Sales & Marketing Report
- Total Executions: 156
- Success Rate: 98%
- Avg Duration: 12.5s
- Last Run: Success (2,345 leads, 156 conversions)
```

---

## Example 4: Data Validation Task

### Scheduled Task Code

```typescript
import { reportToDashboard } from './dashboard-reporter';

export async function validateDataIntegrity() {
  const startTime = Date.now();
  const WORKFLOW_ID = 'data-validation';

  console.log('[TASK] Starting data integrity validation...');

  try {
    const validationResults = {
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [] as string[]
    };

    // Check 1: Database consistency
    console.log('[TASK] Checking database consistency...');
    const dbCheck = await validateDatabase();
    validationResults.totalChecks++;
    if (dbCheck.isValid) {
      validationResults.passed++;
    } else {
      validationResults.failed++;
      validationResults.issues.push(`Database: ${dbCheck.error}`);
    }

    // Check 2: File integrity
    console.log('[TASK] Checking file integrity...');
    const fileCheck = await validateFiles();
    validationResults.totalChecks++;
    if (fileCheck.isValid) {
      validationResults.passed++;
    } else {
      validationResults.failed++;
      validationResults.issues.push(`Files: ${fileCheck.error}`);
    }

    // Check 3: API endpoints
    console.log('[TASK] Checking API health...');
    const apiCheck = await validateAPIs();
    validationResults.totalChecks++;
    if (apiCheck.isValid) {
      validationResults.passed++;
    } else {
      validationResults.warnings++; // API issues are warnings, not failures
      validationResults.issues.push(`API: ${apiCheck.warning}`);
    }

    const isHealthy = validationResults.failed === 0;
    const duration = Date.now() - startTime;

    console.log(
      `[TASK] Validation complete: ${validationResults.passed}/${validationResults.totalChecks} passed`
    );

    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: isHealthy ? 'completed' : 'failed',
      duration,
      outputs: {
        summary: isHealthy ? 'All checks passed' : 'Validation issues detected',
        totalChecks: validationResults.totalChecks,
        passed: validationResults.passed,
        failed: validationResults.failed,
        warnings: validationResults.warnings,
        issues: validationResults.issues
      },
      error: !isHealthy ? `${validationResults.failed} checks failed` : undefined
    });

    return validationResults;

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    await reportToDashboard({
      workflowId: WORKFLOW_ID,
      status: 'failed',
      duration,
      error: errorMessage
    });

    throw error;
  }
}
```

### Dashboard Will Show

```
Data Validation
- Total Executions: 89
- Success Rate: 95%
- Avg Duration: 8.2s
- Last Run: Success (All 15 checks passed)
```

---

## Integration Steps

### Step 1: Copy the Helper Function
Tambahkan `reportToDashboard()` function ke scheduled task Anda.

### Step 2: Wrap Your Task Logic
```typescript
try {
  // Your actual task logic here
  const result = await doYourWork();
  
  // Report success
  await reportToDashboard({
    workflowId: "your-workflow-name",
    status: "completed",
    duration: Date.now() - startTime,
    outputs: { result }
  });
} catch (error) {
  // Report failure
  await reportToDashboard({
    workflowId: "your-workflow-name",
    status: "failed",
    duration: Date.now() - startTime,
    error: error.message
  });
}
```

### Step 3: Test
1. Run your scheduled task
2. Check dashboard at http://localhost:3000
3. Verify execution appears in the stats

---

## Tips & Best Practices

### ✅ DO:
- Report both success and failure
- Include meaningful outputs in successful reports
- Include error message in failed reports
- Track execution time accurately
- Use consistent workflowId across runs

### ❌ DON'T:
- Throw error after reporting (let task complete normally)
- Report false successes for partial failures
- Include sensitive data in outputs
- Report the same execution multiple times
- Forget to handle network errors gracefully

---

## Checking If It's Working

### 1. Check Execution Report
After running your task, curl the stats endpoint:

```bash
curl http://localhost:3000/api/workflows/stats?workflowId=your-workflow-name
```

You should see your execution in the response.

### 2. Check Dashboard UI
Visit http://localhost:3000 and you should see:
- Your workflow listed
- Correct execution count
- Success/failure status
- Average duration

### 3. Check Stored Data
```bash
cat .cowork-data/execution-history.json | jq '.["your-workflow-name"]'
```

You should see your execution records stored locally.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Report not received | Check server is running on localhost:3000 |
| 400 error from API | Ensure workflowId, taskId, status are provided |
| Execution not in dashboard | Refresh page, check browser console for errors |
| Server not running | Run `npm run dev` from project directory |
| Network error in task | Check firewall isn't blocking localhost:3000 |

---

That's it! Your scheduled task is now reporting to the Arunika Agentic AI Dashboard!
