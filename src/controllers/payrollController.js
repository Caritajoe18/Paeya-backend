import NombaPayrollService from '../services/NombaPayrollService.js';
import Transaction from '../models/Transaction.js';
import Staff from '../models/Staff.js';

export async function singleTransfer(req, res, next) {
  try {
    const idempotentKey = req.headers['x-idempotent-key'] || NombaPayrollService._generateIdempotentKey();
    const result = await NombaPayrollService.singleTransfer({ ...req.body, idempotentKey });

    const ref = req.body.merchantTxRef || `trf_${Date.now()}`;

    await Transaction.create({
      localReference: ref,
      type: 'transfer',
      status: 'pending',
      amount: req.body.amount,
      currency: req.body.currency || 'NGN',
      recipientAccount: req.body.recipientAccount,
      recipientBank: req.body.recipientBank,
      nombaReference: result.data?.id || result.data?.reference,
      metadata: { idempotentKey },
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function singleTransferFromSubAccount(req, res, next) {
  try {
    const idempotentKey = req.headers['x-idempotent-key'] || NombaPayrollService._generateIdempotentKey();
    const result = await NombaPayrollService.singleTransferFromSubAccount(req.params.subAccountId, { ...req.body, idempotentKey });

    const ref = req.body.merchantTxRef || `trf_${Date.now()}`;

    await Transaction.create({
      localReference: ref,
      type: 'transfer',
      status: 'pending',
      amount: req.body.amount,
      currency: req.body.currency || 'NGN',
      recipientAccount: req.body.recipientAccount,
      recipientBank: req.body.recipientBank,
      nombaReference: result.data?.id || result.data?.reference,
      metadata: { idempotentKey, subAccountId: req.params.subAccountId },
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function bankAccountLookup(req, res, next) {
  try {
    const result = await NombaPayrollService.bankAccountLookup(req.body);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function fetchBanks(req, res, next) {
  try {
    const result = await NombaPayrollService.fetchBanks();
    res.json({ success: true, data: result.data?.results || result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function runPayroll(req, res, next) {
  try {
    const staff = await Staff.findAll({ where: { isActive: true } });
    if (!staff.length) {
      return res.status(400).json({ success: false, error: { code: 'NO_STAFF', message: 'No active staff found' } });
    }

    const idempotentKey = req.headers['x-idempotent-key'] || NombaPayrollService._generateIdempotentKey();
    const payrollRef = req.body.reference || `payroll_${Date.now()}`;

    const transfers = staff.map((s) => ({
      amount: Number(s.salary),
      accountNumber: s.accountNumber,
      bankCode: s.bankCode,
      recipientName: s.name,
      senderName: req.body.senderName,
      narration: 'Monthly payroll',
      merchantTxRef: `${payrollRef}_${s.id}`,
    }));

    const results = [];
    for (const transfer of transfers) {
      const result = await NombaPayrollService.singleTransfer({ ...transfer, idempotentKey: `${idempotentKey}_${transfer.merchantTxRef}` });
      results.push(result);

      await Transaction.create({
        localReference: transfer.merchantTxRef,
        type: 'transfer',
        status: 'pending',
        amount: transfer.amount,
        currency: transfer.currency || 'NGN',
        recipientAccount: transfer.accountNumber,
        recipientBank: transfer.bankCode,
        nombaReference: result.data?.id || result.data?.reference,
        metadata: { staffId: transfer.merchantTxRef.split('_').pop(), payrollRef },
        nombaResponse: result,
      });
    }

    res.status(201).json({ success: true, data: { totalStaff: staff.length, transfers: results.map(r => r.data || r) } });
  } catch (err) {
    next(err);
  }
}

export async function getTransferStatus(req, res, next) {
  try {
    const result = await NombaPayrollService.getTransferStatus(req.params.reference);
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
