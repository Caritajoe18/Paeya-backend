import { Router } from 'express';
import { listTransactions, getTransaction, syncFromNomba, filterNombaTransactions } from '../controllers/transactionController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, listTransactions);
router.get('/sync', authenticateToken, adminOnly, syncFromNomba);
router.post('/sync/filter', authenticateToken, adminOnly, filterNombaTransactions);
router.get('/:id', authenticateToken, getTransaction);

export default router;
