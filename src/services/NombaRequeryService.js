import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaRequeryService extends NombaBaseService {

  async requeryBySessionId(sessionId) {
    if (!sessionId) throw new ValidationError('sessionId is required');
    return this._request('GET', `/transactions/transaction-requery/${sessionId}`);
  }

  async getTransactionByRef(transactionRef) {
    if (!transactionRef) throw new ValidationError('transactionRef is required');
    return this._request('GET', `/transactions/accounts/single?transactionRef=${transactionRef}`);
  }

  async getTransactionBySubAccountRef(subAccountId, transactionRef) {
    if (!subAccountId) throw new ValidationError('subAccountId is required');
    if (!transactionRef) throw new ValidationError('transactionRef is required');
    return this._request('GET', `/transactions/accounts/${subAccountId}/single?transactionRef=${transactionRef}`);
  }
}

export default new NombaRequeryService();
