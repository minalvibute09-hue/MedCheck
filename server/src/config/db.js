import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const schemaPath = fileURLToPath(new URL('../../database/schema.sql', import.meta.url));
let pool;

function mysqlOptions(includeDatabase = false) {
  const options = {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || '',
    connectTimeout: 10000
  };

  if (!options.user) {
    throw new Error('MYSQL_USER is required. Configure server/.env before starting the API.');
  }

  if (includeDatabase) options.database = process.env.MYSQL_DATABASE || 'medcheck';
  return options;
}

export async function initializeDatabase() {
  const databaseName = process.env.MYSQL_DATABASE || 'medcheck';
  if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
    throw new Error('MYSQL_DATABASE may contain only letters, numbers, and underscores.');
  }

  try {
    pool = mysql.createPool({
      ...mysqlOptions(true),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z'
    });
    await pool.query('SELECT 1');
  } catch (error) {
    if (pool) await pool.end();
    pool = undefined;
    if (error.code !== 'ER_BAD_DB_ERROR') throw error;

    const bootstrap = await mysql.createConnection(mysqlOptions());
    try {
      await bootstrap.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
      );
    } finally {
      await bootstrap.end();
    }

    pool = mysql.createPool({
      ...mysqlOptions(true),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z'
    });
  }

  const schema = await readFile(schemaPath, 'utf8');
  for (const statement of schema.split(';').map((sql) => sql.trim()).filter(Boolean)) {
    await pool.query(statement);
  }

  await pool.query('SELECT 1');
}

export function getPool() {
  if (!pool) throw new Error('Database is not initialized.');
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
