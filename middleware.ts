// ============================================================
// NEXT.JS MIDDLEWARE — Agent Request Authentication
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 6: Security Layer
//
// Validates x-agent-id header on all /api/approvals/* routes.
// Public routes (pending, approve, etc.) require valid agent ID.
// Admin routes (keys) require CEO agent + admin secret.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Valid agent identifiers
const VALID_AGENTS = new Set([
  'ceo-agentic',
  'operations-agentic',
  'sales-marketing-agentic',
  'finance-agentic',
]);

// Routes requiring CEO-only access
const CEO_ONLY_ROUTES = ['/api/approvals/keys'];

// Routes open to all valid agents
const AGENT_ROUTES = [
  '/api/approvals/pending',
  '/api/approvals/approve',
  '/api/approvals/revise',
  '/api/approvals/reject',
  '/api/approvals/approve-with-command',
  '/api/approvals/submit',
  '/api/approvals/status',
  '/api/monitoring',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /api/approvals/* routes
  if (!pathname.startsWith('/api/approvals')) {
    return NextResponse.next();
  }

  const agentId = request.headers.get('x-agent-id');

  // CEO-only routes
  if (CEO_ONLY_ROUTES.some(r => pathname.startsWith(r))) {
    if (agentId !== 'ceo-agentic') {
      return NextResponse.json(
        { error: 'Unauthorized — CEO access required', code: 'CEO_ONLY' },
        { status: 401 }
      );
    }
  }

  // Agent routes — require valid agent ID
  if (AGENT_ROUTES.some(r => pathname.startsWith(r))) {
    if (!agentId || !VALID_AGENTS.has(agentId)) {
      return NextResponse.json(
        {
          error: 'Unauthorized — valid x-agent-id header required',
          code: 'INVALID_AGENT',
          valid_agents: Array.from(VALID_AGENTS),
        },
        { status: 401 }
      );
    }
  }

  // Add agent ID to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-agent-verified', 'true');
  requestHeaders.set('x-request-timestamp', new Date().toISOString());

  return NextResponse.next({ request: { headers: requestHeaders