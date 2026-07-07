import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function authenticateToken(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    const err = new Error('Authentication required');
    err.statusCode = 401;
    err.code = 'AUTHENTICATION_ERROR';
    return next(err);
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (_err) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    error.code = 'AUTHENTICATION_ERROR';
    next(error);
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role !== 'admin') {
    const err = new Error('Admin access required');
    err.statusCode = 403;
    err.code = 'AUTHORIZATION_ERROR';
    return next(err);
  }
  next();
}
