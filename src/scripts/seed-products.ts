import pool from '../config/db.js';

const products = [
  { id: 'ENG-202', name: 'Bujía de Iridio NGK', category: 'Electricidad', stock: 145, min_stock: 10, max_stock: 150, price: 12.50 },
  { id: 'ENG-315', name: 'Correa de Distribución Gates', category: 'Motor', stock: 33, min_stock: 10, max_stock: 100, price: 28.90 },
  { id: 'ENG-401', name: 'Bobina de Encendido Bosch', category: 'Electricidad', stock: 27, min_stock: 5, max_stock: 80, price: 54.00 },
  { id: 'ENG-512', name: 'Sensor de Oxígeno Denso', category: 'Electricidad', stock: 18, min_stock: 5, max_stock: 80, price: 38.75 },
  { id: 'ENG-608', name: 'Tapa de Válvulas Victor Reinz', category: 'Motor', stock: 9, min_stock: 5, max_stock: 50, price: 22.40 },
  { id: 'TRN-045', name: 'Kit de Embrague LUK', category: 'Transmisión', stock: 4, min_stock: 3, max_stock: 30, price: 185.00 },
  { id: 'TRN-133', name: 'Aceite de Transmisión Castrol', category: 'Transmisión', stock: 62, min_stock: 10, max_stock: 100, price: 15.90 },
  { id: 'TRN-280', name: 'Sello de Transmisión National', category: 'Transmisión', stock: 11, min_stock: 5, max_stock: 50, price: 8.20 },
  { id: 'FLT-112', name: 'Filtro de Aceite Bosch', category: 'Mantenimiento', stock: 58, min_stock: 10, max_stock: 100, price: 8.75 },
  { id: 'FLT-220', name: 'Filtro de Aire Mann', category: 'Mantenimiento', stock: 41, min_stock: 10, max_stock: 100, price: 11.30 },
  { id: 'FLT-334', name: 'Filtro de Combustible Hengst', category: 'Mantenimiento', stock: 35, min_stock: 10, max_stock: 100, price: 9.60 },
  { id: 'FLT-450', name: 'Filtro de Habitáculo Mahle', category: 'Mantenimiento', stock: 0, min_stock: 5, max_stock: 50, price: 7.80 },
  { id: 'BRK-880', name: 'Pastillas de Freno Brembo', category: 'Frenos', stock: 22, min_stock: 5, max_stock: 60, price: 45.20 },
  { id: 'BRK-910', name: 'Disco de Freno Zimmermann', category: 'Frenos', stock: 14, min_stock: 5, max_stock: 40, price: 68.00 },
  { id: 'BRK-975', name: 'Líquido de Frenos Motul DOT4', category: 'Frenos', stock: 50, min_stock: 10, max_stock: 100, price: 6.50 },
  { id: 'BRK-1020', name: 'Calibrador de Freno Cardone', category: 'Frenos', stock: 6, min_stock: 3, max_stock: 20, price: 110.00 },
  { id: 'SUS-310', name: 'Amortiguador Delantero Monroe', category: 'Suspensión', stock: 11, min_stock: 5, max_stock: 40, price: 95.00 },
  { id: 'SUS-422', name: 'Resorte de Suspensión Sachs', category: 'Suspensión', stock: 8, min_stock: 5, max_stock: 30, price: 72.00 },
  { id: 'SUS-515', name: 'Buje de Control Moog', category: 'Suspensión', stock: 3, min_stock: 3, max_stock: 30, price: 18.40 },
  { id: 'SUS-601', name: 'Rótula de Dirección TRW', category: 'Suspensión', stock: 20, min_stock: 5, max_stock: 50, price: 31.00 },
];

for (const product of products) {
  await pool.execute(
    'INSERT INTO products (id, name, category, stock, min_stock, max_stock, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product.id, product.name, product.category, product.stock, product.min_stock, product.max_stock, product.price]
  );
  console.log(`✓ ${product.id} — ${product.name}`);
}

console.log('Seed completed');
process.exit(0);
