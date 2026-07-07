import crypto from 'crypto';
import { Op } from 'sequelize';
import config from '../config/index.js';
import Transaction from '../models/Transaction.js';
import WebhookEvent from '../models/WebhookEvent.js';

export async function handleNombaWebhook(req, res, next) {
  try {
    const signature = req.headers['nomba-signature'];
    const nombaTimestamp = req.headers['nomba-timestamp'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (!verifySignature(signature, rawBody, nombaTimestamp)) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' },
      });
    }

    const event = req.body;
    const webhookEvent = await WebhookEvent.create({
      eventType: event.event_type || event.event || 'unknown',
      nombaReference: event.data?.order?.orderReference || event.data?.reference || event.data?.transaction?.transactionId,
      rawPayload: event,
    });

    try {
      await processWebhookEvent(event, webhookEvent);
      webhookEvent.status = 'processed';
      webhookEvent.processedAt = new Date().toISOString();
      await webhookEvent.save();
    } catch (processErr) {
      webhookEvent.status = 'failed';
      webhookEvent.error = processErr.message;
      await webhookEvent.save();
    }

    res.json({ success: true, message: 'Webhook received' });
  } catch (err) {
    next(err);
  }
}

function verifySignature(signature, rawBody, nombaTimestamp) {
  if (!signature || config.nomba.sandboxMode) return true;

  const expected = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(rawBody + (nombaTimestamp || ''))
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function processWebhookEvent(event, _webhookEvent) {
  const eventType = event.event_type || event.event;
  const data = event.data || {};

  const orderReference = data.order?.orderReference;
  const transactionId = data.transaction?.transactionId;
  const reference = orderReference || transactionId || data.reference;

  if (!reference) return;

  const statusMap = {
    'payment_success': 'success',
    'payment_failed': 'failed',
    'payment_reversal': 'reversed',
    'payout_success': 'success',
    'payout_failed': 'failed',
    'payout_refund': 'failed',
    'checkout.success': 'success',
    'checkout.failed': 'failed',
    'transfer.success': 'success',
    'transfer.failed': 'failed',
    'bill.success': 'success',
    'bill.failed': 'failed',
    'airtime.success': 'success',
    'airtime.failed': 'failed',
  };

  const mappedStatus = statusMap[eventType];
  if (mappedStatus) {
    const updateData = { status: mappedStatus, nombaResponse: event };

    const txn = data.transaction;
    if (txn?.time) updateData.nombaProcessedAt = txn.time;
    if (txn?.fee != null) updateData.fee = txn.fee;
    if (txn?.sessionId) updateData.sessionId = txn.sessionId;

    await Transaction.update(updateData, {
      where: {
        [Op.or]: [
          { nombaReference: reference },
          ...(orderReference ? [{ localReference: orderReference }] : []),
        ],
      },
    });
  }
}
