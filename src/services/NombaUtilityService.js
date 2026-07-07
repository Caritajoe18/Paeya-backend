import NombaBaseService from './NombaBaseService.js';
import { ValidationError } from '../utils/errors.js';

class NombaUtilityService extends NombaBaseService {

  async payBill({ biller, amount, customerId, merchantTxRef, metadata = {} }) {
    if (!biller) throw new ValidationError('biller is required');
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');

    const payload = {
      biller,
      amount,
      customer_id: customerId,
      merchantTxRef: merchantTxRef || `bil_${Date.now()}`,
      ...(Object.keys(metadata).length && { metadata }),
    };

    return this._request('POST', '/bill-payments', payload);
  }

  async getBillers() {
    return this._request('GET', '/billers');
  }

  async purchaseAirtime({ phoneNumber, amount, network, merchantTxRef, senderName }) {
    if (!phoneNumber) throw new ValidationError('phoneNumber is required');
    if (!amount || amount <= 0) throw new ValidationError('amount must be a positive number');
    if (!network) throw new ValidationError('network is required');

    const payload = {
      amount,
      phoneNumber,
      network: network.toUpperCase(),
      merchantTxRef: merchantTxRef || `air_${Date.now()}`,
      ...(senderName && { senderName }),
    };

    return this._request('POST', '/bill/topup', payload);
  }

  async fetchDataPlans(telco) {
    if (!telco) throw new ValidationError('telco is required');
    const validTelcos = ['mtn', 'airtel', 'glo', '9mobile'];
    const normalized = telco.toLowerCase();
    if (!validTelcos.includes(normalized)) throw new ValidationError(`telco must be one of: ${validTelcos.join(', ')}`);

    return this._request('GET', `/bill/data-plan/${normalized}`);
  }
}

export default new NombaUtilityService();
