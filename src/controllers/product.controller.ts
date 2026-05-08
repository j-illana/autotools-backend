import type { Request, Response } from 'express';
import * as ProductModel from '../models/product.model.js';
import * as UserModel from '../models/user.model.js';
import { sendLowStockAlert } from '../services/email.service.js';

export async function getAll(_req: Request, res: Response): Promise<void> {
  const products = await ProductModel.getAll();
  res.json(products);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const product = await ProductModel.getById(String(req.params.id));
  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' });
    return;
  }
  res.json(product);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { id, name, category, stock, min_stock, max_stock, price } = req.body;

  if (!id || !name || !category || stock == null || !price) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  await ProductModel.create({ id, name, category, stock, min_stock: min_stock ?? 5, max_stock: max_stock ?? 150, price });
  res.status(201).json({ message: 'Producto creado' });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const ok = await ProductModel.update(id, req.body);
  if (!ok) {
    res.status(404).json({ message: 'Producto no encontrado' });
    return;
  }

  try {
    const product = await ProductModel.getById(id);
    if (product && product.stock <= product.min_stock) {
      const users = await UserModel.getAll();
      const emails = users.map(u => u.email);
      await sendLowStockAlert(product, emails);
    }
  } catch (err) {
    console.error('[email] Error enviando alerta de stock bajo:', err);
  }

  res.json({ message: 'Producto actualizado' });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const ok = await ProductModel.remove(String(req.params.id));
  if (!ok) {
    res.status(404).json({ message: 'Producto no encontrado' });
    return;
  }
  res.json({ message: 'Producto eliminado' });
}
