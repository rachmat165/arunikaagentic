import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

interface ProspectingData {
  id: number;
  prospect_rank: string;
  prospect_name: string;
  email: string;
  phone: string;
  leader_name: string;
  decision_maker: string;
  key_opportunity: string;
  value_proposition: string;
  estimated_value: string;
  partnership_potential: string;
  location: string;
  status: string;
  quality_score: number;
  market_reach: number;
  engagement_timeline: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  timestamp: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const rank = searchParams.get('rank');

    const offset = (page - 1) * limit;
    const { divisionId } = params;

    // Get division UUID from name or ID
    let divisionUUID = divisionId;

    // If divisionId looks like a name (contains space or specific names), look it up
    if (!divisionId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const divisionLookup = await query(
        `SELECT id FROM divisions WHERE name = $1 OR slug = $2 LIMIT 1`,
        [divisionId, divisionId.toLowerCase().replace(/\s+/g, '-')]
      );

      if (divisionLookup.rows.length > 0) {
        divisionUUID = divisionLookup.rows[0].id;
      }
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

    if (rank) {
      whereConditions.push(`prospect_rank = $${paramIndex}`);
      queryParams.push(rank);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM prospecting_data WHERE ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // Get paginated data
    const result = await query(
      `SELECT
        id,
        prospect_rank,
        prospect_name,
        email,
        phone,
        leader_name,
        decision_maker,
        key_opportunity,
        value_proposition,
        estimated_value,
        partnership_potential,
        location,
        status,
        quality_score,
        market_reach,
        engagement_timeline
      FROM prospecting_data
      WHERE ${whereClause}
      ORDER BY
        CASE prospect_rank
          WHEN 'PRIORITY 1 - VERY HIGH' THEN 1
          WHEN 'PRIORITY 2 - HIGH' THEN 2
          WHEN 'PRIORITY 3 - HIGH' THEN 3
          WHEN 'PRIORITY 4 - MEDIUM-HIGH' THEN 4
          WHEN 'PRIORITY 5 - MEDIUM-HIGH' THEN 5
          ELSE 6
        END
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const response: PaginatedResponse<ProspectingData> = {
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
    console.error('Error fetching prospecting data:', error);

    // Return graceful error response
    return NextResponse.json(
      {
        success: true,
        data: [],
        total: 0,
        page: parseInt(new URL(request.url).searchParams.get('page') || '1'),
        limit: parseInt(new URL(request.url).searchParams.get('limit') || '10'),
        pages: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
