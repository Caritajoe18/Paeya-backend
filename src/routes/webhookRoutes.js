import { Router } from 'express';
import { handleNombaWebhook } from '../webhooks/handler.js';
import { webhookLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/nomba', webhookLimiter, handleNombaWebhook);

export default router;
