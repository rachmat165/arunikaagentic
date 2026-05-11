// ============================================================
// ENCRYPTION UTILITY — AES-256-GCM
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 6: Security & API Key Management
//
// Uses AES-256-GCM (authenticated encryption):
//   - Confidentiality: AES-256 symmetric encryption
//   - Integrity: GCM auth tag prevents tampering
//   - Random IV per encryption: same key → different ciphertext
// ============================================================

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;       // 128-bit IV
const AUTH_TAG_LENGTH = 16; // 128-bit GCM auth tag
const KEY_LENGTH = 32;      // 256-bit key

/**
 * Get or derive the encryption key from environment
 * API_KEY_ENCRYPTION_KEY must be 64-char hex string (32 bytes)
 * Generate with: openssl rand -hex 32
 */
function getEncryptionKey(): Buffer {
  const envKey = process.env.API_KEY_ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error(
      'API_KEY_ENCRYPTION_KEY environment variable is not set.\n' +
      'Generate with: openssl rand -hex 32'
    );
  }
  if (envKey.length !== 64) {
    throw new Error(
      `API_KEY_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Got ${envKey.length} chars.`
    );
  }
  return Buffer.from(envKey, 'hex');
}

/**
 * Encrypt a plaintext string
 * Returns: base64(iv + authTag + ciphertext)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv) as crypto.CipherGCM;

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack: iv(16) + authTag(16) + ciphertext
  const packed = Buffer.concat([iv, authTag, encrypted]);
  return packed.toString('base64');
}

/**
 * Decrypt a base64-encoded encrypted string
 * Input: base64(iv + authTag + ciphertext)
 */
export function decrypt(encryptedBase64: string): string {
  const key = getEncryptionKey();
  const packed = Buffer.from(encryptedBase64, 'base64');

  if (packed.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Invalid encrypted data — too short');
  }

  const iv      = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv) as crypto.DecipherGCM;
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Generate a secure random encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Hash a string (for audit log comparison, not for keys)
 */
export function hashSHA256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
