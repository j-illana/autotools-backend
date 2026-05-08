import nodemailer from 'nodemailer';
import type { Product } from '../models/product.model.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendLowStockAlert(product: Product, recipientEmails: string[]): Promise<void> {
  if (recipientEmails.length === 0) return;

  const html = `
    <h2>Alerta de Stock Bajo</h2>
    <p>El siguiente producto se encuentra en nivel de stock crítico:</p>
    <table>
      <tr><td><b>ID:</b></td><td>${product.id}</td></tr>
      <tr><td><b>Producto:</b></td><td>${product.name}</td></tr>
      <tr><td><b>Categoría:</b></td><td>${product.category}</td></tr>
      <tr><td><b>Stock actual:</b></td><td><strong>${product.stock}</strong></td></tr>
      <tr><td><b>Stock mínimo:</b></td><td>${product.min_stock}</td></tr>
    </table>
    <p>Por favor, gestione la reposición a la brevedad.</p>
  `;

  await Promise.all(
    recipientEmails.map(email =>
      transporter.sendMail({
        from: `"AutoTools Inventario" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `⚠️ Stock bajo: ${product.name}`,
        html,
      })
    )
  );
}
