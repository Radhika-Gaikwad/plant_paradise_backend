// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { logger } from './logger/logger.js';
import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // allow more requests
  })
);

// mount all API routes under /api/v1
app.use('/api/v1', routes);

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use(errorMiddleware);

export default app;
