import NombaTransactionService from '../services/NombaTransactionService.js';
import Transaction from '../models/Transaction.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';

export async function listTransactions(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const where = {};

    if (req.query.type) where.type = req.query.type;
    if (req.query.status) where.status = req.query.status;

    const { rows, count } = await Transaction.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, ...buildPaginatedResponse(rows, count, { page, limit }) });
  } catch (err) {
    next(err);
  }
}

export async function getTransaction(req, res, next) {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Transaction not found' },
      });
    }
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
}

export async function syncFromNomba(req, res, next) {
  try {
    const { scope, ...query } = req.query;
    const result = await NombaTransactionService.listTransactions({ ...query, scope: scope || 'parent' });
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function filterNombaTransactions(req, res, next) {
  try {
    const scope = req.query.scope || 'parent';
    const result = await NombaTransactionService.filterTransactions(req.body, scope);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
