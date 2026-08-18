const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

async function main() {
  // Load the database layer, then run the bootstrap explicitly.
  const db = require('../config/db');
  await db.initDatabase();

  const connectionString =
    process.env.SUPABASE_POOLER_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.DATABASE_URL;

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 10000,
  });

  const tables = await pool.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name"
  );
  console.log(JSON.stringify(tables.rows, null, 2));

  await pool.end();
  process.exit(0);
}

main().catch(async (err) => {
  console.error(err);
  process.exitCode = 1;
  process.exit(1);
});
