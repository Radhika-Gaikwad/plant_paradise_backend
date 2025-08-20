// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';

const requireRole = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const out = sendResponse(CODES.UNAUTHORIZED, 'No token provided');
    return res.status(out.code).json(out);
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;

    if (requiredRole && payload.role !== requiredRole) {
      const out = sendResponse(CODES.FORBIDDEN, 'Access denied: insufficient permissions');
      return res.status(out.code).json(out);
    }

    return next();
  } catch (err) {
    const out = sendResponse(CODES.UNAUTHORIZED, 'Invalid token');
    return res.status(out.code).json(out);
  }
};

export default requireRole;
