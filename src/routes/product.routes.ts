import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as ProductController from '../controllers/product.controller.js';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', authMiddleware, ProductController.create);
router.put('/:id', authMiddleware, ProductController.update);
router.delete('/:id', authMiddleware, ProductController.remove);

export default router;
