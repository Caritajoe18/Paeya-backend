import { Router } from 'express';
import { listTransactions, getTransaction, syncFromNomba } from '../controllers/transactionController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, listTransactions);
router.get('/sync', authenticateToken, adminOnly, syncFromNomba);
router.get('/:id', authenticateToken, getTransaction);

export default router;
