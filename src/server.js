// server.js
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import config from './config/index.js';
import { connectWithRetry } from './db/mongoose.js';
import { logger } from './logger/logger.js';
import mongoose from 'mongoose';

let server;

async function start() {
  await connectWithRetry();

  server = http.createServer(app);

  const port = config.port || 5000;
  server.listen(port, () => logger.info(`Server listening on port ${port}`));
}

function gracefulShutdown() {
  logger.info('Shutting down...');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

start().catch((err) => {
  logger.error('Failed to start', err);
  process.exit(1);
});
