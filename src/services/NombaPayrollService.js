import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaPayrollService extends NombaBaseService {

  async singleTransfer({ amount, recipientAccount, recipientBank, recipientName, senderName, narration, merchantTxRef, idempotentKey }) {
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!recipientAccount) throw new ValidationError('recipientAccount is required');
    if (!recipientBank) throw new ValidationError('recipientBank is required');

    const payload = {
      amount,
      accountNumber: recipientAccount,
      accountName: recipientName,
      bankCode: recipientBank,
      merchantTxRef: merchantTxRef || `trf_${Date.now()}`,
      ...(senderName && { senderName }),
      ...(narration && { narration }),
    };

    const ref = merchantTxRef || payload.merchantTxRef;
    const options = { idempotentKey: idempotentKey || ref };

    return this._request('POST', '/transfers/bank', payload, options);
  }

  async singleTransferFromSubAccount(subAccountId, { amount, recipientAccount, recipientBank, recipientName, senderName, narration, merchantTxRef, idempotentKey }) {
    if (!subAccountId) throw new ValidationError('subAccountId is required');
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!recipientAccount) throw new ValidationError('recipientAccount is required');
    if (!recipientBank) throw new ValidationError('recipientBank is required');

    const payload = {
      amount,
      accountNumber: recipientAccount,
      accountName: recipientName,
      bankCode: recipientBank,
      merchantTxRef: merchantTxRef || `trf_${Date.now()}`,
      ...(senderName && { senderName }),
      ...(narration && { narration }),
    };

    const ref = merchantTxRef || payload.merchantTxRef;
    const options = { idempotentKey: idempotentKey || ref };

    return this._request('POST', `/transfers/bank/${subAccountId}`, payload, options);
  }

  async getTransferStatus(transactionRef) {
    if (!transactionRef) throw new ValidationError('transactionRef is required');
    return this._request('GET', `/transactions/accounts/single?transactionRef=${transactionRef}`);
  }

  async bankAccountLookup({ accountNumber, bankCode }) {
    if (!accountNumber) throw new ValidationError('accountNumber is required');
    if (!bankCode) throw new ValidationError('bankCode is required');

    return this._request('POST', '/transfers/bank/lookup', { accountNumber, bankCode });
  }

  async fetchBanks() {
    return this._request('GET', '/transfers/banks');
  }
}

export default new NombaPayrollService();
