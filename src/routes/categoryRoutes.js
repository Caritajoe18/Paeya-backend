import { Router } from 'express';
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
} from '../controllers/categoryController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, listCategories);
router.get('/:id', authenticateToken, getCategory);
router.post('/', authenticateToken, adminOnly, createCategory);
router.put('/:id', authenticateToken, adminOnly, updateCategory);

export default router;
