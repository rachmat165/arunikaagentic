// ============================================================
// API KEY SERVICE
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 6: Security & API Key Management
//
// Provides: store, get, rotate, deactivate, validate
// Encryption: AES-256-GCM (lib/encryption.ts)
// Storage: PostgreSQL api_key_registry table
// ============================================================

import { query } from '@/lib/database';
import { encrypt, decrypt, hashSHA256 } from '@/lib/encryption';

export type Provider = 'anthropic' | 'openai' | 'google';
export type Environment = 'development' | 'staging' | 'production';

export interface APIKeyRecord {
  id: string;
  key_name: string;
  provider: Provider;
  model_name: string;
  is_active: boolean;
  accessible_by: string[];
  environment: Environment;
  usage_count: number;
  last_used: string | null;
  created_at: string;
  rotated_at: string | null;
  rotation_count: number;
  notes: string | null;
}

export interface StoreKeyParams {
  keyName: string;
  plainTextKey: string;
  provider: Provider;
  modelName: string;
  accessibleBy: string[];
  environment?: Environment;
  notes?: string;
}

/**
 * API KEY SERVICE
 * All API keys are encrypted with AES-256-GCM before storage.
 * Decryption only happens at runtime when an authorized agent requests a key.
 */
export class APIKeyService {

  // ── STORE ──────────────────────────────────────────────

  /**
   * Encrypt and store an API key in the database.
   * Call this once during setup — never store plaintext keys in code.
   */
  async storeKey(params: StoreKeyParams): Promise<void> {
    const {
      keyName, plainTextKey, provider, modelName,
      accessibleBy, environment = 'production', notes,
    } = params;

    if (!plainTextKey || plainTextKey.length < 8) {
      throw new Error('Invalid API key — too short');
    }

    const encryptedValue = encrypt(plainTextKey);

    await query(
      `INSERT INTO api_key_registry
         (key_name, provider, model_name, encrypted_value, accessible_by, environment, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (key_name) DO UPDATE
         SET encrypted_value = EXCLUDED.encrypted_value,
             provider        = EXCLUDED.provider,
             model_name      = EXCLUDED.model_name,
             accessible_by   = EXCLUDED.accessible_by,
             environment     = EXCLUDED.environment,
             notes           = EXCLUDED.notes,
             updated_at      = CURRENT_TIMESTAMP`,
      [keyName, provider, modelName, encryptedValue,
       JSON.stringify(accessibleBy), environment, notes || null]
    );

    console.log(`[SECURITY] API key "${keyName}" stored & encrypted ✓`);
  }

  // ── GET ────────────────────────────────────────────────

  /**
   * Retrieve and decrypt an API key for an authorized agent.
   * Logs every access for audit trail.
   */
  async getKey(agentName: string, keyName: string): Promise<string> {
    const result = await query(
      `SELECT id, encrypted_value, accessible_by, is_active
       FROM api_key_registry
       WHERE key_name = $1`,
      [keyName]
    );

    if (!result.rows.length) {
      throw new Error(`API key "${keyName}" not found in registry`);
    }

    const { id, encrypted_value, accessible_by, is_active } = result.rows[0];

    if (!is_active) {
      throw new Error(`API key "${keyName}" is deactivated`);
    }

    const allowedAgents: string[] = Array.isArray(accessible_by)
      ? accessible_by
      : JSON.parse(accessible_by || '[]');

    if (!allowedAgents.includes(agentName)) {
      throw new Error(
        `Agent "${agentName}" is not authorized to use key "${keyName}". ` +
        `Allowed: ${allowedAgents.join(', ')}`
      );
    }

    // Decrypt
    const plainTextKey = decrypt(encrypted_value);

    // Log access (non-blocking)
    query(
      `UPDATE api_key_registry
       SET last_used = CURRENT_TIMESTAMP, usage_count = usage_count + 1
       WHERE id = $1`,
      [id]
    ).catch(err => console.error('[API KEY LOG ERROR]', err));

    return plainTextKey;
  }

  // ── ROTATE ─────────────────────────────────────────────

