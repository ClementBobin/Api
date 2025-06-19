import express from 'express';
import { Logger } from 'winston';
import logger from './docs/logger';
import http from 'http';
import { httpsPort } from './config/env.config';
import { configureHelmet } from './modules/helmet-express.config';
import { configureRateLimit } from './modules/rate-limit-express.config';
import { configureCustomHeaders } from './modules/custom-headers-express.config';
import { configureErrorHandler } from './modules/error-handler-express.config';
import { configureResponseLogger } from './modules/response-logger-express.config';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Application {
      logger: Logger;
    }
    interface Response {
      json: () => Response;
    }
  }
}

const app = express();

// Attach logger to app
app.logger = logger;

// Configure middleware
app.use(configureHelmet());
app.use(configureRateLimit());
app.use(configureCustomHeaders());
app.use(express.json());
app.use(configureResponseLogger(app.logger));
app.use(configureErrorHandler(app.logger));

let server: http.Server | null = null;

const startServer = (port?: number) => {
  const actualPort = port || httpsPort;
  if (server) {
    app.logger.warn('Server is already running');
    return server;
  }
  
  server = app.listen(actualPort, () => {
    app.logger.info(`Server is running on port ${actualPort}`);
  });
  
  return server;
};

const closeServer = () => {
  return new Promise<void>((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          app.logger.error('Error closing server:', err);
          reject(err);
        } else {
          app.logger.info('Server closed successfully');
          server = null;
          resolve();
        }
      });
    } else {
      app.logger.warn('Server instance not available, skipping close operation');
      resolve();
    }
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer, closeServer, logger as appLogger };