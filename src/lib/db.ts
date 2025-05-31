import { Pool, QueryResult } from 'pg';

let pool: Pool;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon DB
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  });

  pool.on('connect', () => {
    console.log('✅ Connected to Neon PostgreSQL database!');
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
  });
} catch (error) {
  console.error('❌ Failed to initialize Neon PostgreSQL connection pool:', error);
  throw error;
}

/**
 * Execute a database query with parameters
 * @param text SQL query string
 * @param params Query parameters
 * @returns Promise<QueryResult>
 */
export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

/**
 * Get a client from the pool for transactions
 * @returns Promise<PoolClient>
 */
export const getClient = () => {
  return pool.connect();
};

/**
 * Close the database pool
 * @returns Promise<void>
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
};

export default pool;
