// ============================================================
// AGENT EXECUTION SERVICE
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 7: AI Model Integration & Agent Orchestration
//
// Supports three AI providers:
//   - Anthropic Claude (claude-sonnet-4-6) — primary
//   - OpenAI GPT-4o — sales & marketing content
//   - Google Gemini 2.0 Flash — documents & financial
//
// Flow:
//   1. Agent receives task with model preference
//   2. Service fetches decrypted API key from registry
//   3. Calls appropriate AI SDK
//   4. Logs execution (tokens, cost, latency)
//   5. Submits output to approval queue
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKeyService } from './api-key-service';
import { agentExecutionLogger } from './agent-execution-logger';
import { approvalRoutingService } from './approval-routing-service';
import { query } from '@/lib/database';

// ── Types ──────────────────────────────────────────────────

export type AgentName =
  | 'ceo-agentic'
  | 'operations-agentic'
  | 'sales-marketing-agentic'
  | 'finance-agentic';

export type ModelProvider = 'anthropic' | 'openai' | 'google';

export interface ExecuteTaskParams {
  /** Which agent is executing */
  agentName: AgentName;
  /** Task type for categorization */
  taskType: string;
  /** System prompt for the agent */
  systemPrompt: string;
  /** User/task content */
  userPrompt: string;
  /** AI model to use */
  model?: string;
  /** Max tokens for response */
  maxTokens?: number;
  /** Whether to submit result for CEO approval */
  submitForApproval?: boolean;
  /** Next agent in chain (if any) */
  nextAgentTarget?: string;
  /** Priority level */
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface ExecuteTaskResult {
  success: boolean;
  content: string;
  model: string;
  provider: ModelProvider;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCost: number;
  taskId?: string;        // Approval queue task ID if submitted
  approvalStatus?: string;
  error?: string;
}

// Model → provider mapping
const MODEL_PROVIDER_MAP: Record<string, ModelProvider> = {
  'claude-sonnet-4-6':        'anthropic',
  'claude-3-5-sonnet-20241022': 'anthropic',
  'claude-opus-4-6':          'anthropic',
  'gpt-4o':                   'openai',
  'gpt-4o-mini':              'openai',
  'gemini-2.0-flash':         'google',
  'gemini-1.5-pro':           'google',
};

// Default model per agent
const AGENT_DEFAULT_MODELS: Record<AgentName, string> = {
  'ceo-agentic':             'claude-sonnet-4-6',
  'operations-agentic':      'claude-sonnet-4-6',
  'sales-marketing-agentic': 'gpt-4o',
  'finance-agentic':         'gemini-2.0-flash',
};

// API key name per provider
const PROVIDER_KEY_NAME: Record<ModelProvider, string> = {
  anthropic: 'CLAUDE_API_KEY',
  openai:    'OPENAI_API_KEY',
  google:    'GEMINI_API_KEY',
};

// ── Agent Execution Service ────────────────────────────────

export class AgentExecutionService {

  // ── MAIN EXECUTE ──────────────────────────────────────

  /**
   * Execute an AI task for a given agent.
   * Automatically selects model, fetches key, calls AI, logs, optionally submits for approval.
   */
  async executeTask(params: ExecuteTaskParams): Promise<ExecuteTaskResult> {
    const startTime = Date.now();

    const {
      agentName,
      taskType,
      systemPrompt,
      userPrompt,
      model: requestedModel,
      maxTokens = 2048,
      submitForApproval = true,
      nextAgentTarget,
      priority = 'normal',
      metadata = {},
    } = params;

    // Resolve model and provider
    const model = requestedModel || AGENT_DEFAULT_MODELS[agentName];
    const provider = MODEL_PROVIDER_MAP[model] || 'anthropic';
    const keyName = PROVIDER_KEY_NAME[provider];

    console.log(`[AGENT EXEC] ${agentName} → ${model} (${provider})`);

    let result: ExecuteTaskResult;

    try {
      // Fetch decrypted API key
      const apiKey = await apiKeyService.getKey(agentName, keyName);

      // Call appropriate AI provider
      let content: string;
      let inputTokens = 0;
      let outputTokens = 0;

      switch (provider) {
        case 'anthropic':
          ({ content, inputTokens, outputTokens } =
            await this.callClaude(apiKey, model, systemPrompt, userPrompt, maxTokens));
          break;

        case 'openai':
          ({ content, inputTokens, outputTokens } =
            await this.callOpenAI(apiKey, model, systemPrompt, userPrompt, maxTokens));
          break;

        case 'google':
          ({ content, inputTokens, outputTokens } =
            await this.callGemini(apiKey, model, systemPrompt, userPrompt, maxTokens));
          break;

        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      const latencyMs = Date.now() - startTime;
      const totalTokens = inputTokens + outputTokens;
      const estimatedCost = this.estimateCost(model, totalTokens);

      // Log execution
      await agentExecutionLogger.log({
        agentName,
        taskType,
        model,
        provider,
        inputTokens,
        outputTokens,
        totalTokens,
        latencyMs,
        estimatedCostUsd: estimatedCost,
        success: true,
        outputPreview: content.substring(0, 200),
        metadata,
      });

      result = {
        success: true,
        content,
        model,
        provider,
        inputTokens,
        outputTokens,
        totalTokens,
        latencyMs,
        estimatedCost,
      };

      // Submit for CEO approval if requested
      if (submitForApproval) {
        const approvalRecord = await approvalRoutingService.submitForApproval({
          sourceAgentic: agentName,
          nextAgentTarget: nextAgentTarget || null,
          taskType,
          priority,
          inputData: { systemPrompt, userPrompt, ...metadata },
          outputData: { content, model, provider, tokens: totalTokens },
        });

        result.taskId = approvalRecord.id;
        result.approvalStatus = 'pending';

        console.log(`[AGENT EXEC] Submitted for approval → task_id: ${approvalRecord.id}`);
      }

    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      await agentExecutionLogger.log({
        agentName,
        taskType,
        model,
        provider,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        latencyMs,
        estimatedCostUsd: 0,
        success: false,
        errorMessage: error.message,
        metadata,
      }).catch(() => {}); // Don't throw on log failure

      result = {
        success: false,
        content: '',
        model,
        provider,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        latencyMs,
        estimatedCost: 0,
        error: error.message,
      };
    }

    return result;
  }

  // ── CLAUDE (Anthropic) ────────────────────────────────

  private async callClaude(
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number
  ): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    return {
      content,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  // ── OPENAI ────────────────────────────────────────────

  private async callOpenAI(
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number
  ): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content || '';
    const usage = response.usage;

    return {
      content,
      inputTokens: usage?.prompt_tokens || 0,
      outputTokens: usage?.completion_tokens || 0,
    };
  }

  // ── GEMINI (Google) ───────────────────────────────────

  private async callGemini(
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number
  ): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({
      model,
      systemInstruction: systemPrompt,
    });

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    });

