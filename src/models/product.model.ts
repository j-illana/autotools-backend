import pool from '../config/db.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// Domain interface — used in controllers and as API contract
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  price: number;
}

// Internal DB row type — extends RowDataPacket so mysql2 generics work
interface ProductRow extends Product, RowDataPacket {}

export async function getAll(): Promise<Product[]> {
  const [rows] = await pool.execute<ProductRow[]>('SELECT * FROM products ORDER BY category, name');
  return rows.map(p => ({ ...p, price: Number(p.price) }));
}

export async function getById(id: string): Promise<Product | null> {
  const [rows] = await pool.execute<ProductRow[]>('SELECT * FROM products WHERE id = ?', [id]);
  if (!rows[0]) return null;
  return { ...rows[0], price: Number(rows[0].price) };
}

export async function create(p: Product): Promise<void> {
  await pool.execute<ResultSetHeader>(
    'INSERT INTO products (id, name, category, stock, min_stock, max_stock, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [p.id, p.name, p.category, p.stock, p.min_stock, p.max_stock, p.price]
  );
}

export async function update(id: string, p: Partial<Omit<Product, 'id'>>): Promise<boolean> {
  const fields = Object.keys(p).map(k => `${k} = ?`).join(', ');
  const values: (string | number)[] = [...Object.values(p) as (string | number)[], id];
  const [result] = await pool.execute<ResultSetHeader>(`UPDATE products SET ${fields} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

export async function remove(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
