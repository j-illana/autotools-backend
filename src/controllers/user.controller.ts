import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import * as UserModel from '../models/user.model.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export async function getAll(_req: AuthRequest, res: Response): Promise<void> {
  const users = await UserModel.getAll();
  res.json(users);
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  const user = await UserModel.getById(Number(req.params.id));
  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const id = await UserModel.create({ name, email, password: hash, role });
  res.status(201).json({ message: 'Usuario creado', id });
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  const data = { ...req.body };

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const ok = await UserModel.update(Number(req.params.id), data);
  if (!ok) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.json({ message: 'Usuario actualizado' });
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  const ok = await UserModel.remove(Number(req.params.id));
  if (!ok) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.json({ message: 'Usuario eliminado' });
}
