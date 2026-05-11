/**
 * Type definitions for Divisional Management System
 */

export interface Division {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  head_id?: string;
  status: string;
  sort_order: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  division_id: string;
  assigned_to?: string;
  assigned_by?: string;
  status: 'new' | 'in-progress' | 'pending-approval' | 'completed' | 'rejected' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_notes?: string;
  attachment_urls?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by?: string;
}

export interface Message {
  id: string;
  from_division_id: string;
  to_division_id: string;
  sender_id: string;
  recipient_id?: string;
  subject: string;
  body: string;
  message_type: 'general' | 'task-notification' | 'approval-request' | 'system-alert' | 'report-generated';
  is_read: boolean;
  is_archived: boolean;
  read_at?: string;
  attachment_urls?: string[];
  reply_to_id?: string;
  thread_id?: string;
  priority: 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  division_id: string;
  title: string;
  report_type: 'sales-performance' | 'marketing-campaigns' | 'financial' | 'operational' | 'compliance';
  description?: string;
  content?: Record<string, any>;
  file_url?: string;
  file_size_bytes?: number;
  status: 'processing' | 'complete' | 'failed' | 'scheduled';
  generated_by?: string;
  generated_at?: string;
  scheduled_for?: string;
  frequency?: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period_start?: string;
  period_end?: string;
  metadata?: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  request_type: 'task' | 'budget' | 'hiring' | 'report' | 'policy' | 'other';
  request_id?: string;
  from_division_id: string;
  to_division_id: string;
  approver_id?: string;
  approval_level: number; // 1 = first level, 2 = director, 3 = CEO
  title: string;
  description?: string;
  details?: Record<string, any>;
  amount?: number;
  currency?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked' | 'expired';
  approval_comment?: string;
  rejection_reason?: string;
  approved_at?: string;
  rejected_at?: string;
  approver_notes?: string;
  expires_at?: string;
  priority: 'normal' | 'high' | 'urgent';
  attachment_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  timestamp: string;
}
