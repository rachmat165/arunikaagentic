/**
 * PATCH /api/divisions/[divisionId]/approvals/[approvalId]
 * CEO atau Division Head melakukan Approve / Reject / Request Revision
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { divisionId: string; approvalId: string } }
) {
  try {
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      return NextResponse.json(
        { success: false, error: 'Division not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action, notes, approved_by } = body;

    if (!action || !['approve', 'reject', 'revision'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be: approve | reject | revision' },
        { status: 400 }
      );
    }

    // Verify the approval belongs to this division
    const existing = await query(
      `SELECT * FROM approvals WHERE id = $1 AND to_division_id = $2`,
      [params.approvalId, divisionUUID]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Approval not found or does not belong to this division' },
        { status: 404 }
      );
    }

    const currentApproval = existing.rows[0];
    if (currentApproval.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Cannot act on approval with status: ${currentApproval.status}` },
        { status: 409 }
      );
    }

    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revision-needed',
    };

    const newStatus = statusMap[action];

    // Fix audit trigger jika masih bermasalah (safe to run multiple times)
    await query(`
      CREATE OR REPLACE FUNCTION log_changes()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'DELETE' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, old_value, performed_by)
          VALUES (TG_TABLE_NAME, OLD.id::text, 'DELETE', row_to_json(OLD), OLD.updated_by);
        ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, old_value, new_value, performed_by)
          VALUES (TG_TABLE_NAME, NEW.id::text, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NEW.updated_by);
        ELSIF TG_OP = 'INSERT' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, new_value, performed_by)
          VALUES (TG_TABLE_NAME, NEW.id::text, 'INSERT', row_to_json(NEW), NEW.created_by);
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `).catch(() => { /* ignore if trigger fix fails, non-critical */ });

    // Update approval record
    const result = await query(
      `UPDATE approvals
       SET status = $1::varchar,
           approver_notes = COALESCE($2::text, approver_notes),
           approved_at = CASE WHEN $1::text = 'approved' THEN NOW() ELSE approved_at END,
           rejected_at = CASE WHEN $1::text = 'rejected' THEN NOW() ELSE rejected_at END,
           updated_at = NOW()
       WHERE id = $3::uuid
       RETURNING *`,
      [newStatus, notes || null, params.approvalId]
    );

    // If approved, also update the related task status if linked
    if (newStatus === 'approved' && currentApproval.request_id) {
      await query(
        `UPDATE tasks SET status = 'completed', updated_at = NOW()
         WHERE id = $1::uuid`,
        [currentApproval.request_id]
      ).catch(() => { /* ignore if request_id is not a task UUID */ });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: `Approval ${newStatus} successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process approval action' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string; approvalId: string } }
) {
  try {
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      return NextResponse.json({ success: false, error: 'Division not found' }, { status: 404 });
    }

    const result = await query(
      `SELECT a.*,
              fd.name as from_division_name,
              td.name as to_division_name
       FROM approvals a
       LEFT JOIN divisions fd ON fd.id = a.from_division_id
       LEFT JOIN divisions td ON td.id = a.to_division_id
       WHERE a.id = $1 AND a.to_division_id = $2`,
      [params.approvalId, divisionUUID]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Approval not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching approval detail:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch approval' }, { status: 500 });
  }
}
