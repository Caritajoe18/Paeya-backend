import crypto from 'crypto';
import config from '../config/index.js';
import Transaction from '../models/Transaction.js';
import WebhookEvent from '../models/WebhookEvent.js';

export async function handleNombaWebhook(req, res, next) {
  try {
    const signature = req.headers['x-nomba-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (!verifySignature(signature, rawBody)) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' },
      });
    }

    const event = req.body;
    const webhookEvent = await WebhookEvent.create({
      eventType: event.event || event.type || 'unknown',
      nombaReference: event.data?.reference || event.reference,
      rawPayload: event,
    });

    try {
      await processWebhookEvent(event, webhookEvent);
      webhookEvent.status = 'processed';
      webhookEvent.processedAt = new Date();
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

function verifySignature(signature, rawBody) {
  if (!signature || config.nomba.sandboxMode) return true;

  const expected = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function processWebhookEvent(event, _webhookEvent) {
  const { event: eventType, data } = event;

  if (!data?.reference) return;

  const statusMap = {
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
    await Transaction.update(
      { status: mappedStatus, nombaResponse: event },
      { where: { nombaReference: data.reference } },
    );
  }
}
