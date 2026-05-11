// ============================================================
// AGENT EXECUTION LOGGER
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 7: Monitoring & Audit Trail
// ============================================================

import { query } from '@/lib/database';

export interface LogParams {
  taskId: string;
  agentName: string;
  agentEmail?: string;
  modelUsed?: string;
  apiKeyName?: string;
  promptTokens?: number;
  completionTokens?: number;
  executionTimeMs?: number;
  status: 'success' | 'failed' | 'timeout' | 'error' | 'pending';
  errorMessage?: string;
  outputPreview?: string;
  metadata?: any;
}

export interface ExecutionReport {
  agent_name: string;
  model_used: string;
  total_executions: number;
  successful: number;
  failed: number;
  avg_execution_ms: number;
  total_tokens_used: number;
  total_cost_usd: number;
}

/**
 * AGENT EXECUTION LOGGER
 * Records every agent task execution for audit, compliance & cost tracking
 */
export class AgentExecutionLogger {
  /**
   * Log a single agent execution
   */
  async log(params: LogParams): Promise<void> {
    const {
      taskId, agentName, agentEmail, modelUsed, apiKeyName,
      promptTokens = 0, completionTokens = 0, executionTimeMs,
      status, errorMessage, outputPreview, metadata,
    } = params;

    const totalTokens = promptTokens + completionTokens;

    // Estimate cost (rough approximation)
    const costUsd = this.estimateCost(modelUsed || '', totalTokens);

    try {
      await query(
        `INSERT INTO agent_execution_log (
          task_id, agent_name, agent_email, model_used, api_key_name,
          prompt_tokens, completion_tokens, total_tokens, cost_usd,
          execution_time_ms, execution_result,
          error_message, output_preview, metadata,
          execution_end
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
          CASE WHEN $11 != 'pending' THEN CURRENT_TIMESTAMP ELSE NULL END)`,
        [
          taskId, agentName, agentEmail || null, modelUsed || null, apiKeyName || null,
          promptTokens, completionTokens, totalTokens, costUsd,
          executionTimeMs || null, status,
          errorMessage || null,
          outputPreview ? outputPreview.substring(0, 500) : null,
          JSON.stringify(metadata || {}),
        ]
      );

      console.log(
        `[LOG] Task: ${taskId} | Agent: ${agentName} | Model: ${modelUsed} | ` +
        `Status: ${status} | Tokens: ${totalTokens} | Cost: $${costUsd.toFixed(4)}`
      );
    } catch (err) {
      // Non-critical — never let logging failures break execution
      console.error('[LOGGER ERROR]', err);
    }
  }

  /**
   * Generate execution report for date range
   */
  async generateReport(fromDate: Date, toDate: Date): Promise<ExecutionReport[]> {
    const result = await query(
      `SELECT
        agent_name,
        model_used,
        COUNT(*)::integer AS total_executions,
        SUM(CASE WHEN execution_result = 'success' THEN 1 ELSE 0 END)::integer AS successful,
        SUM(CASE WHEN execution_result = 'failed' THEN 1 ELSE 0 END)::integer AS failed,
        COALESCE(ROUND(AVG(execution_time_ms)::numeric, 0), 0)::integer AS avg_execution_ms,
        COALESCE(SUM(total_tokens), 0)::integer AS total_tokens_used,
        COALESCE(ROUND(SUM(cost_usd)::numeric, 4), 0)::numeric AS total_cost_usd
       FROM agent_execution_log
       WHERE execution_start BETWEEN $1 AND $2
       GROUP BY agent_name, model_used
       ORDER BY total_executions DESC`,
      [fromDate, toDate]
    );
    return result.rows as ExecutionReport[];
  }

  /**
   * Get recent executions for a specific agent
   */
  async getAgentHistory(agentName: string, limit = 20) {
    const result = await query(
      `SELECT task_id, model_used, total_tokens, cost_usd,
              execution_time_ms, execution_result, created_at
       FROM agent_execution_log
       WHERE agent_name = $1
       ORDER BY execution_start DESC
       LIMIT $2`,
      [agentName, limit]
    );
    return result.rows;
  }

  /**
   * Estimate cost based on model and token count
   */
  private estimateCost(model: string, totalTokens: number): number {
    const rates: Record<string, number> = {
      'claude-sonnet-4-6': 0.000015,   // ~$15 per 1M tokens avg
      'claude-opus-4-6': 0.000075,      // ~$75 per 1M tokens avg
      'gpt-4o': 0.000010,               // ~$10 per 1M tokens avg
      'gemini-2.0-flash': 0.000001,     // ~$1 per 1M tokens (very cheap)
    };
    const rate = rates[model] || 0.000015;
    return totalTokens * rate;
  }
}

export const agentExecutionLogger = new AgentExecutionLogger();
