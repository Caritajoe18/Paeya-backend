import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaPayrollService extends NombaBaseService {

  async singleTransfer({ amount, currency = 'NGN', recipientAccount, recipientBank, recipientName, narration, reference }) {
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!recipientAccount) throw new ValidationError('recipientAccount is required');
    if (!recipientBank) throw new ValidationError('recipientBank is required');

    const payload = {
      amount,
      currency,
      recipient: {
        account_number: recipientAccount,
        bank_code: recipientBank,
        name: recipientName,
      },
      narration: narration || 'Payroll disbursement',
      reference: reference || `trf_${Date.now()}`,
    };

    return this._request('POST', '/transfers', payload);
  }

  async batchTransfer({ transfers, reference }) {
    if (!transfers || !transfers.length) throw new ValidationError('transfers array is required');
    if (transfers.length > 100) throw new ValidationError('max 100 transfers per batch');

    const payload = {
      reference: reference || `batch_${Date.now()}`,
      transfers: transfers.map((t) => ({
        amount: t.amount,
        currency: t.currency || 'NGN',
        recipient: {
          account_number: t.accountNumber,
          bank_code: t.bankCode,
          name: t.recipientName,
        },
        narration: t.narration || 'Payroll disbursement',
      })),
    };

    return this._request('POST', '/transfers/batch', payload);
  }

  async getTransferStatus(reference) {
    if (!reference) throw new ValidationError('reference is required');
    return this._request('GET', `/transfers/${reference}`);
  }
}

export default new NombaPayrollService();
