import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';
import { Report, PaginatedResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const reportType = searchParams.get('report_type');

    const offset = (page - 1) * limit;

    // Resolve division UUID from name/slug
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      console.warn(`[reports] Division not found for: "${params.divisionId}"`);
      return NextResponse.json({
        success: true, data: [], total: 0, page, limit, pages: 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Build WHERE clause
    let whereConditions = ['division_id = $1'];
    let queryParams: any[] = [divisionUUID];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (reportType) {
      whereConditions.push(`report_type = $${paramIndex}`);
      queryParams.push(reportType);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM reports WHERE ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // Get paginated data
    const result = await query(
      `SELECT * FROM reports WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const response: PaginatedResponse<Report> = {
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
    console.error('Error fetching reports:', error);
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
