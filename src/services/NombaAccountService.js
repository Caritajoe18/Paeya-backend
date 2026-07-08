import NombaBaseService from './NombaBaseService.js';
import config from '../config/index.js';

class NombaAccountService extends NombaBaseService {
  async getSubAccountBalance() {
    if (!config.nomba.subAccountId) {
      return { amount: '0', currency: 'NGN' };
    }
    return this._request('GET', `/accounts/${config.nomba.subAccountId}/balance`);
  }
}

export default new NombaAccountService();
