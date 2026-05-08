import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const users = [
  { name: 'Joseph Illana', email: 'joseph.illana.j@gmail.com', password: 'prueba123', role: 'admin' },
  { name: 'Joseph Illana', email: 'joseph.illana@outlook.com', password: 'prueba123', role: 'worker' },
];

for (const user of users) {
  const hash = await bcrypt.hash(user.password, 10);
  await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [user.name, user.email, hash, user.role]
  );
  console.log(`✓ ${user.name} (${user.email}) inserted`);
}

console.log('Seed completed');
process.exit(0);
