import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { resolveDivisionId } from '@/lib/division-resolver';
import { Task, PaginatedResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const offset = (page - 1) * limit;

  const emptyResponse: PaginatedResponse<Task> = {
    success: true, data: [], total: 0, page, limit, pages: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // Resolve division UUID from name, slug, or UUID
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      console.warn(`[tasks] Division not found for: "${params.divisionId}"`);
      return NextResponse.json(emptyResponse);
    }

    let whereConditions = ['division_id = $1'];
    let queryParams: any[] = [divisionUUID];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status); paramIndex++;
    }
    if (priority) {
      whereConditions.push(`priority = $${paramIndex}`);
      queryParams.push(priority); paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    const countResult = await query(
      `SELECT COUNT(*) as count FROM tasks WHERE ${whereClause}`, queryParams
    );
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    const result = await query(
      `SELECT
         id, title, description, status, priority,
         TO_CHAR(created_at, 'DD/MM/YYYY') as "assignedDate",
         TO_CHAR(due_date, 'DD/MM/YYYY') as "dueDate",
         COALESCE(assigned_to::text, 'Tim Divisi') as assignee,
         created_at, updated_at
       FROM tasks
       WHERE ${whereClause}
       ORDER BY
         CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
         created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true, data: result.rows, total, page, limit, pages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(emptyResponse);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { divisionId: string } }
) {
  try {
    const divisionUUID = await resolveDivisionId(params.divisionId);
    if (!divisionUUID) {
      return NextResponse.json({ success: false, error: 'Division not found' }, { status: 404 });
    }
    const body = await request.json();
    const { title, description, priority = 'medium', due_date, assigned_to } = body;
    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    const result = await query(
      `INSERT INTO tasks (title, description, division_id, priority, due_date, assigned_to, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new') RETURNING *`,
      [title, description, divisionUUID, priority, due_date, assigned_to]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}
