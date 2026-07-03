import NombaPayrollService from '../services/NombaPayrollService.js';
import Transaction from '../models/Transaction.js';
import Staff from '../models/Staff.js';

export async function singleTransfer(req, res, next) {
  try {
    const result = await NombaPayrollService.singleTransfer(req.body);

    await Transaction.create({
      localReference: req.body.reference || `trf_${Date.now()}`,
      type: 'transfer',
      status: 'pending',
      amount: req.body.amount,
      currency: req.body.currency || 'NGN',
      recipientAccount: req.body.recipientAccount,
      recipientBank: req.body.recipientBank,
      nombaReference: result.data?.reference,
      nombaResponse: result,
    });

    res.status(201).json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}

export async function batchTransfer(req, res, next) {
  try {
    const result = await NombaPayrollService.batchTransfer(req.body);
    res.status(201).json({ success: true, data: result.data || result });
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

    const transfers = staff.map((s) => ({
      amount: s.salary,
      accountNumber: s.accountNumber,
      bankCode: s.bankCode,
      recipientName: s.name,
      currency: s.currency,
      narration: 'Monthly payroll',
    }));

    const result = await NombaPayrollService.batchTransfer({ transfers, reference: `payroll_${Date.now()}` });

    await Promise.all(
      staff.map((s) =>
        Transaction.create({
          localReference: `payroll_${s.id}_${Date.now()}`,
          type: 'transfer',
          status: 'pending',
          amount: s.salary,
          currency: s.currency,
          recipientAccount: s.accountNumber,
          recipientBank: s.bankCode,
          nombaReference: result.data?.reference,
          metadata: { staffId: s.id, staffName: s.name },
          nombaResponse: result,
        }),
      ),
    );

    res.status(201).json({ success: true, data: { totalStaff: staff.length, ...result.data } });
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