  /**
   * Rotate an API key (replace with new value).
   * Old encrypted value is overwritten — rotation is immediate.
   */
  async rotateKey(keyName: string, newPlainTextKey: string): Promise<void> {
    if (!newPlainTextKey || newPlainTextKey.length < 8) {
      throw new Error('Invalid new API key — too short');
    }

    const encryptedValue = encrypt(newPlainTextKey);

    const result = await query(
      `UPDATE api_key_registry
       SET encrypted_value  = $1,
           rotated_at       = CURRENT_TIMESTAMP,
           rotation_count   = rotation_count + 1,
           updated_at       = CURRENT_TIMESTAMP
       WHERE key_name = $2
       RETURNING key_name, rotation_count`,
      [encryptedValue, keyName]
    );

    if (!result.rows.length) {
      throw new Error(`API key "${keyName}" not found — cannot rotate`);
    }

    console.log(
      `[SECURITY] API key "${keyName}" rotated ✓ ` +
      `(rotation #${result.rows[0].rotation_count})`
    );
  }

  // ── DEACTIVATE ─────────────────────────────────────────

  /**
   * Deactivate a compromised or deprecated key.
   * Key remains in DB for audit trail but cannot be used.
   */
  async deactivateKey(keyName: string, reason?: string): Promise<void> {
    const result = await query(
      `UPDATE api_key_registry
       SET is_active = false,
           notes = COALESCE(notes, '') || $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE key_name = $2
       RETURNING key_name`,
      [`\n[DEACTIVATED ${new Date().toISOString()}]: ${reason || 'Manual deactivation'}`, keyName]
    );

    if (!result.rows.length) {
      throw new Error(`API key "${keyName}" not found`);
    }

    console.log(`[SECURITY] API key "${keyName}" deactivated ✓`);
  }

  // ── REACTIVATE ─────────────────────────────────────────

  /**
   * Reactivate a previously deactivated key.
   */
  async reactivateKey(keyName: string): Promise<void> {
    await query(
      `UPDATE api_key_registry
       SET is_active = true, updated_at = CURRENT_TIMESTAMP
       WHERE key_name = $1`,
      [keyName]
    );
    console.log(`[SECURITY] API key "${keyName}" reactivated ✓`);
  }

  // ── LIST ───────────────────────────────────────────────

  /**
   * List all API keys (metadata only, never the key values).
   */
  async listKeys(environment?: Environment): Promise<APIKeyRecord[]> {
    const result = await query(
      `SELECT id, key_name, provider, model_name, is_active,
              accessible_by, environment, usage_count, last_used,
              created_at, rotated_at, rotation_count, notes
       FROM api_key_registry
       ${environment ? 'WHERE environment = $1' : ''}
       ORDER BY provider, key_name`,
      environment ? [environment] : []
    );
    return result.rows as APIKeyRecord[];
  }

  // ── VALIDATE ───────────────────────────────────────────

  /**
   * Validate that a key can be decrypted (for setup verification).
   * Returns true if key is stored and decryptable.
   */
  async validateKey(keyName: string): Promise<{ valid: boolean; provider: string; model: string }> {
    try {
      const result = await query(
        `SELECT encrypted_value, provider, model_name
         FROM api_key_registry WHERE key_name = $1 AND is_active = true`,
        [keyName]
      );

      if (!result.rows.length) return { valid: false, provider: '', model: '' };

      const { encrypted_value, provider, model_name } = result.rows[0];
      const decrypted = decrypt(encrypted_value);

      return {
        valid: decrypted.length > 0,
        provider,
        model: model_name,
      };
    } catch {
      return { valid: false, provider: '', model: '' };
    }
  }

  // ── GRANT / REVOKE ACCESS ──────────────────────────────

  /**
   * Grant an additional agent access to a key.
   */
  async grantAccess(keyName: string, agentName: string): Promise<void> {
    await query(
      `UPDATE api_key_registry
       SET accessible_by = (
         SELECT jsonb_agg(DISTINCT elem)
         FROM jsonb_array_elements(
           accessible_by || $1::jsonb
         ) AS elem
       ),
       updated_at = CURRENT_TIMESTAMP
       WHERE key_name = $2`,
      [JSON.stringify([agentName]), keyName]
    );
    console.log(`[SECURITY] Granted "${agentName}" access to "${keyName}" ✓`);
  }

  /**
   * Revoke an agent's access to a key.
   */
  async revokeAccess(keyName: string, agentName: string): Promise<void> {
    await query(
      `UPDATE api_key_registry
       SET accessible_by = (
         SELECT jsonb_agg(elem)
         FROM jsonb_array_elements(accessible_by) AS elem
         WHERE elem::text != $1
       ),
       updated_at = CURRENT_TIMESTAMP
       WHERE key_name = $2`,
      [JSON.stringify(agentName), keyName]
    );
    console.log(`[SECURITY] Revoked "${agentName}" access to "${keyName}" ✓`);
  }
}

export const apiKeyService = new APIKeyService();
