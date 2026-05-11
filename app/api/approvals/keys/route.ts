// GET  /api/approvals/keys        — list all keys (metadata only)
// POST /api/approvals/keys        — store/rotate a key
// DELETE /api/approvals/keys      — deactivate a key
// PT. Arunika Teknologi Global | Fase 6: Security

import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/services/api-key-service';

// ── AUTH GUARD ──────────────────────────────────────────────
// Only CEO agent (corsec@arunika2045.com) can manage keys
function isAuthorizedAdmin(request: NextRequest): boolean {
  const agentId = request.headers.get('x-agent-id');
  const adminSecret = request.headers.get('x-admin-secret');
  return agentId === 'ceo-agentic' &&
    adminSecret === process.env.ADMIN_SECRET_KEY;
}

// ── GET: List all keys (metadata, no values) ────────────────
export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('env') as any;
    const keys = await apiKeyService.listKeys(environment || undefined);

    return NextResponse.json({
      success: true,
      count: keys.length,
      keys: keys.map(k => ({
        ...k,
        // Never return encrypted_value in API responses
        encrypted_value: undefined,
        key_preview: `${k.key_name.substring(0, 3)}***`,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── POST: Store or rotate a key ─────────────────────────────
export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, key_name, plain_text_key, provider, model_name,
          accessible_by, environment, notes } = await request.json();

  try {
    if (action === 'store') {
      await apiKeyService.storeKey({
        keyName: key_name,
        plainTextKey: plain_text_key,
        provider,
        modelName: model_name,
        accessibleBy: accessible_by || [],
        environment,
        notes,
      });
      return NextResponse.json({
        success: true,
        message: `Key "${key_name}" stored and encrypted`,
      });
    }

    if (action === 'rotate') {
      await apiKeyService.rotateKey(key_name, plain_text_key);
      return NextResponse.json({
        success: true,
        message: `Key "${key_name}" rotated successfully`,
      });
    }

    if (action === 'grant') {
      const { agent_name } = await request.json();
      await apiKeyService.grantAccess(key_name, agent_name);
      return NextResponse.json({ success: true, message: `Access granted to "${agent_name}"` });
    }

    if (action === 'revoke') {
      const { agent_name } = await request.json();
      await apiKeyService.revokeAccess(key_name, agent_name);
      return NextResponse.json({ success: true, message: `Access revoked from "${agent_name}"` });
    }

    if (action === 'validate') {
      const result = await apiKeyService.validateKey(key_name);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE: Deactivate a key ────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key_name, reason } = await request.json();

  try {
    await apiKeyService.deactivateKey(key_name, reason);
    return NextResponse.json({
      success: true,
      message: `Key "${key_name}" deactivated`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
