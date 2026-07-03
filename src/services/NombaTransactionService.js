import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaTransactionService extends NombaBaseService {

  async listTransactions({ page = 1, limit = 20, from, to, type, status } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    return this._request('GET', `/transactions?${params.toString()}`);
  }

  async getTransactionByReference(reference) {
    if (!reference) throw new ValidationError('reference is required');
    return this._request('GET', `/transactions/${reference}`);
  }
}

export default new NombaTransactionService();
