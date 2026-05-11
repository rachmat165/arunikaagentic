import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';
import { Message, PaginatedResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const messageType = searchParams.get('message_type');

    const offset = (page - 1) * limit;

    // Resolve division UUID from name/slug
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      console.warn(`[messages] Division not found for: "${params.divisionId}"`);
      return NextResponse.json({
        success: true, data: [], total: 0, page, limit, pages: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Build WHERE clause - messages to this division
    let whereConditions = ['to_division_id = $1'];
    let queryParams: any[] = [divisionUUID];
    let paramIndex = 2;

    if (unreadOnly) {
      whereConditions.push(`is_read = false`);
    }

    if (messageType) {
      whereConditions.push(`message_type = $${paramIndex}`);
      queryParams.push(messageType);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM messages WHERE ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // Get paginated data
    const result = await query(
      `SELECT * FROM messages WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const response: PaginatedResponse<Message> = {
      success: true,
      data: result.rows,
      total,
      page,
      limit,
      pages,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Avoid breaking the UI if DB is down/unreachable:
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      page: parseInt(new URL(request.url).searchParams.get('page') || '1'),
      limit: parseInt(new URL(request.url).searchParams.get('limit') || '10'),
      pages: 0,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * PATCH /api/divisions/[divisionId]/messages
 * Mark messages as read.
 * Body: { message_ids: string[] }  — atau kosong untuk mark all as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      return NextResponse.json({ success: false, error: 'Division not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const messageIds: string[] = body?.message_ids ?? [];

    let result;
    if (messageIds.length > 0) {
      // Mark specific messages as read
      result = await query(
        `UPDATE messages
         SET is_read = true, read_at = NOW(), updated_at = NOW()
         WHERE to_division_id = $1::uuid
           AND id = ANY($2::uuid[])
           AND is_read = false
         RETURNING id`,
        [divisionUUID, messageIds]
      );
    } else {
      // Mark all unread messages for this division as read
      result = await query(
        `UPDATE messages
         SET is_read = true, read_at = NOW(), updated_at = NOW()
         WHERE to_division_id = $1::uuid AND is_read = false
         RETURNING id`,
        [divisionUUID]
      );
    }

    return NextResponse.json({
      success: true,
      updated: result.rows.length,
      message: `${result.rows.length} pesan ditandai sudah dibaca`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update messages' },
      { status: 500 }
    );
  }
}
