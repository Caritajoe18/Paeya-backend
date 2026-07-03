import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import config from './config/index.js';

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.isDev ? '*' : process.env.CORS_ORIGIN }));

// ── Rate limiting ─────────────────────────────────────
app.use(globalLimiter);

// ── Body parsing ──────────────────────────────────────
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString(); } }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────
if (config.isDev) app.use(morgan('dev'));

// ── API routes ────────────────────────────────────────
app.use('/payer', routes);

// ── 404 ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// ── Error handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
