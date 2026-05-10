/**
 * Backend API Endpoints Examples
 * For: Arunika Agentic AI Divisional Management System
 * Framework: Express.js + TypeScript
 * Database: PostgreSQL
 */

import express, { Request, Response } from 'express';
import { Pool } from 'pg';

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/arunika_db'
});

// ============================================
// 1. DIVISIONS ENDPOINTS
// ============================================

/**
 * GET /api/divisions
 * Fetch all divisions
 */
app.get('/api/divisions', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, name, slug, description, icon, status, sort_order
      FROM divisions
      WHERE status = 'active'
      ORDER BY sort_order ASC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch divisions' });
  }
});

// ============================================
// 2. TASKS ENDPOINTS
// ============================================

/**
 * GET /api/tasks
 * Fetch tasks by division, status, or other filters
 */
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { division, status, assigned_to, priority, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT id, title, description, division_id, assigned_to, status,
             priority, due_date, created_at, updated_at
      FROM tasks
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (division) {
      query += ` AND division_id = $${paramCount++}`;
      params.push(division);
    }

    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }

    if (assigned_to) {
      query += ` AND assigned_to = $${paramCount++}`;
      params.push(assigned_to);
    }

    if (priority) {
      query += ` AND priority = $${paramCount++}`;
      params.push(priority);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit);
    params.push((parseInt(page as string) - 1) * parseInt(limit as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description, division_id, assigned_to, priority, due_date, created_by } = req.body;

    if (!title || !division_id) {
      return res.status(400).json({ success: false, error: 'Title and division_id are required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, division_id, assigned_to, priority, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, status, created_at`,
      [title, description, division_id, assigned_to, priority || 'medium', due_date, created_by]
    );

    // Log to audit
    await pool.query(
      `INSERT INTO audit_log (entity_type, entity_id, action, new_value, performed_by)
       VALUES ('tasks', $1, 'INSERT', $2, $3)`,
      [result.rows[0].id, JSON.stringify(result.rows[0]), created_by]
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task
 */
app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to, updated_by } = req.body;

    // Get old values for audit
    const oldResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const updateResult = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           assigned_to = COALESCE($6, assigned_to),
           updated_by = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, status, priority, due_date, assigned_to, updated_by, id]
    );

    // Log to audit
    await pool.query(
      `INSERT INTO audit_log (entity_type, entity_id, action, old_value, new_value, performed_by)
       VALUES ('tasks', $1, 'UPDATE', $2, $3, $4)`,
      [id, JSON.stringify(oldResult.rows[0]), JSON.stringify(updateResult.rows[0]), updated_by]
    );

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// ============================================
// 3. MAILBOX / MESSAGES ENDPOINTS
// ============================================

/**
 * GET /api/messages
 * Fetch messages for a division
 */
app.get('/api/messages', async (req: Request, res: Response) => {
  try {
    const { to_division_id, unread_only = false, page = 1, limit = 20 } = req.query;

    if (!to_division_id) {
      return res.status(400).json({ success: false, error: 'to_division_id is required' });
    }

    let query = `
      SELECT id, from_division_id, subject, body, is_read, message_type,
             created_at, (SELECT name FROM divisions WHERE id = from_division_id) as from_division
      FROM messages
      WHERE to_division_id = $1
    `;
    const params: any[] = [to_division_id];

    if (unread_only === 'true') {
      query += ` AND is_read = false`;
    }

    query += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
    params.push(limit);
    params.push((parseInt(page as string) - 1) * parseInt(limit as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

/**
 * POST /api/messages
 * Send a message
 */
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { from_division_id, to_division_id, sender_id, subject, body, message_type } = req.body;

    if (!from_division_id || !to_division_id || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'from_division_id, to_division_id, subject, and body are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO messages (from_division_id, to_division_id, sender_id, subject, body, message_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, subject, created_at`,
      [from_division_id, to_division_id, sender_id, subject, body, message_type || 'general']
    );

    // Send notification if enabled
    // await notificationService.sendNotification(to_division_id, 'new_message', result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

/**
 * PUT /api/messages/:id/read
 * Mark message as read
 */
app.put('/api/messages/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE messages
       SET is_read = true, read_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, is_read`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark message as read' });
  }
});

// ============================================
// 4. APPROVALS ENDPOINTS
// ============================================

/**
 * GET /api/approvals
 * Fetch approvals
 */
app.get('/api/approvals', async (req: Request, res: Response) => {
  try {
    const { status = 'pending', approver_id, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT id, request_type, title, description, from_division_id, amount,
             status, created_at, (SELECT name FROM divisions WHERE id = from_division_id) as from_division
      FROM approvals
      WHERE status = $1
    `;
    const params: any[] = [status];

    if (approver_id) {
      query += ` AND approver_id = $2`;
      params.push(approver_id);
    }

    query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit as string)} OFFSET ${(parseInt(page as string) - 1) * parseInt(limit as string)}`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch approvals' });
  }
});

/**
 * POST /api/approvals/:id/approve
 * Approve a request
 */
app.post('/api/approvals/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approval_comment, approver_id } = req.body;

    const result = await pool.query(
      `UPDATE approvals
       SET status = 'approved',
           approval_comment = $1,
           approved_at = CURRENT_TIMESTAMP,
           approver_id = $2,
           updated_by = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, status, approved_at`,
      [approval_comment, approver_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Approval not found' });
    }

    // Log to audit
    await pool.query(
      `INSERT INTO audit_log (entity_type, entity_id, action, performed_by)
       VALUES ('approvals', $1, 'APPROVE', $2)`,
      [id, approver_id]
    );

    res.json({
      success: true,
      message: 'Approval accepted',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ success: false, error: 'Failed to approve request' });
  }
});

/**
 * POST /api/approvals/:id/reject
 * Reject a request
 */
app.post('/api/approvals/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejection_reason, approver_id } = req.body;

    if (!rejection_reason) {
      return res.status(400).json({ success: false, error: 'Rejection reason is required' });
    }

    const result = await pool.query(
      `UPDATE approvals
       SET status = 'rejected',
           rejection_reason = $1,
           rejected_at = CURRENT_TIMESTAMP,
           approver_id = $2,
           updated_by = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, status, rejected_at`,
      [rejection_reason, approver_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Approval not found' });
    }

    // Log to audit
    await pool.query(
      `INSERT INTO audit_log (entity_type, entity_id, action, performed_by)
       VALUES ('approvals', $1, 'REJECT', $2)`,
      [id, approver_id]
    );

    res.json({
      success: true,
      message: 'Approval rejected',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ success: false, error: 'Failed to reject request' });
  }
});

// ============================================
// 5. REPORTS ENDPOINTS
// ============================================

/**
 * GET /api/reports
 * Fetch reports
 */
app.get('/api/reports', async (req: Request, res: Response) => {
  try {
    const { division_id, report_type, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT id, title, report_type, status, generated_at, file_url,
             (SELECT name FROM divisions WHERE id = division_id) as division
      FROM reports
      WHERE status = 'complete'
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (division_id) {
      query += ` AND division_id = $${paramCount++}`;
      params.push(division_id);
    }

    if (report_type) {
      query += ` AND report_type = $${paramCount++}`;
      params.push(report_type);
    }

    query += ` ORDER BY generated_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit);
    params.push((parseInt(page as string) - 1) * parseInt(limit as string));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
});

// ============================================
// 6. DASHBOARD ENDPOINTS
// ============================================

/**
 * GET /api/dashboard/summary
 * Get dashboard summary data
 */
app.get('/api/dashboard/summary', async (req: Request, res: Response) => {
  try {
    const summaryResult = await pool.query(`SELECT * FROM v_division_summary`);

    res.json({
      success: true,
      data: summaryResult.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard summary' });
  }
});

// ============================================
// ERROR HANDLING & SERVER START
// ============================================

// Global error handler
app.use((err: any, req: Request, res: Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Divisional Management API endpoints ready`);
});

export default app;
