import { Pool, PoolClient } from 'pg';

let pool: Pool;

/**
 * Initialize database connection pool
 * Uses environment variables:
 * - DATABASE_URL: Full connection string
 * - Or individual: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */
export function initializeDatabase() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please configure your database connection.'
    );
  }

  pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

/**
 * Get database connection
 */
export function getDatabase(): Pool {
  if (!pool) {
    initializeDatabase();
  }
  return pool;
}

/**
 * Execute a query
 */
export async function query(text: string, params?: any[]) {
  const client = await getDatabase().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getDatabase().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close database connections
 */
export async function closeDatabase() {
  if (pool) {
    await pool.end();
  }
}
