// src/middlewares/error.middleware.js
import { logger } from '../logger/logger.js';

export default (err, req, res, next) => {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
};
