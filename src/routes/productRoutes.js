import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', authenticateToken, getProduct);
router.post('/', authenticateToken, adminOnly, upload.single('photo'), createProduct);
router.put('/:id', authenticateToken, adminOnly, upload.single('photo'), updateProduct);

export default router;
