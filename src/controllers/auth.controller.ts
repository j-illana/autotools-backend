import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findByEmail } from '../models/user.model.js';
import type { Request, Response } from 'express';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'El correo y la contraseña son requeridos' });
    return;
  }

  const user = await findByEmail(email);

  if (!user) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
