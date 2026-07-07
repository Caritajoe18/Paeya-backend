import Staff from '../models/Staff.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export async function listStaff(req, res, next) {
  try {
    const staff = await Staff.findAll({
      order: [['name', 'ASC']],
    });
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

export async function getStaff(req, res, next) {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) throw new NotFoundError('Staff');
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

export async function createStaff(req, res, next) {
  try {
    const { name, email, phone, accountNumber, bankCode, bankName, salary, currency } = req.body;
    if (!name) throw new ValidationError('name is required');
    if (!accountNumber) throw new ValidationError('accountNumber is required');
    if (!bankCode) throw new ValidationError('bankCode is required');

    const staff = await Staff.create({ name, email, phone, accountNumber, bankCode, bankName, salary, currency });
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

export async function updateStaff(req, res, next) {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) throw new NotFoundError('Staff');
    await staff.update(req.body);
    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

export async function deleteStaff(req, res, next) {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) throw new NotFoundError('Staff');
    await staff.destroy();
    res.json({ success: true, message: 'Staff deleted' });
  } catch (err) {
    next(err);
  }
}
