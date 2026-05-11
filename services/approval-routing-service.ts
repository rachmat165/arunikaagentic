// ============================================================
// APPROVAL ROUTING SERVICE
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 4: Agent Implementation & Integration
// ============================================================

import { query } from '@/lib/database';

export interface SubmitForApprovalParams {
  taskId: string;
  taskType: string;
  taskTitle?: string;
  sourceAgentic: string;
  sourceEmail: string;
  outputData: any;
  nextTaskRouting?: { next_task_id: string; next_agentic: string };
  modelUsed?: string;
  tokensUsed?: number;
}

export interface ApprovalStatus {
  status: string;
  ceo_command?: string;
  reviewed_by?: string;
  next_agentic?: string;
  revision_prompts?: any[];
  next_task_instruction?: string;
}

/**
 * APPROVAL ROUTING SERVICE
 * Handles submission, revision, and status checking for approval workflow
 */
export class ApprovalRoutingService {
  /**
   * STEP 1: Agent submits completed task for CEO approval
   * Called after agent finishes daily task
   */
  async submitForApproval(params: SubmitForApprovalParams) {
    const {
      taskId, taskType, taskTitle, sourceAgentic, sourceEmail,
      outputData, nextTaskRouting, modelUsed, tokensUsed,
    } = params;

    const generatedTitle = taskTitle || `${taskType} — ${new Date().toLocaleDateString('id-ID')}`;

    const result = await query(
      `INSERT INTO approval_queue (
        task_id, task_type, task_title, source_agentic, source_email,
        output_data, status, submitted_by,
        next_task_id, next_agentic, model_used, execution_metadata,
        approval_history
      ) VALUES ($1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,$10,$11,$12)
      ON CONFLICT (task_id) DO UPDATE SET
        output_data = EXCLUDED.output_data,
        status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        taskId, taskType, generatedTitle, sourceAgentic, sourceEmail,
        JSON.stringify(outputData), sourceAgentic,
        nextTaskRouting?.next_task_id || null,
        nextTaskRouting?.next_agentic || null,
        modelUsed || 'claude-sonnet-4-6',
        JSON.stringify({
          model: modelUsed,
          tokens_used: tokensUsed || 0,
          submitted_at: new Date().toISOString(),
        }),
        JSON.stringify([{
          action: 'SUBMITTED',
          by: sourceAgentic,
          timestamp: new Date().toISOString(),
        }]),
      ]
    );

    // Send notification to CEO
    await this.sendNotification({
      taskId,
      type: 'TASK_PENDING_APPROVAL',
      from: sourceAgentic,
      to: 'ceo-agentic',
      payload: {
        message: `New ${taskType} awaiting your approval`,
        task_title: generatedTitle,
        from_agent: sourceAgentic,
        dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/approval/${taskId}`,
      },
    });

    console.log(`[APPROVAL SUBMITTED] Task ${taskId} — awaiting CEO review`);
    return result.rows[0];
  }

  /**
   * STEP 2: Agent calls this to get CEO's revision instructions
   */
  async getRevisionInstructions(taskId: string): Promise<any[]> {
    const result = await query(
      `SELECT revision_prompts FROM approval_queue WHERE task_id = $1`,
      [taskId]
    );
    if (!result.rows.length) return [];
    return result.rows[0].revision_prompts || [];
  }

  /**
   * STEP 3: Agent re-submits after implementing CEO revision
   */
  async resubmitAfterRevision(
    taskId: string,
    revisedOutputData: any,
    sourceAgentic: string
  ) {
    const existing = await query(
      `SELECT revision_count, approval_history FROM approval_queue WHERE task_id = $1`,
      [taskId]
    );
    if (!existing.rows.length) throw new Error(`Task ${taskId} not found`);

    const { revision_count, approval_history } = existing.rows[0];
    const newHistory = [
      ...(approval_history || []),
      {
        action: 'RESUBMITTED',
        by: sourceAgentic,
        revision_number: revision_count + 1,
        timestamp: new Date().toISOString(),
      },
    ];

    await query(
      `UPDATE approval_queue
       SET output_data = $1,
           status = 'revision_resubmitted',
           revision_count = revision_count + 1,
           approval_history = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $3`,
      [JSON.stringify(revisedOutputData), JSON.stringify(newHistory), taskId]
    );

    // Notify CEO of resubmission
    await this.sendNotification({
      taskId,
      type: 'REVISION_RESUBMITTED',
      from: sourceAgentic,
      to: 'ceo-agentic',
      payload: {
        message: `${sourceAgentic} has resubmitted revised version (revision #${revision_count + 1})`,
        task_id: taskId,
      },
    });

    console.log(`[REVISION RESUBMITTED] Task ${taskId} — revision #${revision_count + 1} back to CEO`);
  }

  /**
   * STEP 4: Check approval status (agent polls this)
   */
  async checkApprovalStatus(taskId: string): Promise<ApprovalStatus> {
    const result = await query(
      `SELECT status, ceo_command, reviewed_by, next_agentic,
              revision_prompts, next_task_instruction
       FROM approval_queue WHERE task_id = $1`,
      [taskId]
    );
    if (!result.rows.length) return { status: 'NOT_FOUND' };
    return result.rows[0] as ApprovalStatus;
  }

  /**
   * Internal: Send notification between agents
   */
  private async sendNotification({
    taskId, type, from, to, payload,
  }: {
    taskId: string;
    type: string;
    from: string;
    to: string;
    payload: any;
  }) {
    try {
      await query(
        `INSERT INTO agent_notifications
         (task_id, notification_type, from_agent, to_agent, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [taskId, type, from, to, JSON.stringify(payload)]
      );
    } catch (err) {
      // Non-critical — log but don't throw
      console.error('[NOTIFICATION ERROR]', err);
    }
  }
}

export const approvalRoutingService = new ApprovalRoutingService();
