import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaPaymentService extends NombaBaseService {

  async createCheckoutSession({ amount, currency = 'NGN', customerEmail, customerName, reference, callbackUrl, metadata = {} }) {
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!customerEmail) throw new ValidationError('customerEmail is required');

    const payload = {
      amount,
      currency,
      customer: { email: customerEmail, name: customerName },
      reference: reference || `chk_${Date.now()}`,
      callback_url: callbackUrl,
      metadata,
    };

    return this._request('POST', '/checkout/session', payload);
  }

  async getCheckoutStatus(reference) {
    if (!reference) throw new ValidationError('reference is required');
    return this._request('GET', `/checkout/session/${reference}`);
  }
}

export default new NombaPaymentService();
