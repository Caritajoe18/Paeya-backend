import { Router } from 'express';
import authRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import utilityRoutes from './utilityRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import webhookRoutes from './webhookRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import requeryRoutes from './requeryRoutes.js';
import virtualAccountRoutes from './virtualAccountRoutes.js';
import staffRoutes from './staffRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/payroll', payrollRoutes);
router.use('/utilities', utilityRoutes);
router.use('/transactions', transactionRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/requery', requeryRoutes);
router.use('/virtual-accounts', virtualAccountRoutes);
router.use('/staff', staffRoutes);

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Payer API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
