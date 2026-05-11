import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';
import { Approval, PaginatedResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const requestType = searchParams.get('request_type');
    const approvalLevel = searchParams.get('approval_level');
    const offset = (page - 1) * limit;

    // Resolve division UUID from name/slug
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      console.warn(`[approvals] Division not found for: "${params.divisionId}"`);
      return NextResponse.json({
        success: true, data: [], total: 0, page, limit, pages: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Build WHERE clause - approvals pending for this division
    let whereConditions = ['to_division_id = $1'];
    let queryParams: any[] = [divisionUUID];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status); paramIndex++;
    }
    if (requestType) {
      whereConditions.push(`request_type = $${paramIndex}`);
      queryParams.push(requestType); paramIndex++;
    }
    if (approvalLevel) {
      whereConditions.push(`approval_level = $${paramIndex}`);
      queryParams.push(parseInt(approvalLevel)); paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const countResult = await query(
      `SELECT COUNT(*) as count FROM approvals WHERE ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    const result = await query(
      `SELECT
         a.*,
         fd.name as from_division_name,
         td.name as to_division_name
       FROM approvals a
       LEFT JOIN divisions fd ON fd.id = a.from_division_id
       LEFT JOIN divisions td ON td.id = a.to_division_id
       WHERE ${whereClause}
       ORDER BY
         CASE a.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
         a.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const response: PaginatedResponse<Approval> = {
      success: true, data: result.rows, total, page, limit, pages,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json({
      success: true, data: [], total: 0,
      page: parseInt(new URL(request.url).searchParams.get('page') || '1'),
      limit: parseInt(new URL(request.url).searchParams.get('limit') || '10'),
      pages: 0, timestamp: new Date().toISOString(),
    });
  }
}
