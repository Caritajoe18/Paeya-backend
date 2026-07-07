import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaVirtualAccountService extends NombaBaseService {

  async createVirtualAccount({ accountRef, accountName, currency = 'NGN', bvn, expectedAmount, expiryDate }) {
    if (!accountRef) throw new ValidationError('accountRef is required');
    if (!accountName) throw new ValidationError('accountName is required');

    const payload = {
      accountRef,
      accountName,
      currency,
      ...(bvn && { bvn }),
      ...(expectedAmount != null && { expectedAmount }),
      ...(expiryDate && { expiryDate }),
    };

    return this._request('POST', '/accounts/virtual', payload);
  }

  async lookupVirtualAccount(virtualAcctNumber) {
    if (!virtualAcctNumber) throw new ValidationError('virtualAcctNumber is required');
    return this._request('GET', `/accounts/virtual/${virtualAcctNumber}`);
  }

  async suspendVirtualAccount(accountId) {
    if (!accountId) throw new ValidationError('accountId is required');
    return this._request('PUT', `/accounts/suspend/${accountId}`);
  }
}

export default new NombaVirtualAccountService();
