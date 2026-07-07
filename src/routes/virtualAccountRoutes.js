import { Router } from 'express';
import { createVirtualAccount, lookupVirtualAccount, suspendVirtualAccount } from '../controllers/virtualAccountController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, adminOnly, createVirtualAccount);
router.get('/:virtualAcctNumber', authenticateToken, lookupVirtualAccount);
router.put('/:accountId/suspend', authenticateToken, adminOnly, suspendVirtualAccount);

export default router;
