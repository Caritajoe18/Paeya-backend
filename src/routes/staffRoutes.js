import { Router } from 'express';
import { listStaff, getStaff, createStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, listStaff);
router.get('/:id', authenticateToken, getStaff);
router.post('/', authenticateToken, adminOnly, createStaff);
router.put('/:id', authenticateToken, adminOnly, updateStaff);
router.delete('/:id', authenticateToken, adminOnly, deleteStaff);

export default router;
