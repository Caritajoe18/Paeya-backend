import NombaPaymentService from '../services/NombaPaymentService.js';
import Transaction from '../models/Transaction.js';

export async function createCheckoutSession(req, res, next) {
  try {
    const result = await NombaPaymentService.createCheckoutSession(req.body);

    await Transaction.create({
      localReference: req.body.reference || `chk_${Date.now()}`,
      type: 'payment',
      status: 'pending',
      amount: req.body.amount,
      currency: req.body.currency || 'NGN',
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
      nombaReference: result.data?.reference,
      metadata: req.body.metadata || {},
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function getCheckoutStatus(req, res, next) {
  try {
    const result = await NombaPaymentService.getCheckoutStatus(req.params.reference);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
