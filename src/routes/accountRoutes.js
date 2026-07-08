import { Router } from 'express';
import { getBalance } from '../controllers/accountController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/balance', authenticateToken, getBalance);

export default router;
