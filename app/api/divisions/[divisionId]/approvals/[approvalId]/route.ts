/**
 * PATCH /api/divisions/[divisionId]/approvals/[approvalId]
 * CEO atau Division Head melakukan Approve / Reject / Request Revision
 * Setelah keputusan dibuat, notifikasi otomatis dikirim ke mailbox divisi pengaju.
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';

/** Buat pesan notifikasi ke mailbox divisi pengaju */
async function sendApprovalNotification(
  approvalRecord: any,
  newStatus: string,
  notes: string | null,
  approverDivisionId: string
) {
  const { from_division_id, title, request_type } = approvalRecord;

  const labelMap: Record<string, string> = {
    approved: '✅ DISETUJUI',
    rejected: '❌ DITOLAK',
    'revision-needed': '🔄 PERLU REVISI',
  };
  const priorityMap: Record<string, string> = {
    approved: 'normal',
    rejected: 'high',
    'revision-needed': 'high',
  };
  const actionMap: Record<string, string> = {
    approved: 'Anda dapat segera melanjutkan eksekusi rencana yang telah disetujui.',
    rejected:
      'Permohonan Anda ditolak. Tinjau kembali proposal dan ajukan ulang dengan penyesuaian yang diperlukan.',
    'revision-needed':
      'Permohonan Anda memerlukan revisi sebelum dapat disetujui. Silakan perbaiki sesuai catatan dan ajukan kembali.',
  };

  const label = labelMap[newStatus] ?? newStatus.toUpperCase();
  const subject = `[${label}] ${title || request_type || 'Permohonan Approval'}`;
  const body = [
    `Status permohonan Anda telah diperbarui oleh CEO / Division Head.`,
    ``,
    `Status   : ${label}`,
    `Judul    : ${title || request_type || '-'}`,
    `Tanggal  : ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
    notes ? `Catatan  : ${notes}` : null,
    ``,
    actionMap[newStatus],
  ]
    .filter((line) => line !== null)
    .join('\n');

  await query(
    `INSERT INTO messages
       (from_division_id, to_division_id, sender_id, subject, body, message_type, is_read, priority)
     VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, 'approval-response', false, $6)`,
    [
      approverDivisionId,  // CEO / division penyetuju sebagai pengirim
      from_division_id,    // divisi pengaju sebagai penerima
      SYSTEM_USER_ID,
      subject,
      body,
      priorityMap[newStatus] ?? 'normal',
    ]
  );
}

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
    const { action, notes } = body;

    if (!action || !['approve', 'reject', 'revision'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be: approve | reject | revision' },
        { status: 400 }
      );
    }

    // Verify the approval belongs to this division
    const existing = await query(
      `SELECT a.*,
              fd.name as from_division_name,
              td.name as to_division_name
       FROM approvals a
       LEFT JOIN divisions fd ON fd.id = a.from_division_id
       LEFT JOIN divisions td ON td.id = a.to_division_id
       WHERE a.id = $1::uuid AND a.to_division_id = $2::uuid`,
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

    // Jika approved, update status task terkait jika ada
    if (newStatus === 'approved' && currentApproval.request_id) {
      await query(
        `UPDATE tasks SET status = 'completed', updated_at = NOW()
         WHERE id = $1::uuid`,
        [currentApproval.request_id]
      ).catch(() => { /* ignore if request_id is not a task UUID */ });
    }

    // Kirim notifikasi ke mailbox divisi pengaju
    await sendApprovalNotification(
      currentApproval,
      newStatus,
      notes || null,
      divisionUUID
    ).catch((err) => {
      console.error('[approval notify] Failed to send notification message:', err?.message);
      // Non-fatal: jangan gagalkan response utama
    });

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: `Approval ${newStatus} successfully`,
      notification_sent: true,
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
       WHERE a.id = $1::uuid AND a.to_division_id = $2::uuid`,
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
