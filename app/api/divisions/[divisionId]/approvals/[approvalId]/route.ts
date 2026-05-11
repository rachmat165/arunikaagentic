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

    // Update approval record (use actual column names from DB schema)
    const result = await query(
      `UPDATE approvals
       SET status = $1,
           approver_notes = COALESCE($2, approver_notes),
           approver_id = COALESCE($3::uuid, approver_id),
           approved_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE approved_at END,
           rejected_at = CASE WHEN $1 = 'rejected' THEN NOW() ELSE rejected_at END,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [newStatus, notes || null, null, params.approvalId]
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
  } catch (error) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process approval action' },
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
