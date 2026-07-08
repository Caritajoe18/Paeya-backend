import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';
import config from '../config/index.js';

class NombaTransactionService extends NombaBaseService {

  async listTransactions({ page = 1, limit = 20, from, to, type, status, scope = 'parent' } = {}) {
    const isSandbox = config.nomba.environment !== 'production';

    if (isSandbox) {
      const params = new URLSearchParams({ page, limit });
      return this._request('GET', `/sandbox/checkout/transaction?${params.toString()}`);
    }

    if (scope === 'sub' && config.nomba.subAccountId) {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fmt = (d) => d.toISOString().replace(/\.\d{3}Z$/, '');
      const params = new URLSearchParams({
        dateFrom: from || fmt(sevenDaysAgo),
        dateTo: to || fmt(now),
        limit: String(limit || 20),
      });
      return this._request('GET', `/transactions/accounts/${config.nomba.subAccountId}?${params.toString()}`);
    }

    const params = new URLSearchParams({ page, limit });
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    return this._request('GET', `/transactions/fetch-transactions-on-the-parent-account?${params.toString()}`);
  }

  async filterTransactions(filters, scope = 'parent') {
    const endpoint = scope === 'sub'
      ? '/transactions/filter-sub-account-transactions'
      : '/transactions/filter-parent-account-transactions';

    const options = scope === 'sub' && config.nomba.subAccountId
      ? { accountId: config.nomba.subAccountId }
      : {};

    return this._request('POST', endpoint, filters, options);
  }

  async getTransactionByReference(reference) {
    if (!reference) throw new ValidationError('reference is required');
    return this._request('GET', `/transactions/${reference}`);
  }
}

export default new NombaTransactionService();
