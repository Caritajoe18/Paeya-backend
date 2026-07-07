import { Router } from 'express';
import {
  singleTransfer, singleTransferFromSubAccount, bankAccountLookup, fetchBanks,
  runPayroll, getTransferStatus,
} from '../controllers/payrollController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/transfer', authenticateToken, adminOnly, singleTransfer);
router.post('/transfer/sub-account/:subAccountId', authenticateToken, adminOnly, singleTransferFromSubAccount);
router.post('/bank-lookup', authenticateToken, bankAccountLookup);
router.get('/banks', authenticateToken, fetchBanks);
router.post('/payroll/run', authenticateToken, adminOnly, runPayroll);
router.get('/transfers/:reference', authenticateToken, getTransferStatus);

export default router;
