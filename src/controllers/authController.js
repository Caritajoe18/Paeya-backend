import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';
import { AuthenticationError, ValidationError } from '../utils/errors.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new ValidationError('email, password, and name are required');

    const existing = await User.findOne({ where: { email } });
    if (existing) throw new ValidationError('Email already registered');

    const user = await User.create({ email, password, name });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(201).json({ success: true, data: { user: user.toSafeJSON(), token } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError('email and password are required');

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AuthenticationError('Invalid credentials');

    const valid = await user.validPassword(password);
    if (!valid) throw new AuthenticationError('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.json({ success: true, data: { user: user.toSafeJSON(), token } });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AuthenticationError('User not found');
    res.json({ success: true, data: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}
