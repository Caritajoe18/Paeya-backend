import config from '../config/index.js';
import nombaClient from '../config/nomba.js';
import { v4 as uuidv4 } from 'uuid';

class NombaBaseService {
  constructor() {
    this.useMock = config.nomba.sandboxMode && !config.nomba.clientId;
    this.client = nombaClient;
  }

  _buildPath(path) {
    if (path.startsWith('/sandbox/')) {
      console.log(`[NombaService] Sandbox path (passthrough): ${path}`);
      return path;
    }
    const isSandbox = config.nomba.environment !== 'production';
    if (isSandbox && path.startsWith('/checkout/')) {
      const sandboxPath = '/sandbox/checkout' + path.slice('/checkout'.length);
      console.log(`[NombaService] Sandbox checkout path: ${path} → ${sandboxPath}`);
      return sandboxPath;
    }
    return '/v1' + path;
  }

  async _request(method, path, data = null, options = {}) {
    const fullPath = this._buildPath(path);
    console.log(`[NombaService] _request called: ${method} ${path} → ${fullPath}`);
    console.log('[NombaService] useMock:', this.useMock);
    console.log('[NombaService] sandboxMode:', config.nomba.sandboxMode, '| clientId:', config.nomba.clientId ? 'set' : 'not set');
    console.log('[NombaService] options:', JSON.stringify({ ...options, idempotentKey: options.idempotentKey ? '***' : undefined }));

    if (this.useMock) {
      console.log('[NombaService] Returning mock response');
      return this._mockResponse(method, path, data);
    }

    const headers = {};
    if (options.idempotentKey) {
      headers['X-Idempotent-key'] = options.idempotentKey;
      console.log('[NombaService] Added idempotent key header');
    }
    if (options.accountId) {
      headers['accountId'] = options.accountId;
      console.log('[NombaService] Added accountId override:', options.accountId);
    }

    console.log('[NombaService] Making real API call to', `${config.nomba.baseUrl}${fullPath}`);
    const response = await this.client.request({ method, url: fullPath, data, headers });
    console.log('[NombaService] API call succeeded, status:', response.status);
    return response.data;
  }

  _generateIdempotentKey() {
    return uuidv4();
  }

  _mockResponse(method, path, data) {
    const msg = `[Sandbox] ${method} ${path}`;
    console.log(msg, data || '');
    const ref = `sbd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return {
      success: true,
      message: 'Sandbox response',
      data: { reference: ref, status: 'pending', ...this._mockPayload(method, path, data) },
      _sandbox: true,
    };
  }

  _mockPayload(method, path, data) {
    if (path.includes('/checkout/order')) {
      return {
        checkoutLink: `https://checkout.nomba.com/sandbox/${data?.order?.orderReference || 'cs_test'}`,
        orderReference: data?.order?.orderReference || `ord_${Date.now()}`,
      };
    }
    if (path.includes('/sandbox/checkout/order')) {
      const ref = data?.order?.orderReference || `ord_${Date.now()}`;
      return {
        code: '00',
        description: 'Success',
        data: {
          checkoutLink: `https://checkout.nomba.com/sandbox/${ref}`,
          orderReference: ref,
        },
      };
    }
    if (path.includes('/transfers/bank')) {
      return { recipient: data?.accountNumber || '', amount: data?.amount || 0, fee: 0 };
    }
    if (path.includes('/transfers/bank/lookup')) {
      return { accountNumber: data?.accountNumber || '', accountName: 'Sandbox Account Name' };
    }
    if (path.includes('/transfers/banks')) {
      return { results: [{ code: '011', name: 'First Bank of Nigeria' }, { code: '058', name: 'Guaranty Trust Bank' }] };
    }
    if (path.includes('/bill-payments')) {
      return { biller: data?.biller || '', amount: data?.amount || 0, receipt: `rcpt_${Date.now()}` };
    }
    if (path.includes('/bill/topup')) {
      return { phone: data?.phoneNumber || '', amount: data?.amount || 0, network: data?.network || 'MTN' };
    }
    if (path.includes('/bill/data-plan')) {
      return [{ amount: 1000, plan: '1GB - 30 days' }, { amount: 2000, plan: '2GB - 30 days' }];
    }
    if (path.includes('/transactions/transaction-requery')) {
      return { id: path.split('/').pop(), status: 'SUCCESS', amount: data?.amount || 0 };
    }
    if (path.includes('/transactions')) {
      return { transactions: [], total: 0, page: 1 };
    }
    if (path.includes('/accounts/virtual')) {
      return { accountNumber: '1234567890', accountName: data?.accountName || '', accountRef: data?.accountRef || '' };
    }
    return {};
  }
}

export default NombaBaseService;
