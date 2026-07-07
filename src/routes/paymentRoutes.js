import { Router } from 'express';
import { createCheckoutOrder, getCheckoutStatus } from '../controllers/paymentController.js';

const router = Router();

router.post('/checkout-order', createCheckoutOrder);
router.get('/checkout-order/:reference', getCheckoutStatus);

export default router;
