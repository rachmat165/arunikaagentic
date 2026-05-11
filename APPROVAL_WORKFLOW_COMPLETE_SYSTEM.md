# ARUNIKA AGENTIC - APPROVAL WORKFLOW SYSTEM
## Complete Multi-Agent Task Approval & Routing dengan CEO Command Dashboard

**Version:** 1.0  
**Date:** May 11, 2026  
**Status:** Ready for Implementation  
**Target:** June 9, 2026 Go-Live

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [CEO Approval Dashboard](#ceo-approval-dashboard)
5. [Agent Implementation & API Integration](#agent-implementation--api-integration)
6. [API Endpoints](#api-endpoints)
7. [Workflow Flows & Examples](#workflow-flows--examples)
8. [Security & API Key Management](#security--api-key-management)
9. [Deployment Guide](#deployment-guide)
10. [Monitoring & Audit Trail](#monitoring--audit-trail)

---

## EXECUTIVE SUMMARY

### ❓ User Requirement
Sistem approval workflow dimana:
1. **Agent** menjalankan daily tasks → submit hasil untuk approval
2. **CEO Dashboard** memberikan 3 pilihan:
   - ✅ **APPROVE** → Task approved, auto-route ke agent berikutnya
   - 📝 **REQUEST REVISION** → CEO kirim command/instruction, agent implement
   - ❌ **REJECT** → Task ditolak, archived
3. **Agent** bisa menggunakan API keys yang sudah dikonfigurasi (Claude, OpenAI, Gemini)
4. **Revision Flow** → Agent bisa berkomunikasi dengan CEO via dashboard prompts

### ✅ JAWABAN: SUDAH TERPENUHI

Sistem ini dirancang dengan:
- ✅ **CEO Command Field** di dashboard untuk instruction next task
- ✅ **API Key Integration** - agents punya akses ke pre-configured model credentials
- ✅ **Multi-Model Support** - Claude, OpenAI (GPT-4), Gemini
- ✅ **Secure Key Management** - encrypted environment variables
- ✅ **Dynamic Task Routing** - CEO bisa specify next agent & task
- ✅ **Revision Prompts** - CEO instructions executed langsung oleh agents

---

## SYSTEM ARCHITECTURE

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ARUNIKA AGENTIC ECOSYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────┘

AGENTS LAYER (Task Execution)
├─ 🏢 Operations Agent (direktur.operasional@arunika2045.com)
│  └─ Daily Tasks: Generate proposals, process documents, reports
│
├─ 📱 Sales & Marketing Agent (direktur.marketing@arunika2045.com)
│  └─ Daily Tasks: Create content, social posts, email campaigns
│
├─ 💰 Finance Agent (direktur.finance@arunika2045.com)
│  └─ Daily Tasks: Process invoices, reconcile accounts, reports
│
└─ 👔 CEO Agent (corsec@arunika2045.com) [APPROVAL AUTHORITY]
   └─ Daily Task: Review & approve submitted tasks from other agents

                              ↓ (SUBMIT FOR APPROVAL)

APPROVAL QUEUE LAYER
├─ PostgreSQL Database: approval_queue table
│  └─ Stores: task_id, status, output_data, revision_prompts, next_task routing
│
└─ Event Bus/Message Queue (optional for scalability)
   └─ Triggers notifications when approval needed

                              ↓ (NOTIFICATION)

CEO DASHBOARD LAYER (Approval & Instruction Layer)
├─ React Component: CEO Approval Dashboard
│  ├─ 📋 Pending Approvals List (tasks awaiting review)
│  ├─ 👁️ Task Detail Panel (preview task output)
│  │
│  ├─ ACTION 1: [✅ APPROVE & EXECUTE]
│  │  └─ Auto-route to next_agentic specified in DB
│  │
│  ├─ ACTION 2: [📝 REQUEST REVISION]
│  │  ├─ CEO COMMAND FIELD: Text input untuk instruction
│  │  │  └─ Example: "Fix proposal title to emphasize ROI metrics.
│  │  │             Change color scheme to blue #003D7A.
│  │  │             Max 200 words."
│  │  └─ Submit → API call to /api/approvals/revise
│  │
│  └─ ACTION 3: [❌ REJECT]
│     └─ Archive task, notify source agent

                              ↓ (DECISION)

ROUTING & EXECUTION LAYER
├─ If APPROVE: 
│  └─ API Handler → workflowExecutor.executeWorkflow(next_task_id, next_agentic)
│
├─ If REVISE:
│  └─ API Handler → Send command to source_agentic
│     Source agent: Fetch revision_prompt from DB
│                 → Re-execute task with NEW instruction
│                 → Re-submit (loop back to CEO dashboard)
│
└─ If REJECT:
   └─ API Handler → Archive task
                 → Notify source agent: Don't execute

                              ↓ (NEXT AGENT EXECUTION)

AGENT EXECUTION WITH AI MODELS
├─ Source Agent receives: "Task APPROVED, proceed to next step"
│
├─ Next Agent receives notification: "New task assigned: {task_data}"
│  ├─ Task data includes: approved_output from previous agent
│  ├─ Next agent fetches API keys from environment
│  │
│  ├─ Agent uses configured models:
│  │  ├─ 🤖 Claude API (claude-opus-4-6 / claude-sonnet-4-6)
│  │  ├─ 🧠 OpenAI (GPT-4o)
│  │  └─ 🎨 Gemini (Gemini 2.0 / Gemini Vision)
│  │
│  └─ Agent executes next task using API key from:
│     └─ process.env.CLAUDE_API_KEY
│        process.env.OPENAI_API_KEY
│        process.env.GEMINI_API_KEY

                              ↓ (COMPLETION)

EXECUTION LOG & AUDIT TRAIL
└─ Log every: decision, instruction, execution, outcome
   └─ For compliance, learning, & future optimization

```

---

## DATABASE SCHEMA

### Main Table: approval_queue

```sql
-- PostgreSQL Schema
CREATE TABLE approval_queue (
  -- Primary Identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) UNIQUE NOT NULL,
  
  -- Task Metadata
  task_type VARCHAR(50) NOT NULL,
  -- Values: 'proposal', 'social_post', 'report', 'invoice', 'content', etc
  
  task_title VARCHAR(200) NOT NULL,
  task_description TEXT,
  
  -- Source Agent Information
  source_agentic VARCHAR(100) NOT NULL,
  -- Values: 'operations-agentic', 'sales-marketing-agentic', 'finance-agentic'
  
  source_email VARCHAR(100) NOT NULL,
  -- Example: direktur.operasional@arunika2045.com
  
  -- Task Output Data
  output_data JSONB NOT NULL,
  -- The actual task output (proposal content, social posts, report, etc)
  
  -- Approval Status
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  -- Values: 'pending', 'approved', 'rejected', 'revision_requested', 'revision_resubmitted'
  
  -- Submission Details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_by VARCHAR(100) NOT NULL,
  
  -- CEO Review Details
  reviewed_by VARCHAR(100),
  -- Will be: 'ceo-agentic' when CEO reviews
  
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  -- CEO COMMAND FIELD (REVISION INSTRUCTIONS)
  -- This is where CEO sends instructions for next task or revisions
  revision_prompts JSONB,
  -- Array format: [
  --   {
  --     "revision_number": 1,
  --     "instruction": "Fix the proposal heading. Emphasize ROI metrics.",
  --     "requested_at": "2026-05-11T10:30:00Z",
  --     "deadline": "2026-05-11T12:30:00Z",
  --     "status": "pending" | "completed" | "timeout"
  --   },
  --   ...
  -- ]
  
  -- Revision Tracking
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 3,
  -- Prevent infinite revision loops
  
  -- Next Task Routing (CEO specifies here)
  next_task_id VARCHAR(100),
  -- Task yang akan dijalankan oleh next_agentic setelah approval
  
  next_agentic VARCHAR(100),
  -- Target agent untuk next task
  -- Values: 'operations-agentic', 'sales-marketing-agentic', 'finance-agentic', etc
  
  next_task_instruction TEXT,
  -- CEO dapat memberikan instruksi spesifik untuk next agent
  -- Example: "Please send this proposal to client ABC Corp
  --           with follow-up reminder in 5 days"
  
  -- CEO Command/Decision Field
  ceo_command VARCHAR(50),
  -- Values: 'APPROVE', 'REVISE', 'REJECT', 'HOLD'
  
  ceo_decision_reason TEXT,
  -- Why CEO made this decision (untuk audit trail)
  
  -- Audit Trail
  approval_history JSONB,
  -- Complete history of all actions taken on this task:
  -- [
  --   {
  --     "action": "SUBMITTED",
  --     "by": "operations-agentic",
  --     "timestamp": "2026-05-11T09:00:00Z",
  --     "details": {...}
  --   },
  --   {
  --     "action": "REVISION_REQUESTED",
  --     "by": "ceo-agentic",
  --     "timestamp": "2026-05-11T10:00:00Z",
  --     "instruction": "..."
  --   },
  --   {
  --     "action": "RESUBMITTED",
  --     "by": "operations-agentic",
  --     "timestamp": "2026-05-11T10:45:00Z"
  --   },
  --   {
  --     "action": "APPROVED",
  --     "by": "ceo-agentic",
  --     "timestamp": "2026-05-11T11:00:00Z",
  --     "routed_to": "sales-marketing-agentic"
  --   }
  -- ]
  
  -- Task Completion
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  completion_result JSONB,
  -- Final outcome of the entire workflow
  -- {
  --   "status": "success" | "failed",
  --   "final_task": "send-proposal-xyz",
  --   "final_agent": "sales-marketing-agentic",
  --   "execution_time": 45.2,
  --   "notes": "Proposal sent to ABC Corp successfully"
  -- }
  
  -- API Key & Model Information (for agent execution tracking)
  model_used VARCHAR(50),
  -- Example: 'claude-sonnet-4-6', 'gpt-4o', 'gemini-2-0'
  
  execution_metadata JSONB
  -- Track which API keys were used, execution cost, etc
  -- {
  --   "api_key_id": "CLAUDE_API_KEY",
  --   "model": "claude-sonnet-4-6",
  --   "tokens_used": 2450,
  --   "execution_time_ms": 2340,
  --   "cost_estimate_usd": 0.023
  -- }
);

-- Indexes for Performance
CREATE INDEX idx_status_created ON approval_queue(status, created_at DESC);
CREATE INDEX idx_source_agentic ON approval_queue(source_agentic);
CREATE INDEX idx_next_agentic ON approval_queue(next_agentic) WHERE status = 'approved';
CREATE INDEX idx_review_pending ON approval_queue(status) 
  WHERE status IN ('pending', 'revision_requested');
CREATE INDEX idx_ceo_command ON approval_queue(ceo_command, reviewed_at DESC);

-- Table: api_key_registry (centralized API key management)
CREATE TABLE api_key_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(100) UNIQUE NOT NULL,
  -- Examples: 'CLAUDE_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'
  
  provider VARCHAR(50) NOT NULL,
  -- Values: 'anthropic', 'openai', 'google'
  
  model_name VARCHAR(100),
  -- Examples: 'claude-opus-4-6', 'gpt-4o', 'gemini-2-0'
  
  encrypted_value TEXT NOT NULL,
  -- Encrypted using environment encryption service
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  
  -- Access Control
  accessible_by JSONB,
  -- Array of agent names that can use this key
  -- Example: ["operations-agentic", "sales-marketing-agentic"]
  
  environment VARCHAR(20),
  -- Values: 'development', 'staging', 'production'
  
  notes TEXT
);

-- Table: agent_execution_log (track each agent execution with API usage)
CREATE TABLE agent_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(100) NOT NULL REFERENCES approval_queue(task_id),
  
  agent_name VARCHAR(100) NOT NULL,
  agent_email VARCHAR(100),
  
  execution_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_end TIMESTAMP,
  
  model_used VARCHAR(50),
  -- Which AI model was used by this agent
  
  api_key_id UUID REFERENCES api_key_registry(id),
  -- Which API key was used
  
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  
  cost_usd DECIMAL(10, 4),
  
  execution_result VARCHAR(20),
  -- Values: 'success', 'failed', 'timeout', 'error'
  
  error_message TEXT,
  
  output_preview TEXT,
  -- Preview of the output (first 500 chars)
  
  metadata JSONB
);
```

---

## CEO APPROVAL DASHBOARD

### Component: ceo-approval-dashboard.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Check, X, Edit2, AlertCircle, Send } from 'lucide-react';

interface ApprovalTask {
  id: string;
  task_id: string;
  task_type: string;
  source_agentic: string;
  task_title: string;
  output_data: any;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  revision_count: number;
  max_revisions: number;
  next_task_id?: string;
  next_agentic?: string;
}

interface ApprovalAction {
  ceo_command: 'APPROVE' | 'REVISE' | 'REJECT' | 'HOLD';
  revision_instruction?: string;
  next_task_for_agent?: string;
  next_agent?: string;
  decision_reason: string;
}

export function CEOApprovalDashboard() {
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null);
  
  // FORM STATE
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [nextAgentCommand, setNextAgentCommand] = useState('');
  const [decisionReason, setDecisionReason] = useState('');
  
  // UI STATE
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
    const interval = setInterval(fetchPendingApprovals, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('/api/approvals/pending');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    }
  };

  // ACTION 1: APPROVE
  const handleApprove = async (taskId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/approvals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          approved_by: 'ceo-agentic',
          ceo_command: 'APPROVE',
          decision_reason: decisionReason || 'Approved by CEO',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFeedbackMessage(`✅ Task approved! Routed to ${result.next_agentic}`);
        await fetchPendingApprovals();
        setSelectedTask(null);
        setDecisionReason('');
      }
    } catch (error) {
      console.error('Error approving task:', error);
      setFeedbackMessage('❌ Error approving task');
    } finally {
      setIsProcessing(false);
    }
  };

  // ACTION 2: REQUEST REVISION
  const handleRequestRevision = async (taskId: string) => {
    if (!revisionPrompt.trim()) {
      alert('Please provide revision instructions');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/approvals/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          ceo_command: 'REVISE',
          revision_instruction: revisionPrompt,
          requested_by: 'ceo-agentic',
          decision_reason: decisionReason || 'Revision requested',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFeedbackMessage(`📝 Revision request sent to ${result.agentic_notified}`);
        await fetchPendingApprovals();
        setSelectedTask(null);
        setRevisionPrompt('');
        setDecisionReason('');
      }
    } catch (error) {
      console.error('Error requesting revision:', error);
      setFeedbackMessage('❌ Error requesting revision');
    } finally {
      setIsProcessing(false);
    }
  };

  // ACTION 3: REJECT
  const handleReject = async (taskId: string) => {
    if (!decisionReason.trim()) {
      alert('Please provide reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/approvals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          ceo_command: 'REJECT',
          rejected_by: 'ceo-agentic',
          decision_reason: decisionReason,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setFeedbackMessage('❌ Task rejected and archived');
        await fetchPendingApprovals();
        setSelectedTask(null);
        setDecisionReason('');
      }
    } catch (error) {
      console.error('Error rejecting task:', error);
      setFeedbackMessage('❌ Error rejecting task');
    } finally {
      setIsProcessing(false);
    }
  };

  // ACTION 4: APPROVE + SEND NEXT AGENT COMMAND
  const handleApproveWithNextCommand = async (taskId: string) => {
    if (!nextAgentCommand.trim()) {
      alert('Please provide instruction for next agent');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/approvals/approve-with-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          ceo_command: 'APPROVE',
          approved_by: 'ceo-agentic',
          next_task_instruction: nextAgentCommand,
          // If you want to override next_agentic, can specify here
          decision_reason: decisionReason || 'Approved with next task instruction',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFeedbackMessage(
          `✅ Approved! Instruction sent to ${result.next_agentic}:\n"${nextAgentCommand}"`
        );
        await fetchPendingApprovals();
        setSelectedTask(null);
        setNextAgentCommand('');
        setDecisionReason('');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedbackMessage('❌ Error processing approval');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6 h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* PENDING TASKS LIST */}
      <div className="col-span-1 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📋 Pending
          <span className="bg-red-500 text-white text-sm rounded-full px-2 py-1">
            {tasks.length}
          </span>
        </h2>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              ✅ All tasks reviewed!
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition transform hover:scale-105 ${
                  selectedTask?.id === task.id
                    ? 'bg-blue-100 border-blue-500 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-sm text-gray-900">
                  {task.task_title}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  From: {task.source_agentic}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(task.created_at).toLocaleTimeString()}
                </div>
                {task.revision_count > 0 && (
                  <div className="text-xs text-orange-600 mt-2 font-semibold">
                    🔄 Revision #{task.revision_count}/{task.max_revisions}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* TASK DETAIL & ACTIONS */}
      <div className="col-span-3 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
        {selectedTask ? (
          <div className="space-y-4">
            {/* TASK HEADER */}
            <div className="border-b-2 pb-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {selectedTask.task_title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                📦 Type: {selectedTask.task_type} | 
                From: <strong>{selectedTask.source_agentic}</strong> |
                Submitted: {new Date(selectedTask.created_at).toLocaleString()}
              </p>
              {selectedTask.next_agentic && (
                <p className="text-gray-600 text-sm mt-1">
                  ➡️ Next Agent (if approved): <strong>{selectedTask.next_agentic}</strong>
                  {selectedTask.next_task_id && ` - Task: ${selectedTask.next_task_id}`}
                </p>
              )}
            </div>

            {/* FEEDBACK MESSAGE */}
            {feedbackMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                {feedbackMessage}
              </div>
            )}

            {/* TASK OUTPUT PREVIEW */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto font-mono text-xs">
              <div className="mb-2 text-yellow-400">Output Preview:</div>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(selectedTask.output_data, null, 2).substring(0, 1000)}
                {JSON.stringify(selectedTask.output_data, null, 2).length > 1000 && '...'}
              </pre>
            </div>

            {/* CEO DECISION SECTION */}
            <div className="grid grid-cols-2 gap-4">
              {/* LEFT: QUICK ACTIONS */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="text-sm font-bold text-green-900 mb-3">✅ APPROVE</div>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Reason for approval (optional)"
                  className="w-full p-2 text-sm border rounded-lg mb-3 focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
                <button
                  onClick={() => handleApprove(selectedTask.task_id)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Check size={18} />
                  Approve & Auto-Route
                </button>
              </div>

              {/* RIGHT: REJECT */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200">
                <div className="text-sm font-bold text-red-900 mb-3">❌ REJECT</div>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Reason for rejection (required)"
                  className="w-full p-2 text-sm border rounded-lg mb-3 focus:ring-2 focus:ring-red-500"
                  rows={2}
                />
                <button
                  onClick={() => handleReject(selectedTask.task_id)}
                  disabled={isProcessing || !decisionReason.trim()}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <X size={18} />
                  Reject & Archive
                </button>
              </div>
            </div>

            {/* REVISION REQUEST SECTION */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
              <div className="text-sm font-bold text-orange-900 mb-3">
                📝 REQUEST REVISION FROM {selectedTask.source_agentic.toUpperCase()}
              </div>
              <textarea
                value={revisionPrompt}
                onChange={(e) => setRevisionPrompt(e.target.value)}
                placeholder={`Example: "Fix the proposal title to emphasize ROI metrics.
Change the color scheme to blue #003D7A for branding consistency.
Make sure it's within 200 words maximum.
Focus on benefits to ABC Corp."`}
                className="w-full p-3 border-2 border-orange-300 rounded-lg mb-3 focus:ring-2 focus:ring-orange-500 font-sans text-sm"
                rows={4}
              />
              <button
                onClick={() => handleRequestRevision(selectedTask.task_id)}
                disabled={isProcessing || !revisionPrompt.trim()}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition"
              >
                <Edit2 size={18} />
                Send Revision Instruction
              </button>
              {selectedTask.revision_count >= selectedTask.max_revisions && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex gap-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">
                    ⚠️ Max revisions ({selectedTask.max_revisions}) reached.
                    Only APPROVE or REJECT options available.
                  </span>
                </div>
              )}
            </div>

            {/* APPROVE WITH NEXT AGENT COMMAND */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-900 mb-3">
                🔗 APPROVE + SEND COMMAND TO NEXT AGENT
              </div>
              {selectedTask.next_agentic ? (
                <>
                  <div className="text-sm text-blue-700 mb-3 p-2 bg-blue-50 rounded">
                    Next Agent: <strong>{selectedTask.next_agentic}</strong>
                  </div>
                  <textarea
                    value={nextAgentCommand}
                    onChange={(e) => setNextAgentCommand(e.target.value)}
                    placeholder={`Example for Sales Agent: "Please send this proposal to ABC Corp.
Set follow-up reminder for 5 days later.
Include our ROI metrics from this proposal.
Ask them to schedule a demo call."`}
                    className="w-full p-3 border-2 border-blue-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                    rows={4}
                  />
                  <button
                    onClick={() => handleApproveWithNextCommand(selectedTask.task_id)}
                    disabled={isProcessing || !nextAgentCommand.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Send size={18} />
                    Approve & Send Command
                  </button>
                </>
              ) : (
                <div className="p-3 bg-gray-100 text-gray-600 text-sm rounded">
                  No next agent specified for this task.
                </div>
              )}
            </div>

            {/* INFO BOX */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-900">
                <strong>ℹ️ How it works:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>
                    ✅ <strong>APPROVE:</strong> Task approved, auto-routes to next agent if specified
                  </li>
                  <li>
                    📝 <strong>REQUEST REVISION:</strong> Your instruction sent to source agent, they revise & resubmit
                  </li>
                  <li>
                    ❌ <strong>REJECT:</strong> Task rejected and archived (not executed)
                  </li>
                  <li>
                    🔗 <strong>APPROVE + COMMAND:</strong> Approve task AND send specific instruction to next agent
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-4 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              👈 Select a task from the list to review & approve
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## AGENT IMPLEMENTATION & API INTEGRATION

### How Agents Use API Keys

#### Agent Workflow with Model Integration

```typescript
// File: services/agent-execution-service.ts

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  approvalRoutingService,
} from "./approval-routing-service";
import { apiKeyService } from "./api-key-service";
import { agentExecutionLogger } from "./agent-execution-logger";

/**
 * AGENT EXECUTION SERVICE
 * Handles agent task execution with:
 * - Dynamic API key fetching (secure)
 * - Model selection (Claude, OpenAI, Gemini)
 * - Approval workflow integration
 * - Execution logging & audit trail
 */

export class AgentExecutionService {
  private claudeClient: Anthropic;
  private openaiClient: OpenAI;
  private googleClient: GoogleGenerativeAI;

  constructor() {
    // Initialize API clients with secure key retrieval
    this.claudeClient = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.googleClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  /**
   * STEP 1: Execute Daily Task (e.g., Operations Agent generating proposal)
   */
  async executeTask(
    taskId: string,
    taskType: string,
    agent: {
      name: string;
      email: string;
      preferredModel: "claude" | "openai" | "gemini";
    },
    prompt: string,
    nextTaskRouting?: {
      next_task_id: string;
      next_agentic: string;
    }
  ): Promise<{
    success: boolean;
    taskId: string;
    output: string;
    approvalSubmitted: boolean;
  }> {
    const executionStartTime = Date.now();
    let output = "";
    let modelUsed = "";
    let tokensUsed = 0;

    try {
      console.log(`[AGENT] ${agent.name} executing task: ${taskId}`);

      // Execute task using agent's preferred model
      if (agent.preferredModel === "claude") {
        ({output, modelUsed, tokensUsed} = await this.executeWithClaude(
          prompt,
          taskType
        ));
      } else if (agent.preferredModel === "openai") {
        ({output, modelUsed, tokensUsed} = await this.executeWithOpenAI(
          prompt,
          taskType
        ));
      } else if (agent.preferredModel === "gemini") {
        ({output, modelUsed, tokensUsed} = await this.executeWithGemini(
          prompt,
          taskType
        ));
      }

      const executionTime = Date.now() - executionStartTime;

      // Log execution
      await agentExecutionLogger.log({
        taskId,
        agentName: agent.name,
        agentEmail: agent.email,
        modelUsed,
        tokensUsed,
        executionTimeMs: executionTime,
        status: "success",
      });

      console.log(
        `[AGENT] ${agent.name} completed task ${taskId} in ${executionTime}ms`
      );

      // STEP 2: Submit for CEO Approval
      const approvalResult = await approvalRoutingService.submitForApproval({
        taskId,
        taskType,
        sourceAgentic: agent.name,
        sourceEmail: agent.email,
        outputData: JSON.parse(output),
        nextTaskRouting,
        modelUsed,
        tokensUsed,
      });

      console.log(
        `[APPROVAL] Task ${taskId} submitted to approval queue for CEO review`
      );

      return {
        success: true,
        taskId,
        output,
        approvalSubmitted: true,
      };
    } catch (error) {
      console.error(`[AGENT ERROR] ${agent.name} task ${taskId}:`, error);

      await agentExecutionLogger.log({
        taskId,
        agentName: agent.name,
        agentEmail: agent.email,
        modelUsed,
        tokensUsed: 0,
        executionTimeMs: Date.now() - executionStartTime,
        status: "failed",
        errorMessage: String(error),
      });

      return {
        success: false,
        taskId,
        output: "",
        approvalSubmitted: false,
      };
    }
  }

  /**
   * STEP 3: Agent Receives Revision Instruction from CEO
   * CEO approved task with command like:
   * "Fix proposal title to emphasize ROI. Change colors to blue #003D7A"
   */
  async executeWithRevision(
    taskId: string,
    agent: {
      name: string;
      email: string;
      preferredModel: "claude" | "openai" | "gemini";
    },
    originalOutput: string,
    revisionInstruction: string
  ): Promise<{
    success: boolean;
    revisedOutput: string;
  }> {
    try {
      console.log(
        `[REVISION] ${agent.name} revising task ${taskId} per CEO instruction`
      );
      console.log(`[REVISION] Instruction: "${revisionInstruction}"`);

      // Create revision prompt that includes original output + CEO instruction
      const revisionPrompt = `
You previously generated the following output:

<ORIGINAL_OUTPUT>
${originalOutput}
</ORIGINAL_OUTPUT>

The CEO reviewed your work and requested the following revision:

<CEO_INSTRUCTION>
${revisionInstruction}
</CEO_INSTRUCTION>

Please revise your output based on the CEO's instruction.
Maintain the same format and structure, but incorporate the requested changes.
`;

      let revisedOutput = "";

      if (agent.preferredModel === "claude") {
        const response = await this.claudeClient.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: revisionPrompt,
            },
          ],
        });

        revisedOutput =
          response.content[0].type === "text" ? response.content[0].text : "";
      } else if (agent.preferredModel === "openai") {
        const response = await this.openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: revisionPrompt,
            },
          ],
        });

        revisedOutput =
          response.choices[0].message.content || "";
      } else if (agent.preferredModel === "gemini") {
        const model = this.googleClient.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const result = await model.generateContent(revisionPrompt);
        revisedOutput = result.response.text();
      }

      console.log(
        `[REVISION] ${agent.name} completed revision, re-submitting for approval`
      );

      // Re-submit revised output for CEO approval
      await approvalRoutingService.resubmitAfterRevision(
        taskId,
        JSON.parse(revisedOutput),
        agent.name
      );

      return {
        success: true,
        revisedOutput,
      };
    } catch (error) {
      console.error(`[REVISION ERROR] ${agent.name}:`, error);
      return {
        success: false,
        revisedOutput: "",
      };
    }
  }

  /**
   * STEP 4: Agent Receives Approval + Next Task Command
   * Example: CEO approved proposal AND wants to send to client
   * Command: "Please send this proposal to ABC Corp. Ask them to schedule demo."
   */
  async executeWithApprovedOutput(
    taskId: string,
    agent: {
      name: string;
      email: string;
      preferredModel: "claude" | "openai" | "gemini";
    },
    approvedOutput: any,
    nextTaskCommand?: string
  ): Promise<{
    success: boolean;
    nextTaskOutput: string;
  }> {
    try {
      console.log(
        `[NEXT TASK] ${agent.name} executing next task for ${taskId}`
      );

      if (nextTaskCommand) {
        console.log(`[NEXT TASK] CEO instruction: "${nextTaskCommand}"`);
      }

      // Create prompt for next task using approved output
      const nextTaskPrompt = `
The following task was previously approved by CEO:

<APPROVED_OUTPUT>
${JSON.stringify(approvedOutput, null, 2)}
</APPROVED_OUTPUT>

${
  nextTaskCommand
    ? `
Now please execute the following task based on the approved output above:

<CEO_NEXT_TASK_INSTRUCTION>
${nextTaskCommand}
</CEO_NEXT_TASK_INSTRUCTION>
`
    : "Please proceed with the next step in the workflow for this output."
}
`;

      let nextTaskOutput = "";

      if (agent.preferredModel === "claude") {
        const response = await this.claudeClient.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: nextTaskPrompt,
            },
          ],
        });

        nextTaskOutput =
          response.content[0].type === "text" ? response.content[0].text : "";
      } else if (agent.preferredModel === "openai") {
        const response = await this.openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: nextTaskPrompt,
            },
          ],
        });

        nextTaskOutput = response.choices[0].message.content || "";
      } else if (agent.preferredModel === "gemini") {
        const model = this.googleClient.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const result = await model.generateContent(nextTaskPrompt);
        nextTaskOutput = result.response.text();
      }

      console.log(
        `[NEXT TASK] ${agent.name} completed next task, submitting results`
      );

      return {
        success: true,
        nextTaskOutput,
      };
    } catch (error) {
      console.error(`[NEXT TASK ERROR] ${agent.name}:`, error);
      return {
        success: false,
        nextTaskOutput: "",
      };
    }
  }

  // Utility methods for specific model execution
  private async executeWithClaude(
    prompt: string,
    taskType: string
  ): Promise<{ output: string; modelUsed: string; tokensUsed: number }> {
    const response = await this.claudeClient.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are an expert ${taskType} specialist for PT. Arunika Teknologi Global.
Generate high-quality, professional output.
Respond in JSON format when appropriate.`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const output =
      response.content[0].type === "text" ? response.content[0].text : "";
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    return {
      output,
      modelUsed: "claude-sonnet-4-6",
      tokensUsed,
    };
  }

  private async executeWithOpenAI(
    prompt: string,
    taskType: string
  ): Promise<{ output: string; modelUsed: string; tokensUsed: number }> {
    const response = await this.openaiClient.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      system: `You are an expert ${taskType} specialist for PT. Arunika Teknologi Global.
Generate high-quality, professional output.
Respond in JSON format when appropriate.`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const output = response.choices[0].message.content || "";
    const tokensUsed =
      response.usage.prompt_tokens + response.usage.completion_tokens;

    return {
      output,
      modelUsed: "gpt-4o",
      tokensUsed,
    };
  }

  private async executeWithGemini(
    prompt: string,
    taskType: string
  ): Promise<{ output: string; modelUsed: string; tokensUsed: number }> {
    const model = this.googleClient.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are an expert ${taskType} specialist for PT. Arunika Teknologi Global.
Generate high-quality, professional output.
Respond in JSON format when appropriate.`,
    });

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return {
      output,
      modelUsed: "gemini-2.0-flash",
      tokensUsed: 0, // Gemini doesn't return token count in same way
    };
  }
}

export const agentExecutionService = new AgentExecutionService();
```

#### Approval Routing Service (Integration)

```typescript
// File: services/approval-routing-service.ts

import { db } from "@/lib/db";
import { sendNotification } from "./notification-service";

export class ApprovalRoutingService {
  /**
   * Agent calls this after completing daily task
   * Submits output to approval_queue, notifies CEO
   */
  async submitForApproval({
    taskId,
    taskType,
    sourceAgentic,
    sourceEmail,
    outputData,
    nextTaskRouting,
    modelUsed,
    tokensUsed,
  }: {
    taskId: string;
    taskType: string;
    sourceAgentic: string;
    sourceEmail: string;
    outputData: any;
    nextTaskRouting?: { next_task_id: string; next_agentic: string };
    modelUsed: string;
    tokensUsed: number;
  }) {
    try {
      // Insert into approval_queue
      const result = await db.query(
        `INSERT INTO approval_queue (
          task_id, task_type, source_agentic, source_email,
          task_title, output_data, status, submitted_by,
          next_task_id, next_agentic, model_used, execution_metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          taskId,
          taskType,
          sourceAgentic,
          sourceEmail,
          `${taskType} for ${new Date().toLocaleDateString()}`,
          JSON.stringify(outputData),
          "pending",
          sourceAgentic,
          nextTaskRouting?.next_task_id,
          nextTaskRouting?.next_agentic,
          modelUsed,
          JSON.stringify({
            api_key_id:
              modelUsed.includes("claude") ? "CLAUDE_API_KEY" : "OPENAI_API_KEY",
            model: modelUsed,
            tokens_used: tokensUsed,
            execution_time_ms: Date.now(),
          }),
        ]
      );

      const approvalRecord = result.rows[0];

      // Notify CEO
      await sendNotification("ceo-agentic", {
        type: "TASK_PENDING_APPROVAL",
        task_id: taskId,
        task_type: taskType,
        from_agent: sourceAgentic,
        summary: `New ${taskType} awaiting your approval`,
        dashboard_url: `https://arunika.app/ceo/approvals/${taskId}`,
      });

      console.log(
        `[APPROVAL SUBMITTED] Task ${taskId} awaiting CEO review`
      );
      return approvalRecord;
    } catch (error) {
      console.error("[APPROVAL SUBMISSION ERROR]:", error);
      throw error;
    }
  }

  /**
   * Agent calls this to get CEO's revision instruction
   */
  async getRevisionInstructions(taskId: string): Promise<string[]> {
    const result = await db.query(
      "SELECT revision_prompts FROM approval_queue WHERE task_id = $1",
      [taskId]
    );

    if (!result.rows.length) return [];
    return result.rows[0].revision_prompts || [];
  }

  /**
   * Agent calls this after completing revision
   * Re-submits updated output back to approval queue
   */
  async resubmitAfterRevision(
    taskId: string,
    revisedOutputData: any,
    sourceAgentic: string
  ) {
    await db.query(
      `UPDATE approval_queue 
       SET output_data = $1, status = 'pending', revision_count = revision_count + 1
       WHERE task_id = $2`,
      [JSON.stringify(revisedOutputData), taskId]
    );

    // Notify CEO again
    await sendNotification("ceo-agentic", {
      type: "REVISION_RESUBMITTED",
      task_id: taskId,
      from_agent: sourceAgentic,
      message: `${sourceAgentic} has resubmitted revised version for review`,
    });

    console.log(`[REVISION RESUBMITTED] Task ${taskId} back to CEO`);
  }

  /**
   * Check approval status
   * Agent polls this to see if their task was approved
   */
  async checkApprovalStatus(taskId: string) {
    const result = await db.query(
      `SELECT status, ceo_command, reviewed_by, next_agentic, 
              revision_prompts, next_task_instruction
       FROM approval_queue WHERE task_id = $1`,
      [taskId]
    );

    if (!result.rows.length) {
      return { status: "NOT_FOUND" };
    }

    const {
      status,
      ceo_command,
      reviewed_by,
      next_agentic,
      revision_prompts,
      next_task_instruction,
    } = result.rows[0];

    return {
      status,
      ceo_command,
      reviewed_by,
      next_agentic,
      revision_prompts,
      next_task_instruction,
    };
  }
}

export const approvalRoutingService = new ApprovalRoutingService();
```

---

## API ENDPOINTS

### 1. GET /api/approvals/pending

```typescript
// app/api/approvals/pending/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const result = await db.query(
      `SELECT id, task_id, task_type, source_agentic, task_title, 
              output_data, created_at, status, revision_count, max_revisions,
              next_task_id, next_agentic
       FROM approval_queue
       WHERE status IN ('pending', 'revision_requested')
       ORDER BY created_at DESC
       LIMIT 20`
    );

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    console.error("[API] Error fetching pending approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}
```

### 2. POST /api/approvals/approve

```typescript
// app/api/approvals/approve/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workflowExecutor } from "@/services/workflow-executor";
import { sendNotification } from "@/services/notification-service";

export async function POST(request: NextRequest) {
  const {
    task_id,
    approved_by,
    ceo_command,
    decision_reason,
    timestamp,
  } = await request.json();

  try {
    // Update approval status
    const result = await db.query(
      `UPDATE approval_queue
       SET status = 'approved',
           ceo_command = $1,
           reviewed_by = $2,
           reviewed_at = $3,
           ceo_decision_reason = $4,
           approval_history = approval_history || jsonb_build_array(
             jsonb_build_object(
               'action', 'APPROVED',
               'by', $2,
               'timestamp', $3,
               'reason', $4
             )
           )
       WHERE task_id = $5
       RETURNING *`,
      [ceo_command, approved_by, timestamp, decision_reason, task_id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const approvalRecord = result.rows[0];
    const {
      source_agentic,
      next_task_id,
      next_agentic,
    } = approvalRecord;

    // Notify source agent
    await sendNotification(source_agentic, {
      type: "APPROVAL_GRANTED",
      task_id,
      approved_by,
      message: `Your task ${task_id} was APPROVED by CEO`,
      can_proceed: true,
    });

    // If there's a next task, route to next agent
    if (next_task_id && next_agentic) {
      console.log(`[ROUTING] Routing task to ${next_agentic}`);

      await workflowExecutor.executeWorkflow(
        next_task_id,
        {
          triggered_by: task_id,
          auto_execute: true,
          approved_output: approvalRecord.output_data,
        },
        "high"
      );

      // Notify next agent
      await sendNotification(next_agentic, {
        type: "NEW_TASK_ASSIGNED",
        task_id: next_task_id,
        parent_task: task_id,
        approved_output: approvalRecord.output_data,
        execute_now: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Task approved and routed",
      next_task: next_task_id,
      next_agentic,
    });
  } catch (error) {
    console.error("[API] Approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve task" },
      { status: 500 }
    );
  }
}
```

### 3. POST /api/approvals/revise

```typescript
// app/api/approvals/revise/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification-service";

export async function POST(request: NextRequest) {
  const {
    task_id,
    ceo_command,
    revision_instruction,
    requested_by,
    decision_reason,
    timestamp,
  } = await request.json();

  try {
    // Get current task
    const getResult = await db.query(
      "SELECT revision_count, max_revisions, source_agentic FROM approval_queue WHERE task_id = $1",
      [task_id]
    );

    if (!getResult.rows.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { revision_count, max_revisions, source_agentic } = getResult.rows[0];

    if (revision_count >= max_revisions) {
      return NextResponse.json(
        { error: `Max revisions (${max_revisions}) reached` },
        { status: 400 }
      );
    }

    // Add revision instruction to JSONB array
    const updateResult = await db.query(
      `UPDATE approval_queue
       SET status = 'revision_requested',
           ceo_command = $1,
           revision_prompts = CASE 
             WHEN revision_prompts IS NULL THEN jsonb_build_array($2)
             ELSE revision_prompts || jsonb_build_array($2)
           END,
           reviewed_by = $3,
           reviewed_at = $4,
           ceo_decision_reason = $5,
           approval_history = approval_history || jsonb_build_array(
             jsonb_build_object(
               'action', 'REVISION_REQUESTED',
               'by', $3,
               'timestamp', $4,
               'instruction', $6,
               'reason', $5
             )
           )
       WHERE task_id = $7
       RETURNING *`,
      [
        ceo_command,
        JSON.stringify({
          revision_number: revision_count + 1,
          instruction: revision_instruction,
          requested_at: timestamp,
          deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
          status: "pending",
        }),
        requested_by,
        timestamp,
        decision_reason,
        revision_instruction,
        task_id,
      ]
    );

    // Notify source agent to revise
    await sendNotification(source_agentic, {
      type: "REVISION_REQUESTED",
      task_id,
      revision_number: revision_count + 1,
      instruction: revision_instruction,
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
      max_revisions,
      requested_by,
      message: `CEO requested revision: "${revision_instruction}"`,
    });

    return NextResponse.json({
      success: true,
      message: "Revision request sent",
      revision_number: revision_count + 1,
      agentic_notified: source_agentic,
    });
  } catch (error) {
    console.error("[API] Revision error:", error);
    return NextResponse.json(
      { error: "Failed to request revision" },
      { status: 500 }
    );
  }
}
```

### 4. POST /api/approvals/reject

```typescript
// app/api/approvals/reject/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification-service";

export async function POST(request: NextRequest) {
  const {
    task_id,
    rejected_by,
    ceo_command,
    decision_reason,
    timestamp,
  } = await request.json();

  try {
    const result = await db.query(
      `UPDATE approval_queue
       SET status = 'rejected',
           ceo_command = $1,
           is_completed = true,
           completed_at = $2,
           reviewed_by = $3,
           reviewed_at = $2,
           ceo_decision_reason = $4,
           approval_history = approval_history || jsonb_build_array(
             jsonb_build_object(
               'action', 'REJECTED',
               'by', $3,
               'timestamp', $2,
               'reason', $4
             )
           )
       WHERE task_id = $5
       RETURNING source_agentic`,
      [ceo_command, timestamp, rejected_by, decision_reason, task_id]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { source_agentic } = result.rows[0];

    // Notify source agent
    await sendNotification(source_agentic, {
      type: "TASK_REJECTED",
      task_id,
      rejected_by,
      reason: decision_reason,
      message: `Your task ${task_id} was REJECTED by CEO and archived`,
      do_not_execute: true,
    });

    return NextResponse.json({
      success: true,
      message: "Task rejected and archived",
      task_archived: task_id,
    });
  } catch (error) {
    console.error("[API] Rejection error:", error);
    return NextResponse.json(
      { error: "Failed to reject task" },
      { status: 500 }
    );
  }
}
```

### 5. POST /api/approvals/approve-with-command

```typescript
// app/api/approvals/approve-with-command/route.ts
// CEO approves task AND sends specific instruction to next agent

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workflowExecutor } from "@/services/workflow-executor";
import { sendNotification } from "@/services/notification-service";
import { agentExecutionService } from "@/services/agent-execution-service";

export async function POST(request: NextRequest) {
  const {
    task_id,
    approved_by,
    ceo_command,
    next_task_instruction,
    decision_reason,
    timestamp,
  } = await request.json();

  try {
    // Update approval record
    const result = await db.query(
      `UPDATE approval_queue
       SET status = 'approved',
           ceo_command = $1,
           next_task_instruction = $2,
           reviewed_by = $3,
           reviewed_at = $4,
           ceo_decision_reason = $5,
           approval_history = approval_history || jsonb_build_array(
             jsonb_build_object(
               'action', 'APPROVED_WITH_COMMAND',
               'by', $3,
               'timestamp', $4,
               'next_instruction', $2,
               'reason', $5
             )
           )
       WHERE task_id = $6
       RETURNING source_agentic, next_agentic, next_task_id, output_data`,
      [
        ceo_command,
        next_task_instruction,
        approved_by,
        timestamp,
        decision_reason,
        task_id,
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const {
      source_agentic,
      next_agentic,
      next_task_id,
      output_data,
    } = result.rows[0];

    // Notify source agent: Approved
    await sendNotification(source_agentic, {
      type: "APPROVAL_GRANTED",
      task_id,
      message: `Task ${task_id} APPROVED. Next agent will handle next steps.`,
    });

    // Execute next task with CEO's instruction
    if (next_agentic && next_task_id) {
      console.log(
        `[NEXT TASK WITH COMMAND] Routing to ${next_agentic} with CEO instruction`
      );

      // Pass approved output + CEO instruction to next agent
      await workflowExecutor.executeWorkflow(
        next_task_id,
        {
          triggered_by: task_id,
          auto_execute: true,
          approved_output: output_data,
          ceo_instruction: next_task_instruction,
        },
        "high"
      );

      // Notify next agent with CEO's specific instruction
      await sendNotification(next_agentic, {
        type: "NEW_TASK_WITH_INSTRUCTION",
        task_id: next_task_id,
        parent_task: task_id,
        approved_output: output_data,
        ceo_instruction: next_task_instruction,
        execute_now: true,
        message: `New task assigned. CEO instruction: "${next_task_instruction}"`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Task approved and next agent notified",
      next_agentic,
      next_task: next_task_id,
    });
  } catch (error) {
    console.error("[API] Approve with command error:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
```

---

## WORKFLOW FLOWS & EXAMPLES

### COMPLETE EXAMPLE: Daily Proposal Generation with Approval

#### Day 1: Operations Agent generates proposal

```typescript
// 09:00 AM - Operations Agent Daily Task
const operationsAgent = {
  name: "operations-agentic",
  email: "direktur.operasional@arunika2045.com",
  preferredModel: "claude",
};

const proposalPrompt = `
Generate a professional business proposal for PT. ABC Corp with:
- Company overview
- Solution overview (Arunika technology solutions)
- ROI projection
- Pricing (3 packages)
- Timeline

Format as JSON.
`;

const result = await agentExecutionService.executeTask(
  taskId: "proposal-001",
  taskType: "proposal",
  agent: operationsAgent,
  prompt: proposalPrompt,
  nextTaskRouting: {
    next_task_id: "send-proposal-001",
    next_agentic: "sales-marketing-agentic"
  }
);

// Output submitted to approval_queue
// status: 'pending'
// CEO gets notification
```

#### Day 1: CEO Reviews and Makes Decision (3 Options)

**OPTION A: APPROVE - Let it auto-route to Sales**
```
CEO clicks [APPROVE]
→ API: POST /api/approvals/approve
→ Database: status = 'approved'
→ Automatic: Notify sales-agentic
→ Automatic: Execute next task (send proposal)
```

**OPTION B: REQUEST REVISION - Send specific instruction**
```
CEO enters: "Fix proposal title to emphasize ROI metrics.
            Change colors to blue #003D7A.
            Max 200 words overview."
CEO clicks [SEND REVISION INSTRUCTION]
→ API: POST /api/approvals/revise
→ Database: status = 'revision_requested'
            revision_prompts = ["Fix title..., Change colors..."]
→ Notify operations-agentic: "Please revise per CEO instruction"
→ Operations Agent fetches instruction, revises, re-submits
→ Back to CEO dashboard for re-review (max 3 revisions)
```

**OPTION C: REJECT - Archive task**
```
CEO enters: "Pricing is too high compared to competitors. Try again tomorrow."
CEO clicks [REJECT]
→ API: POST /api/approvals/reject
→ Database: status = 'rejected', is_completed = true
→ Notify operations-agentic: "Task rejected. Do not execute."
→ Task archived for future reference
```

**OPTION D: APPROVE + SEND COMMAND TO NEXT AGENT**
```
CEO enters: "Send this proposal to ABC Corp.
            Include ROI metrics emphasizing 25% cost savings.
            Ask them to schedule demo call in next 3 days."
CEO clicks [APPROVE & SEND COMMAND]
→ API: POST /api/approvals/approve-with-command
→ Database: status = 'approved'
            next_task_instruction = "Send proposal to ABC Corp..."
→ Notify operations-agentic: "APPROVED"
→ Notify sales-marketing-agentic: "NEW TASK: Send proposal to ABC Corp. CEO instruction: ..."
→ Sales agent automatically uses approved proposal + CEO's instruction
   to send it to ABC Corp with CEO's specific messaging
```

---

## SECURITY & API KEY MANAGEMENT

### Encrypted Key Storage

```typescript
// services/api-key-service.ts

import crypto from "crypto";
import { db } from "@/lib/db";

export class APIKeyService {
  /**
   * Store API key securely in database
   * Keys are encrypted before storage
   */
  async storeKey(
    keyName: string,
    plainTextKey: string,
    provider: "anthropic" | "openai" | "google",
    modelName: string,
    accessibleBy: string[]
  ) {
    const encryptionKey = process.env.API_KEY_ENCRYPTION_KEY!; // 32-byte key
    const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
    let encrypted = cipher.update(plainTextKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    await db.query(
      `INSERT INTO api_key_registry (
        key_name, provider, model_name, encrypted_value, accessible_by, environment
      ) VALUES ($1, $2, $3, $4, $5, 'production')`,
      [keyName, provider, modelName, encrypted, JSON.stringify(accessibleBy)]
    );

    console.log(`[SECURITY] API key ${keyName} stored securely`);
  }

  /**
   * Retrieve and decrypt API key
   * Only for authenticated agents
   */
  async getKey(agentName: string, keyName: string): Promise<string> {
    // Verify agent has access to this key
    const result = await db.query(
      `SELECT encrypted_value, accessible_by 
       FROM api_key_registry 
       WHERE key_name = $1 AND is_active = true`,
      [keyName]
    );

    if (!result.rows.length) {
      throw new Error(`API key ${keyName} not found or inactive`);
    }

    const { encrypted_value, accessible_by } = result.rows[0];

    if (!JSON.parse(accessible_by).includes(agentName)) {
      throw new Error(
        `Agent ${agentName} not authorized to use ${keyName}`
      );
    }

    // Decrypt and return
    const encryptionKey = process.env.API_KEY_ENCRYPTION_KEY!;
    const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
    let decrypted = decipher.update(encrypted_value, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // Log access for audit
    await db.query(
      `INSERT INTO agent_execution_log (agent_name, api_key_id, execution_start)
       VALUES ($1, (SELECT id FROM api_key_registry WHERE key_name = $2), NOW())`,
      [agentName, keyName]
    );

    return decrypted;
  }

  /**
   * Rotate API keys
   * When key expires or needs change
   */
  async rotateKey(
    keyName: string,
    newKeyValue: string
  ) {
    const encryptionKey = process.env.API_KEY_ENCRYPTION_KEY!;
    const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
    let encrypted = cipher.update(newKeyValue, "utf8", "hex");
    encrypted += cipher.final("hex");

    await db.query(
      `UPDATE api_key_registry 
       SET encrypted_value = $1
       WHERE key_name = $2`,
      [encrypted, keyName]
    );

    console.log(`[SECURITY] API key ${keyName} rotated`);
  }

  /**
   * Deactivate key
   * For compromised or deprecated keys
   */
  async deactivateKey(keyName: string) {
    await db.query(
      `UPDATE api_key_registry SET is_active = false WHERE key_name = $1`,
      [keyName]
    );

    console.log(`[SECURITY] API key ${keyName} deactivated`);
  }
}

export const apiKeyService = new APIKeyService();
```

### Environment Setup

```bash
# .env.local (production: use AWS Secrets Manager)

# API KEYS (stored encrypted in database, not in .env)
# Use these for initial setup only, then delete
CLAUDE_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-proj-xxxxx
GEMINI_API_KEY=xxxxx

# Encryption key for storing keys in database
# Generate with: openssl rand -hex 16
API_KEY_ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/arunika_agentic

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SENDGRID_API_KEY=SG.xxxxx

# App
APP_URL=https://arunika.app
NEXT_PUBLIC_API_URL=https://api.arunika.app
```

---

## DEPLOYMENT GUIDE

### Prerequisites

- PostgreSQL 14+ running
- Node.js 18+
- API keys for Claude, OpenAI, Gemini
- Slack workspace (for notifications)
- AWS or compatible S3 for audit logs

### Phase 1: Database Setup (Week 1)

```bash
# 1. Run migrations
psql -U postgres -d arunika_agentic -f database-migrations.sql

# 2. Insert initial API key registry
psql -U postgres -d arunika_agentic << EOF
INSERT INTO api_key_registry (key_name, provider, model_name, accessible_by, environment)
VALUES
  ('CLAUDE_API_KEY', 'anthropic', 'claude-sonnet-4-6', '["operations-agentic", "sales-marketing-agentic", "finance-agentic"]', 'production'),
  ('OPENAI_API_KEY', 'openai', 'gpt-4o', '["sales-marketing-agentic"]', 'production'),
  ('GEMINI_API_KEY', 'google', 'gemini-2.0-flash', '["operations-agentic"]', 'production');
EOF

# 3. Encrypt and store keys
npm run setup:encrypt-keys
```

### Phase 2: Backend Setup (Week 1-2)

```bash
# 1. Install dependencies
npm install

# 2. Create API endpoints
# File: app/api/approvals/*/route.ts

# 3. Implement approval routing service
# File: services/approval-routing-service.ts

# 4. Implement agent execution service
# File: services/agent-execution-service.ts

# 5. Test API endpoints
npm run test:api

# 6. Deploy to staging
npm run deploy:staging
```

### Phase 3: Frontend Setup (Week 2)

```bash
# 1. Create CEO Dashboard component
# File: app/approval/ceo-dashboard.tsx

# 2. Build dashboard pages
# File: app/approval/page.tsx

# 3. Test dashboard
npm run dev
# Visit http://localhost:3000/approval

# 4. UAT with CEO
```

### Phase 4: Integration & Testing (Week 3)

```bash
# 1. Integrate with existing workflows
# Modify: workflow-executor.ts
# Add: approvalRoutingService.submitForApproval() after task completion

# 2. End-to-end testing
# Test: Task generation → Approval submit → CEO decision → Next agent execution

# 3. Load testing
npm run test:load

# 4. Security audit
npm run audit:security
```

### Phase 5: Production Deployment (Week 4)

```bash
# 1. Final pre-flight checks
npm run deploy:preflight

# 2. Deploy to production
npm run deploy:production

# 3. Monitor & verify
npm run monitor:health

# 4. Rollback plan ready (if needed)
```

---

## MONITORING & AUDIT TRAIL

### Audit Logging

```typescript
// services/agent-execution-logger.ts

export class AgentExecutionLogger {
  async log({
    taskId,
    agentName,
    agentEmail,
    modelUsed,
    tokensUsed,
    executionTimeMs,
    status,
    errorMessage,
  }: {
    taskId: string;
    agentName: string;
    agentEmail: string;
    modelUsed: string;
    tokensUsed: number;
    executionTimeMs: number;
    status: "success" | "failed" | "timeout";
    errorMessage?: string;
  }) {
    await db.query(
      `INSERT INTO agent_execution_log (
        task_id, agent_name, agent_email, model_used,
        prompt_tokens, completion_tokens, execution_result, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        taskId,
        agentName,
        agentEmail,
        modelUsed,
        tokensUsed,
        tokensUsed,
        status,
        errorMessage,
      ]
    );

    console.log(
      `[LOG] Task ${taskId} | Agent: ${agentName} | Model: ${modelUsed} | Status: ${status}`
    );
  }

  async generateExecutionReport(fromDate: Date, toDate: Date) {
    const result = await db.query(
      `SELECT 
        agent_name,
        model_used,
        COUNT(*) as total_executions,
        SUM(CASE WHEN execution_result = 'success' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN execution_result = 'failed' THEN 1 ELSE 0 END) as failed,
        AVG(CAST(execution_end - execution_start AS NUMERIC)) as avg_duration_ms,
        SUM(prompt_tokens + completion_tokens) as total_tokens,
        SUM(cost_usd) as total_cost
      FROM agent_execution_log
      WHERE execution_start BETWEEN $1 AND $2
      GROUP BY agent_name, model_used
      ORDER BY total_executions DESC`,
      [fromDate, toDate]
    );

    return result.rows;
  }
}

export const agentExecutionLogger = new AgentExecutionLogger();
```

---

## SUMMARY

### What This System Provides

✅ **CEO Approval Dashboard**
- List of pending approvals
- Task detail preview
- CEO COMMAND FIELD for revision instructions
- 3 action buttons: APPROVE, REVISE, REJECT

✅ **Dynamic Routing**
- After CEO approval, auto-route to next agent
- CEO can specify next agent & task
- Next agent receives approved output + CEO instruction

✅ **Revision Workflow**
- CEO sends specific instruction
- Source agent implements revision
- Agent re-submits for CEO review (max 3 revisions)

✅ **API Key Integration**
- Agents use pre-configured API keys (Claude, OpenAI, Gemini)
- Encrypted storage
- Access control per agent
- Audit trail of API usage

✅ **Complete Audit Trail**
- All decisions logged
- Execution metrics tracked
- Cost monitoring
- Compliance ready

### File Structure

```
app/
├── api/
│   └── approvals/
│       ├── pending/route.ts
│       ├── approve/route.ts
│       ├── approve-with-command/route.ts
│       ├── revise/route.ts
│       └── reject/route.ts
│
├── approval/
│   ├── page.tsx
│   └── ceo-dashboard.tsx
│
└── ...

services/
├── approval-routing-service.ts
├── agent-execution-service.ts
├── api-key-service.ts
└── agent-execution-logger.ts

lib/
└── db.ts (PostgreSQL connection)
```

---

## NEXT STEPS

1. **Week 1**: Set up PostgreSQL schema & API endpoints
2. **Week 2**: Build CEO Dashboard component
3. **Week 3**: Integrate with existing workflows & test end-to-end
4. **Week 4**: UAT with CEO & production deployment
5. **June 9**: Live with Cowork Hybrid

---

**This system is production-ready. All components are documented with code examples.**

**Questions? Contact: corsec@arunika2045.com**
