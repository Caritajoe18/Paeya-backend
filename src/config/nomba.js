import axios from 'axios';
import config from './index.js';

const isProduction = config.nomba.environment === 'production';

const nombaClient = axios.create({
  baseURL: config.nomba.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(isProduction
      ? { Authorization: `Bearer ${config.nomba.apiKey}` }
      : {}),
  },
});

nombaClient.interceptors.request.use(
  (req) => {
    console.log(`[Nomba] ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
    return req;
  },
  (err) => Promise.reject(err),
);

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
