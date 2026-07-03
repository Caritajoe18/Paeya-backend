import { Router } from 'express';
import { payBill, getBillers, purchaseAirtime, purchaseDataBundle } from '../controllers/utilityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/bill-payments', authenticateToken, payBill);
router.get('/billers', authenticateToken, getBillers);
router.post('/airtime', authenticateToken, purchaseAirtime);
router.post('/data', authenticateToken, purchaseDataBundle);

export default router;
