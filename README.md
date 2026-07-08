# Payer — Unified SME Financial Platform

**Demo:** https://payer-paywell.vercel.app/login — login with `admin@example.com` / `payer` Registration also logs you in.

**Video:** https://www.loom.com/share/886d5d4a941d4b71890532c988dd68ec
**Post:** https://www.linkedin.com/posts/caritandibe_nombahack-build-sme-share-7480600377181102080-FS2w

Node.js backend that integrates Nomba APIs (Checkout, Transfers, Bill Payments, Airtime/Data) into a single platform with admin auth, webhook handling, and a local PostgreSQL ledger.

## Project Structure

```
├── server.js                        # Bootstrap entry
├── src/
│   ├── app.js                       # Express app (middleware, routes, error handler)
│   ├── config/
│   │   ├── index.js                 # Global config (sandbox flag, env vars)
│   │   ├── database.js              # Sequelize + PostgreSQL (single DATABASE_URL)
│   │   └── nomba.js                 # Axios client with error code mapping
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication + admin role guard
│   │   ├── errorHandler.js          # Centralized Nomba-aligned error codes
│   │   ├── rateLimiter.js           # Global / auth / webhook rate limits
│   │   └── pagination.js            # Reusable Sequelize paginator
│   ├── services/
│   │   ├── NombaBaseService.js      # Sandbox mock fallback + shared request()
│   │   ├── NombaPaymentService.js   # Checkout session create / status
│   │   ├── NombaPayrollService.js   # Single / batch transfers, auto payroll
│   │   ├── NombaUtilityService.js   # Bill pay, airtime, data bundles
│   │   └── NombaTransactionService.js # Transaction history with filters
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile
│   │   ├── paymentController.js     # Checkout init + local tx record
│   │   ├── payrollController.js     # Transfers + runPayroll from Staff records
│   │   ├── utilityController.js     # Bills, airtime, data + tx logging
│   │   └── transactionController.js # Paginated dashboard + Nomba sync
│   ├── routes/
│   │   ├── index.js                 # Route aggregator (/api/v1/...)
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── payrollRoutes.js
│   │   ├── utilityRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── webhookRoutes.js
│   ├── models/
│   │   ├── User.js                  # Admin auth (bcrypt, JWT)
│   │   ├── Product.js               # Local product catalog
│   │   ├── Staff.js                 # Bank details, salary, active flag
│   │   ├── Transaction.js           # All tx types linked to Nomba refs
│   │   └── WebhookEvent.js          # Raw payload + processing state
│   ├── webhooks/
│   │   └── handler.js               # HMAC signature verification + tx status update
│   └── utils/
│       ├── errors.js                # AppError, ValidationError, AuthError, etc.
│       ├── pagination.js            # parsePagination + buildPaginatedResponse
│       └── logger.js                # Level-based structured logger
```

## Quick Start

```bash
cp .env.example .env       # edit vars as needed
npm install
npm run dev                # starts on :4000
```

The sandbox flag (`NOMBA_SANDBOX_MODE=true`) lets you test every endpoint immediately without any Nomba credentials — all API calls return realistic mock responses.

## API Endpoints

| Prefix | Resource |
|---|---|
| `/payer/auth` | Register, login, profile |
| `/payer/payments` | Checkout session, status |
| `/payer/payroll` | Single/batch transfers, run payroll |
| `/payer/utilities` | Bill pay, airtime, data |
| `/payer/transactions` | Paginated local tx history, Nomba sync |
| `/payer/webhooks` | Nomba webhook receiver |
| `/payer/health` | Health check |

## Deploy on Render

1. Set build command: `npm install`
2. Set start command: `node server.js`
3. Add env vars from `.env.example` — Render provides its own `DATABASE_URL`
4. `NOMBA_SANDBOX_MODE=true` works immediately; set to `false` and add `NOMBA_API_KEY` for live mode

### Keep-alive (Render free tier)

Render free services spin down after 15 min of inactivity. The frontend pings `GET /payer/health` every 10 min while open, but for 24/7 wakefulness set up a free cron job at [cron-job.org](https://cron-job.org) to hit `https://paeya-backend.onrender.com/payer/health` every 10 minutes.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | 4000 | Server port |
| `NODE_ENV` | development | Environment |
| `NOMBA_API_KEY` | — | Live API key (not needed in sandbox) |
| `NOMBA_ENVIRONMENT` | sandbox | `sandbox` or `production` |
| `NOMBA_SANDBOX_MODE` | true | Bypasses real auth for prototyping |
| `JWT_SECRET` | — | Secret for signing admin JWTs |
| `JWT_EXPIRES_IN` | 24h | JWT expiry |
| `WEBHOOK_SECRET` | — | HMAC secret for webhook verification |
| `DATABASE_URL` | postgresql://localhost:5432/payer | PostgreSQL connection string |