    const response = result.response;
    const content = response.text();
    const usage = response.usageMetadata;

    return {
      content,
      inputTokens: usage?.promptTokenCount || 0,
      outputTokens: usage?.candidatesTokenCount || 0,
    };
  }

  // ── COST ESTIMATION ───────────────────────────────────

  private estimateCost(model: string, totalTokens: number): number {
    const rates: Record<string, number> = {
      'claude-sonnet-4-6':          0.000015,
      'claude-3-5-sonnet-20241022': 0.000015,
      'claude-opus-4-6':            0.000075,
      'gpt-4o':                     0.000010,
      'gpt-4o-mini':                0.000001,
      'gemini-2.0-flash':           0.000001,
      'gemini-1.5-pro':             0.000004,
    };
    const rate = rates[model] || 0.000010;
    return parseFloat((totalTokens * rate).toFixed(6));
  }

  // ── BATCH EXECUTION ───────────────────────────────────

  /**
   * Execute multiple tasks in parallel (for a single agent).
   * Limits concurrency to 3 simultaneous calls.
   */
  async executeBatch(
    agentName: AgentName,
    tasks: Array<Omit<ExecuteTaskParams, 'agentName'>>
  ): Promise<ExecuteTaskResult[]> {
    const CONCURRENCY = 3;
    const results: ExecuteTaskResult[] = [];

    for (let i = 0; i < tasks.length; i += CONCURRENCY) {
      const batch = tasks.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(task => this.executeTask({ ...task, agentName }))
      );
      results.push(...batchResults);
    }

    return results;
  }

  // ── HEALTH CHECK ──────────────────────────────────────

  /**
   * Test connectivity to all AI providers.
   * Returns health status per provider.
   */
  async healthCheck(agentName: AgentName = 'ceo-agentic'): Promise<{
    anthropic: { ok: boolean; latencyMs?: number; error?: string };
    openai:    { ok: boolean; latencyMs?: number; error?: string };
    google:    { ok: boolean; latencyMs?: number; error?: string };
  }> {
    const testPrompt = 'Reply with exactly: OK';

    const checkProvider = async (
      provider: ModelProvider,
      model: string
    ): Promise<{ ok: boolean; latencyMs?: number; error?: string }> => {
      const start = Date.now();
      try {
        const keyName = PROVIDER_KEY_NAME[provider];
        const apiKey = await apiKeyService.getKey(agentName, keyName);

        let content = '';
        if (provider === 'anthropic') {
          ({ content } = await this.callClaude(apiKey, model, 'You are a health check service.', testPrompt, 10));
        } else if (provider === 'openai') {
          ({ content } = await this.callOpenAI(apiKey, model, 'You are a health check service.', testPrompt, 10));
        } else {
          ({ content } = await this.callGemini(apiKey, model, 'You are a health check service.', testPrompt, 10));
        }

        return { ok: content.includes('OK'), latencyMs: Date.now() - start };
      } catch (err: any) {
        return { ok: false, latencyMs: Date.now() - start, error: err.message };
      }
    };

    const [anthropic, openai, google] = await Promise.all([
      checkProvider('anthropic', 'claude-sonnet-4-6'),
      checkProvider('openai',    'gpt-4o'),
      checkProvider('google',    'gemini-2.0-flash'),
    ]);

    return { anthropic, openai, google };
  }
}

export const agentExecutionService = new AgentExecutionService();
