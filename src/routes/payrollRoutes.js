import { Router } from 'express';
import { singleTransfer, batchTransfer, runPayroll, getTransferStatus } from '../controllers/payrollController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/transfer', authenticateToken, adminOnly, singleTransfer);
router.post('/transfers/batch', authenticateToken, adminOnly, batchTransfer);
router.post('/payroll/run', authenticateToken, adminOnly, runPayroll);
router.get('/transfers/:reference', authenticateToken, getTransferStatus);

export default router;
