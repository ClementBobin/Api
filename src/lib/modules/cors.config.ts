import cors from 'cors';
import { url, productionUrl } from '../config/env.config';
import type { Logger } from 'winston';

const allowedOrigins = [url, productionUrl];

export const configureCors = (logger: Logger) => {
  const env = process.env.NODE_ENV || 'development';

  logger.debug(`NODE_ENV: ${env}`);
  logger.debug(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

  return cors({
    origin: (origin, callback) => {
      if (!origin) {
        if (env === 'development') {
          logger.info('CORS allowed: request has no origin (development)');
          return callback(null, true);
        } else {
          logger.warn('CORS blocked: no origin (not in development)');
          return callback(new Error('Not allowed by CORS'));
        }
      }

      if (allowedOrigins.includes(origin)) {
        logger.info(`CORS allowed: ${origin}`);
        return callback(null, true);
      } else {
        logger.warn(`CORS blocked: ${origin}`);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204, // For legacy browsers
  });
};
