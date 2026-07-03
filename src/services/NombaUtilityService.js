import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaUtilityService extends NombaBaseService {

  async payBill({ biller, amount, customerId, reference, metadata = {} }) {
    if (!biller) throw new ValidationError('biller is required');
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');

    const payload = {
      biller,
      amount,
      customer_id: customerId,
      reference: reference || `bil_${Date.now()}`,
      metadata,
    };

    return this._request('POST', '/bill-payments', payload);
  }

  async getBillers() {
    return this._request('GET', '/billers');
  }

  async purchaseAirtime({ phone, amount, provider, reference }) {
    if (!phone) throw new ValidationError('phone is required');
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');

    const payload = {
      phone,
      amount,
      provider: provider || 'mtn',
      reference: reference || `air_${Date.now()}`,
    };

    return this._request('POST', '/airtime', payload);
  }

  async purchaseDataBundle({ phone, plan, provider, reference }) {
    if (!phone) throw new ValidationError('phone is required');
    if (!plan) throw new ValidationError('plan is required');

    const payload = {
      phone,
      plan,
      provider: provider || 'mtn',
      reference: reference || `dat_${Date.now()}`,
    };

    return this._request('POST', '/data', payload);
  }
}

export default new NombaUtilityService();
