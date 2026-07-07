import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaPaymentService extends NombaBaseService {

  async createCheckoutOrder({
    amount, currency = 'NGN', customerEmail, customerId,
    orderReference, callbackUrl, accountId, allowedPaymentMethods,
    orderMetaData = {}, meta = {}, tokenizeCard = false, splitRequest,
  }) {
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!customerEmail) throw new ValidationError('customerEmail is required');

    const order = {
      orderReference: orderReference || `ord_${Date.now()}`,
      customerId,
      callbackUrl,
      customerEmail,
      amount: String(amount),
      currency,
      ...(accountId && { accountId }),
      ...(allowedPaymentMethods?.length && { allowedPaymentMethods }),
      ...(Object.keys(orderMetaData).length && { orderMetaData }),
      ...(splitRequest && { splitRequest }),
    };

    const payload = { order, tokenizeCard, meta };
    if (Object.keys(meta).length === 0) delete payload.meta;

    return this._request('POST', '/checkout/order', payload);
  }

  async getCheckoutStatus(reference) {
    if (!reference) throw new ValidationError('reference is required');
    return this._request('GET', `/checkout/order/${reference}`);
  }
}

export default new NombaPaymentService();
