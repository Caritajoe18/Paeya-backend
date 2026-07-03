import NombaUtilityService from '../services/NombaUtilityService.js';
import Transaction from '../models/Transaction.js';

export async function payBill(req, res, next) {
  try {
    const result = await NombaUtilityService.payBill(req.body);

    await Transaction.create({
      localReference: req.body.reference || `bil_${Date.now()}`,
      type: 'bill_payment',
      status: 'pending',
      amount: req.body.amount,
      currency: 'NGN',
      biller: req.body.biller,
      nombaReference: result.data?.reference,
      metadata: req.body.metadata || {},
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function getBillers(req, res, next) {
  try {
    const result = await NombaUtilityService.getBillers();
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function purchaseAirtime(req, res, next) {
  try {
    const result = await NombaUtilityService.purchaseAirtime(req.body);

    await Transaction.create({
      localReference: req.body.reference || `air_${Date.now()}`,
      type: 'airtime',
      status: 'pending',
      amount: req.body.amount,
      currency: 'NGN',
      phone: req.body.phone,
      provider: req.body.provider,
      nombaReference: result.data?.reference,
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function purchaseDataBundle(req, res, next) {
  try {
    const result = await NombaUtilityService.purchaseDataBundle(req.body);

    await Transaction.create({
      localReference: req.body.reference || `dat_${Date.now()}`,
      type: 'data',
      status: 'pending',
      amount: req.body.amount || 0,
      currency: 'NGN',
      phone: req.body.phone,
      provider: req.body.provider,
      nombaReference: result.data?.reference,
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
