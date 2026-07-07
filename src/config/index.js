import 'dotenv/config';

const config = {

  // ── Server ──────────────────────────────────────────
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',

  // ── Nomba API  live https://api.nomba.com/v1───────────────────────────────────────
  nomba: {
    apiKey: process.env.NOMBA_API_KEY || '',
    apiSecret: process.env.NOMBA_API_SECRETE_KEY || '',
    environment: process.env.NOMBA_ENVIRONMENT || 'sandbox',
    sandboxMode: process.env.NOMBA_SANDBOX_MODE !== 'false',
    baseUrl:
      process.env.NOMBA_ENVIRONMENT === 'production'
        ? 'https://sandbox.nomba.com/v1'
        : 'https://sandbox.nomba.com/v1',
    sandboxDefaults: {
      checkoutSessionId: 'cs_sandbox_' + Date.now(),
      transferReference: 'trf_sandbox_' + Date.now(),
      transactionReference: 'txn_sandbox_' + Date.now(),
    },
  },

  // ── Auth (Payer admin) ──────────────────────────────
  jwt: {
    secret: process.env.JWT_SECRET || 'payer-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // ── Webhook ─────────────────────────────────────────
  webhookSecret: process.env.WEBHOOK_SECRET || 'whsec_mock',

  // ── Database (single connection string for Render) ──
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/payer',
    dialect: 'postgres',
  },

  // ── Cloudinary ───────────────────────────────────────
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export default config;
