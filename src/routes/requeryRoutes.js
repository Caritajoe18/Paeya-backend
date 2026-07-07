import { Router } from 'express';
import { requeryBySessionId, requeryByTransactionRef, requeryBySubAccount } from '../controllers/requeryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/session/:sessionId', authenticateToken, requeryBySessionId);
router.get('/transaction/:transactionRef', authenticateToken, requeryByTransactionRef);
router.get('/sub-account/:subAccountId/transaction/:transactionRef', authenticateToken, requeryBySubAccount);

export default router;
