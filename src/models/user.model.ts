import pool from '../config/db.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'worker';
  created_at: Date;
}

export async function findByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute<User[]>('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

export async function getAll(): Promise<Omit<User, 'password'>[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, name, email, role, created_at FROM users ORDER BY name'
  );
  return rows as Omit<User, 'password'>[];
}

export async function getById(id: number): Promise<Omit<User, 'password'> | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return (rows[0] as Omit<User, 'password'>) ?? null;
}

export async function create(u: { name: string; email: string; password: string; role: 'admin' | 'worker' }): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [u.name, u.email, u.password, u.role]
  );
  return result.insertId;
}

export async function update(id: number, u: Partial<{ name: string; email: string; password: string; role: 'admin' | 'worker' }>): Promise<boolean> {
  const fields = Object.keys(u).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(u), id];
  const [result] = await pool.execute<ResultSetHeader>(`UPDATE users SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
