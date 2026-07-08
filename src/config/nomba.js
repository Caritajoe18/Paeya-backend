import axios from 'axios';
import config from './index.js';

const BASE_URL = config.nomba.baseUrl;
const AUTH_URL = config.nomba.baseUrl + '/v1';

let cachedToken = null;
let tokenExpiry = 0;

function isSandboxNoAuth() {
  return config.nomba.sandboxMode && !config.nomba.clientId;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[Nomba] Using cached token (expires in', Math.round((tokenExpiry - Date.now()) / 1000), 's)');
    return cachedToken;
  }

  if (!config.nomba.clientId || !config.nomba.clientSecret) {
    console.error('[Nomba] Missing client credentials — NOMBA_CLIENT_ID or NOMBA_CLIENT_SECRET not set');
    throw new Error('NOMBA_CLIENT_ID and NOMBA_CLIENT_SECRET are required');
  }

  const url = `${AUTH_URL}/auth/token/issue`;
  console.log('[Nomba] Fetching access token from', url);
  console.log('[Nomba] Token request headers:', JSON.stringify({
    'Content-Type': 'application/json',
    accountId: config.nomba.accountId || '(not set)',
  }));
  console.log('[Nomba] Token request body (secrets masked):', JSON.stringify({
    grant_type: 'client_credentials',
    client_id: config.nomba.clientId ? config.nomba.clientId.slice(0, 8) + '...' : '(empty)',
    client_secret: config.nomba.clientSecret ? '***' + config.nomba.clientSecret.slice(-4) : '(empty)',
  }));

  const res = await axios.post(url, {
    grant_type: 'client_credentials',
    client_id: config.nomba.clientId,
    client_secret: config.nomba.clientSecret,
  }, {
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      ...(config.nomba.accountId ? { accountId: config.nomba.accountId } : {}),
    },
  });

  console.log('[Nomba] Token response status:', res.status);
  console.log('[Nomba] Token response code:', res.data?.code);
  console.log('[Nomba] Token response description:', res.data?.description);
  console.log('[Nomba] Token response has access_token:', !!res.data?.data?.access_token);
  console.log('[Nomba] Token response has refresh_token:', !!res.data?.data?.refresh_token);

  if (res.data?.code !== '00') {
    throw new Error(`Nomba auth failed: ${res.data?.description || 'invalid credentials'}`);
  }

  const token = res.data?.data?.access_token;
  if (!token) throw new Error('Failed to obtain Nomba access token');

  cachedToken = token;
  tokenExpiry = Date.now() + 25 * 60 * 1000;
  console.log('[Nomba] Token cached, expires at', new Date(tokenExpiry).toISOString());

  return token;
}

const nombaClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

nombaClient.interceptors.request.use(async (req) => {
  const useMock = config.nomba.sandboxMode && !config.nomba.clientId;
  console.log(`[Nomba] Request: ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
  console.log('[Nomba] Config state:', JSON.stringify({
    environment: config.nomba.environment,
    sandboxMode: config.nomba.sandboxMode,
    hasClientId: !!config.nomba.clientId,
    hasClientSecret: !!config.nomba.clientSecret,
    hasAccountId: !!config.nomba.accountId,
    hasMainAccountId: !!config.nomba.mainAccountId,
    hasSubAccountId: !!config.nomba.subAccountId,
    baseUrl: config.nomba.baseUrl,
    useMock,
  }));

  if (!isSandboxNoAuth()) {
    const token = await getAccessToken();
    req.headers.Authorization = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
    console.log('[Nomba] Set Authorization header (token:', token.slice(0, 20) + '...)');
    if (config.nomba.accountId) {
      req.headers.accountId = config.nomba.accountId;
      console.log('[Nomba] Set accountId header:', config.nomba.accountId);
    } else if (config.nomba.mainAccountId) {
      req.headers.accountId = config.nomba.mainAccountId;
      console.log('[Nomba] Set accountId header from MAIN_ACCOUNT_ID:', config.nomba.mainAccountId);
    } else {
      console.warn('[Nomba] WARNING: no accountId set — Nomba API may reject the request');
    }
  } else {
    console.log('[Nomba] Sandbox no-auth mode — no token/accountId headers sent');
  }

  console.log('[Nomba] Final request headers:', JSON.stringify({
    Authorization: req.headers.Authorization ? req.headers.Authorization.slice(0, 30) + '...' : '(not set)',
    'Content-Type': req.headers['Content-Type'],
    Accept: req.headers.Accept,
    accountId: req.headers.accountId || '(not set)',
    'X-Idempotent-key': req.headers['X-Idempotent-key'] || '(not set)',
  }));
  if (req.data) {
    const masked = typeof req.data === 'object' ? { ...req.data } : req.data;
    if (masked.client_secret) masked.client_secret = '***' + masked.client_secret.slice(-4);
    if (masked.client_id) masked.client_id = masked.client_id.slice(0, 8) + '...';
    console.log('[Nomba] Request body (masked):', JSON.stringify(masked));
  }

  return req;
}, (err) => {
  console.error('[Nomba] Request interceptor error:', err.message);
  console.error('[Nomba] Request interceptor stack:', err.stack);
  return Promise.reject(err);
});

nombaClient.interceptors.response.use(
  (res) => {
    console.log(`[Nomba] Response ${res.status}:`, JSON.stringify(res.data).slice(0, 500));
    return res;
  },
  (err) => {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error(`[Nomba] Error ${status}:`, JSON.stringify(body));
    console.error('[Nomba] Full error message:', err.message);
    console.error('[Nomba] Error config URL:', err.config?.url);
    console.error('[Nomba] Error config method:', err.config?.method);
    console.error('[Nomba] Error config headers:', JSON.stringify({
      Authorization: err.config?.headers?.Authorization ? 'Bearer ...' + err.config.headers.Authorization.slice(-10) : '(not set)',
      accountId: err.config?.headers?.accountId || '(not set)',
      'Content-Type': err.config?.headers?.['Content-Type'],
    }));
    return Promise.reject(translateNombaError(err));
  },
);

const NOMBA_ERROR_MAP = {
  insufficient_balance: { status: 400, code: 'INSUFFICIENT_BALANCE' },
  invalid_account: { status: 400, code: 'INVALID_ACCOUNT' },
  duplicate_reference: { status: 409, code: 'DUPLICATE_REFERENCE' },
  transaction_not_found: { status: 404, code: 'TRANSACTION_NOT_FOUND' },
  unauthorized: { status: 401, code: 'UNAUTHORIZED' },
  rate_limit: { status: 429, code: 'RATE_LIMITED' },
};

function translateNombaError(err) {
  const nombaCode = err.response?.data?.code || err.response?.data?.status;
  const mapped = NOMBA_ERROR_MAP[nombaCode] || {
    status: err.response?.status || 500,
    code: 'NOMBA_API_ERROR',
  };
  const msg = err.response?.data?.message
    || err.response?.data?.description
    || err.message
    || (err.code === 'ECONNABORTED' ? 'Request timed out' : 'No response from Nomba — check network/firewall');
  const error = new Error(msg);
  error.statusCode = mapped.status;
  error.code = mapped.code;
  error.nombaData = err.response?.data;
  return error;
}

export default nombaClient;
