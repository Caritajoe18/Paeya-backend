import axios from 'axios';
import config from './index.js';

const BASE_URL = config.nomba.baseUrl;

let cachedToken = null;
let tokenExpiry = 0;

function isSandboxNoAuth() {
  return config.nomba.sandboxMode && !config.nomba.clientId;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  if (!config.nomba.clientId || !config.nomba.clientSecret) {
    throw new Error('NOMBA_CLIENT_ID and NOMBA_CLIENT_SECRET are required for authentication');
  }

  const res = await axios.post(`${BASE_URL}/auth/token/issue`, {
    grant_type: 'client_credentials',
    client_id: config.nomba.clientId,
    client_secret: config.nomba.clientSecret,
  }, {
    headers: {
      'Content-Type': 'application/json',
      ...(config.nomba.accountId ? { accountId: config.nomba.accountId } : {}),
    },
  });

  const token = res.data?.data?.access_token;
  if (!token) throw new Error('Failed to obtain Nomba access token');

  cachedToken = token;
  tokenExpiry = Date.now() + 55 * 60 * 1000;

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
  if (!isSandboxNoAuth()) {
    const token = await getAccessToken();
    req.headers.Authorization = `Bearer ${token}`;
    if (config.nomba.accountId) {
      req.headers.accountId = config.nomba.accountId;
    }
  }
  console.log(`[Nomba] ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
  return req;
}, (err) => Promise.reject(err));

nombaClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error(`[Nomba] Error ${status}:`, JSON.stringify(body));
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
  const error = new Error(err.response?.data?.message || 'Nomba API error');
  error.statusCode = mapped.status;
  error.code = mapped.code;
  error.nombaData = err.response?.data;
  return error;
}

export default nombaClient;
