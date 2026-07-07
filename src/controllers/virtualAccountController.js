import NombaVirtualAccountService from '../services/NombaVirtualAccountService.js';
import { ValidationError } from '../utils/errors.js';

export async function createVirtualAccount(req, res, next) {
  try {
    const { accountRef, accountName, currency, bvn, expectedAmount, expiryDate } = req.body;
    if (!accountRef) throw new ValidationError('accountRef is required');
    if (!accountName) throw new ValidationError('accountName is required');

    const result = await NombaVirtualAccountService.createVirtualAccount({
      accountRef, accountName, currency, bvn, expectedAmount, expiryDate,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function lookupVirtualAccount(req, res, next) {
  try {
    const { virtualAcctNumber } = req.params;
    if (!virtualAcctNumber) throw new ValidationError('virtualAcctNumber is required');

    const result = await NombaVirtualAccountService.lookupVirtualAccount(virtualAcctNumber);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function suspendVirtualAccount(req, res, next) {
  try {
    const { accountId } = req.params;
    if (!accountId) throw new ValidationError('accountId is required');

    const result = await NombaVirtualAccountService.suspendVirtualAccount(accountId);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
