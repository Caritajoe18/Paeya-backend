import { Router } from 'express';
import { createCheckoutSession, getCheckoutStatus } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/checkout', authenticateToken, createCheckoutSession);
router.get('/checkout/:reference', authenticateToken, getCheckoutStatus);

export default router;
