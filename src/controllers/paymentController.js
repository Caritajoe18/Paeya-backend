import NombaPaymentService from '../services/NombaPaymentService.js';
import Transaction from '../models/Transaction.js';

export async function createCheckoutOrder(req, res, next) {
  try {
    const result = await NombaPaymentService.createCheckoutOrder(req.body);

    const orderRef = result.data?.orderReference || req.body.orderReference || `ord_${Date.now()}`;

    await Transaction.create({
      localReference: orderRef,
      type: 'payment',
      status: 'pending',
      amount: req.body.amount,
      currency: req.body.currency || 'NGN',
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
      nombaReference: orderRef,
      metadata: req.body.meta || {},
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
