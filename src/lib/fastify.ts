import Fastify from 'fastify';


import type { Logger } from 'winston';
import logger from './docs/logger';


import { httpsPort, nodeEnv } from './config/config.server';
import { configureHelmet } from './modules/helmet-fastify.config';
import { configureRateLimit } from './modules/rate-limit-fastify.config';
import { configureRequestHooks } from './modules/request-hooks-fastify.config';
import { configureErrorHandler } from './modules/error-handler-fastify.config';
import { configureSwagger } from './modules/swagger-fastify.config';

declare module 'fastify' {
  // eslint-disable-next-line no-unused-vars
  interface FastifyInstance {
    logger: Logger;
  }
}

const fastify = Fastify({
  logger: false,
  disableRequestLogging: true,
});

// Attach logger
fastify.decorate('logger', logger);

// Register modules
fastify.register(configureHelmet);
fastify.register(configureRateLimit);
fastify.register(configureRequestHooks);
fastify.register(configureErrorHandler);
fastify.register(configureSwagger);

let server: typeof fastify | null = null;

const startServer = async (port?: number) => {
  const actualPort = port || httpsPort;
  if (server) {
    fastify.logger.warn('Server is already running');
    return server;
  }

  try {
    await fastify.listen({ port: actualPort });
    fastify.logger.info(`Server is running on port ${actualPort}`);
    server = fastify;
    return server;
  } catch (err) {
    fastify.logger.error('Error starting server:', err);
    throw err;
  }
};

const closeServer = async () => {
  if (server) {
    try {
      await server.close();
      fastify.logger.info('Server closed successfully');
      server = null;
    } catch (err) {
      fastify.logger.error('Error closing server:', err);
      throw err;
    }
  } else {
    fastify.logger.warn('Server instance not available, skipping close operation');
  }
};

if (nodeEnv !== 'test') {
  startServer();
}

export { fastify as app, startServer, closeServer };