#!/usr/bin/env node

/**
 * Database Setup Script for Arunika Agentic AI
 * Creates PostgreSQL database and runs migrations
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

async function setupDatabase() {
  console.log('\n============================================');
  console.log('Database Setup - Arunika Agentic AI');
  console.log('============================================\n');

  const scriptDir = __dirname;
  const migrationsFile = path.join(scriptDir, 'database-migrations.sql');

  // Check if migrations file exists
  if (!fs.existsSync(migrationsFile)) {
    console.error('[ERROR] database-migrations.sql not found at:', migrationsFile);
    process.exit(1);
  }

  try {
    // Step 1: Create Database
    console.log('Step 1: Creating database "arunika_agentic"...');
    try {
      const createDbCommand = `psql -U postgres -c "CREATE DATABASE arunika_agentic;"`;
      const { stdout, stderr } = await execPromise(createDbCommand);
      console.log('[OK] Database created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('[INFO] Database already exists, continuing...');
      } else {
        console.log('[INFO] Database may already exist, continuing...');
      }
    }

    // Step 2: Run Migrations
    console.log('\nStep 2: Running migrations...');
    const runMigrationsCommand = `psql -U postgres -d arunika_agentic -f "${migrationsFile}"`;
    try {
      const { stdout, stderr } = await execPromise(runMigrationsCommand);
      if (stderr && !stderr.includes('NOTICE')) {
        console.log('[WARNING]', stderr);
      }
      console.log('[OK] Migrations completed successfully');
    } catch (error) {
      console.error('[ERROR] Migration failed:', error.message);
      process.exit(1);
    }

    // Step 3: Verify Setup
    console.log('\nStep 3: Verifying setup...');
    const verifyCommand = `psql -U postgres -d arunika_agentic -c "SELECT COUNT(*) as division_count FROM divisions;"`;
    try {
      const { stdout, stderr } = await execPromise(verifyCommand);
      console.log('[OK] Verification successful');
      console.log(stdout);
    } catch (error) {
      console.error('[ERROR] Verification failed:', error.message);
      process.exit(1);
    }

    console.log('\n============================================');
    console.log('Database Setup Complete!');
    console.log('============================================\n');
    console.log('Next steps:');
    console.log('1. Stop the dev server (Ctrl+C)');
    console.log('2. Run: npm run dev');
    console.log('3. Refresh browser at http://localhost:3000\n');

  } catch (error) {
    console.error('[ERROR] Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
