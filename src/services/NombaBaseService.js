import config from '../config/index.js';
import nombaClient from '../config/nomba.js';

class NombaBaseService {
  constructor() {
    this.isSandbox = config.nomba.sandboxMode;
    this.client = nombaClient;
  }

  async _request(method, path, data = null) {
    if (this.isSandbox) {
      return this._mockResponse(method, path, data);
    }
    const response = await this.client.request({ method, url: path, data });
    return response.data;
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
    if (path.includes('/checkout')) {
      return { checkout_url: `https://checkout.sandbox.nomba.com/${data?.reference || 'cs_test'}`,
        amount: data?.amount || 0, currency: 'NGN' };
    }
    if (path.includes('/transfers')) {
      return { recipient: data?.recipient || {}, amount: data?.amount || 0, fee: 0 };
    }
    if (path.includes('/bill-payments')) {
      return { biller: data?.biller || '', amount: data?.amount || 0, receipt: `rcpt_${Date.now()}` };
    }
    if (path.includes('/airtime') || path.includes('/data')) {
      return { phone: data?.phone || '', amount: data?.amount || 0, provider: data?.provider || '' };
    }
    if (path.includes('/transactions')) {
      return { transactions: [], total: 0, page: 1 };
    }
    return {};
  }
}

export default NombaBaseService;
