#!/usr/bin/env ts-node
// ============================================================
// SETUP: ENCRYPT & STORE API KEYS
// PT. Arunika Teknologi Global | corsec@arunika2045.com
// Fase 6: Security Setup Script
//
// Usage:
//   npx ts-node scripts/setup-encrypt-keys.ts
//   npm run setup:encrypt-keys
//
// Prerequisites:
//   1. PostgreSQL running with approval-workflow-migrations.sql applied
//   2. .env.local set with:
//      DATABASE_URL, API_KEY_ENCRYPTION_KEY,
//      CLAUDE_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY
// ============================================================

import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { apiKeyService } from '../services/api-key-service';
import { generateEncryptionKey } from '../lib/encryption';
import { initializeDatabase, closeDatabase } from '../lib/database';

async function main() {
  console.log('\n================================================');
  console.log('  ARUNIKA AGENTIC — API KEY SETUP');
  console.log('  PT. Arunika Teknologi Global');
  console.log('================================================\n');

  // Step 1: Check encryption key
  if (!process.env.API_KEY_ENCRYPTION_KEY) {
    console.log('⚠️  API_KEY_ENCRYPTION_KEY not set in .env.local');
    console.log('   Generating a new one for you:\n');
    const newKey = generateEncryptionKey();
    console.log(`   API_KEY_ENCRYPTION_KEY=${newKey}\n`);
    console.log('   → Add this to your .env.local and re-run this script.\n');
    process.exit(1);
  }

  // Step 2: Initialize database
  console.log('📦 Connecting to database...');
  initializeDatabase();
  console.log('   ✓ Connected\n');

  // Step 3: Define keys to store
  const keysToStore = [
    {
      keyName: 'CLAUDE_API_KEY',
      envVar: 'CLAUDE_API_KEY',
      provider: 'anthropic' as const,
      modelName: 'claude-sonnet-4-6',
      accessibleBy: [
        'operations-agentic',
        'sales-marketing-agentic',
        'finance-agentic',
        'ceo-agentic',
      ],
      notes: 'Primary model — Anthropic Claude Sonnet 4.6',
    },
    {
      keyName: 'OPENAI_API_KEY',
      envVar: 'OPENAI_API_KEY',
      provider: 'openai' as const,
      modelName: 'gpt-4o',
      accessibleBy: ['sales-marketing-agentic'],
      notes: 'OpenAI GPT-4o — Sales & Marketing content generation',
    },
    {
      keyName: 'GEMINI_API_KEY',
      envVar: 'GEMINI_API_KEY',
      provider: 'google' as const,
      modelName: 'gemini-2.0-flash',
      accessibleBy: ['operations-agentic', 'finance-agentic'],
      notes: 'Google Gemini 2.0 Flash — Document & financial processing',
    },
  ];

  // Step 4: Encrypt and store each key
  let stored = 0;
  let skipped = 0;

  console.log('🔐 Encrypting and storing API keys...\n');

  for (const keyConfig of keysToStore) {
    const plainTextKey = process.env[keyConfig.envVar];

    if (!plainTextKey || plainTextKey.includes('xxxxx') || plainTextKey.length < 10) {
      console.log(`   ⚠️  SKIPPED  ${keyConfig.keyName}`);
      console.log(`          Reason: ${keyConfig.envVar} not set or is a placeholder\n`);
      skipped++;
      continue;
    }

    try {
      await apiKeyService.storeKey({
        keyName: keyConfig.keyName,
        plainTextKey,
        provider: keyConfig.provider,
        modelName: keyConfig.modelName,
        accessibleBy: keyConfig.accessibleBy,
        environment: 'production',
        notes: keyConfig.notes,
      });
      console.log(`   ✅ STORED   ${keyConfig.keyName}`);
      console.log(`          Provider: ${keyConfig.provider} | Model: ${keyConfig.modelName}`);
      console.log(`          Accessible by: ${keyConfig.accessibleBy.join(', ')}\n`);
      stored++;
    } catch (err: any) {
      console.log(`   ❌ FAILED   ${keyConfig.keyName}: ${err.message}\n`);
    }
  }

  // Step 5: Validate stored keys
  console.log('🔍 Validating stored keys...\n');
  for (const keyConfig of keysToStore) {
    const validation = await apiKeyService.validateKey(keyConfig.keyName);
    const icon = validation.valid ? '✅' : '⚠️ ';
    const msg = validation.valid
      ? `Valid — ${validation.provider} / ${validation.model}`
      : 'Not found or invalid';
    console.log(`   ${icon} ${keyConfig.keyName.padEnd(20)} ${msg}`);
  }

  // Step 6: Summary
  console.log('\n================================================');
  console.log(`  SETUP COMPLETE`);
  console.log(`  Stored: ${stored} key(s) | Skipped: ${skipped} key(s)`);
  console.log('\n  NEXT STEPS:');
  console.log('  1. Remove plaintext API keys from .env.local');
  console.log('     (keys are now encrypted in the database)');
  console.log('  2. Keep API_KEY_ENCRYPTION_KEY safe — back it up!');
  console.log('  3. Run: npm run dev');
  console.log('  4. Visit: http://localhost:3000/approval');
  console.log('================================================\n');

  await closeDatabase();
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
