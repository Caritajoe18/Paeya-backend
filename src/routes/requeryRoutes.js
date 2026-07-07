import { Router } from 'express';
import { requeryBySessionId, requeryByTransactionRef } from '../controllers/requeryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/session/:sessionId', authenticateToken, requeryBySessionId);
router.get('/transaction/:transactionRef', authenticateToken, requeryByTransactionRef);

export default router;
