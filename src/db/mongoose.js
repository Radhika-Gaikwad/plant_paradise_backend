// src/db/mongoose.js
import mongoose from 'mongoose';
import config from '../config.js';
import { logger } from '../logger/logger.js';

export async function connectWithRetry(retries = 5, wait = 2000) {
  try {
    await mongoose.connect(config.mongoURI); // No deprecated options
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    if (retries > 0) {
      logger.info(`Retrying to connect to MongoDB (${retries} left)...`);
      await new Promise((r) => setTimeout(r, wait));
      return connectWithRetry(retries - 1, wait);
    }
    throw err;
  }
}
