import NombaUtilityService from '../services/NombaUtilityService.js';
import Transaction from '../models/Transaction.js';

export async function payBill(req, res, next) {
  try {
    const result = await NombaUtilityService.payBill(req.body);

    await Transaction.create({
      localReference: req.body.merchantTxRef || `bil_${Date.now()}`,
      type: 'bill_payment',
      status: 'pending',
      amount: req.body.amount,
      currency: 'NGN',
      biller: req.body.biller,
      nombaReference: result.data?.reference || result.data?.id,
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
      localReference: req.body.merchantTxRef || `air_${Date.now()}`,
      type: 'airtime',
      status: 'pending',
      amount: req.body.amount,
      currency: 'NGN',
      phone: req.body.phoneNumber,
      provider: req.body.network,
      nombaReference: result.data?.reference || result.data?.id,
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function fetchDataPlans(req, res, next) {
  try {
    const result = await NombaUtilityService.fetchDataPlans(req.params.telco);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
