import { Router } from 'express';
import { createCheckoutOrder, getCheckoutStatus } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/checkout-order', authenticateToken, createCheckoutOrder);
router.get('/checkout-order/:reference', authenticateToken, getCheckoutStatus);

export default router;
