import NombaRequeryService from '../services/NombaRequeryService.js';
import Transaction from '../models/Transaction.js';
import { ValidationError } from '../utils/errors.js';

export async function requeryBySessionId(req, res, next) {
  try {
    const { sessionId } = req.params;
    if (!sessionId) throw new ValidationError('sessionId is required');

    const result = await NombaRequeryService.requeryBySessionId(sessionId);

    const nombaData = result.data || result;
    if (nombaData.status) {
      const statusMap = {
        SUCCESS: 'success',
        FAILED: 'failed',
        REFUND: 'failed',
        PENDING_BILLING: 'pending',
        NEW: 'pending',
      };
      const mapped = statusMap[nombaData.status];
      if (mapped) {
        await Transaction.update(
          { status: mapped, sessionId, nombaResponse: result },
          { where: { sessionId } },
        );
      }
    }

    res.json({ success: true, data: nombaData });
  } catch (err) {
    next(err);
  }
}

export async function requeryByTransactionRef(req, res, next) {
  try {
    const { transactionRef } = req.params;
    if (!transactionRef) throw new ValidationError('transactionRef is required');

    const result = await NombaRequeryService.getTransactionByRef(transactionRef);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
