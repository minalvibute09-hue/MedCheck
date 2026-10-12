import { getPool } from '../config/db.js';

export async function createUser({ id, fullName, email, passwordHash }) {
  const [result] = await getPool().execute(
    'INSERT INTO users (id, full_name, email, password_hash) VALUES (?, ?, ?, ?)',
    [id, fullName, email, passwordHash]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await getPool().execute(
    'SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await getPool().execute(
    'SELECT id, full_name, email, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

export function toPublicUser(user) {
  return { id: user.id, fullName: user.full_name, email: user.email };
}
