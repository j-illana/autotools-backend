import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';
import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/', authMiddleware, adminOnly, UserController.getAll);
router.get('/:id', authMiddleware, adminOnly, UserController.getById);
router.post('/', authMiddleware, adminOnly, UserController.create);
router.put('/:id', authMiddleware, adminOnly, UserController.update);
router.delete('/:id', authMiddleware, adminOnly, UserController.remove);

export default router;
