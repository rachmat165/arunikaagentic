// ============================================================
// POST /api/approvals/submit
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 7: Agent Task Submission Endpoint
//
// Used by agents to submit a task for AI execution + approval.
// The agent sends task parameters → service executes AI call
// → result goes to CEO approval queue.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { agentExecutionService, AgentName } from '@/services/agent-execution-service';

export async function POST(request: NextRequest) {
  // Agent identity (validated by middleware)
  const agentId = request.headers.get('x-agent-id') as AgentName;

  if (!agentId) {
    return NextResponse.json(
      { error: 'Missing x-agent-id header', code: 'MISSING_AGENT' },
      { status: 401 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    task_type,
    system_prompt,
    user_prompt,
    model,
    max_tokens,
    submit_for_approval = true,
    next_agent_target,
    priority = 'normal',
    metadata = {},
  } = body;

  // Validate required fields
  if (!task_type || typeof task_type !== 'string') {
    return NextResponse.json({ error: 'task_type is required' }, { status: 400 });
  }
  if (!system_prompt || typeof system_prompt !== 'string') {
    return NextResponse.json({ error: 'system_prompt is required' }, { status: 400 });
  }
  if (!user_prompt || typeof user_prompt !== 'string') {
    return NextResponse.json({ error: 'user_prompt is required' }, { status: 400 });
  }

  try {
    const result = await agentExecutionService.executeTask({
      agentName: agentId,
      taskType: task_type,
      systemPrompt: system_prompt,
      userPrompt: user_prompt,
      model,
      maxTokens: max_tokens,
      submitForApproval: submit_for_approval,
      nextAgentTarget: next_agent_target,
      priority,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          agent: agentId,
          model: result.model,
          latency_ms: result.latencyMs,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      agent: agentId,
      model: result.model,
      provider: result.provider,
      content: result.content,
      tokens: {
        input: result.inputTokens,
        output: result.outputTokens,
        total: result.totalTokens,
      },
      estimated_cost_usd: result.estimatedCost,
      latency_ms: result.latencyMs,
      approval: submit_for_approval
        ? { task_id: result.taskId, status: result.approvalStatus }
        : null,
    });

  } catch (error: any) {
    console.error('[SUBMIT ROUTE ERROR]', error);
    return NextResponse.json(
      { error: error.message, code: 'EXECUTION_FAILED' },
      { status: 500 }
    );
  }
}
