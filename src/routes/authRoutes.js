import { Router } from 'express';
import { register, login, getProfile, createUser, listUsers } from '../controllers/authController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticateToken, getProfile);
router.get('/', authenticateToken, adminOnly, listUsers);
router.post('/', authenticateToken, adminOnly, createUser);

export default router;
