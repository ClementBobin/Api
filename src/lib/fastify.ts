import Fastify, { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyHelmet from '@fastify/helmet';
import FastifySwagger from '@fastify/swagger';
import { Logger } from 'winston';
import logger from './docs/logger';
import {
  httpsPort,
  packageJson,
  productionDomain,
  nodeEnv,
} from './config/config.server';
import { json } from 'stream/consumers';

// Extend Fastify types
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

// Attach logger to fastify instance
fastify.decorate('logger', logger);

// Register security plugins
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      'script-src': ['\'self\'', 'https://cdn.jsdelivr.net'],
    },
  },
  crossOriginResourcePolicy: {
    policy: 'cross-origin', // Allow cross-origin resources like favicon
  },
});

// Register rate limiter
fastify.register(fastifyRateLimit, {
  max: Number(process.env.NUMBER_REQUEST_PER_IP) || 100,
  timeWindow: Number(process.env.REMEMBER_IP_MINUTES) || 15 * 60 * 1000,
  errorResponseBuilder: () => ({
    isSuccess: false,
    message: 'Too many requests, please try again later.',
  }),
});

// Add hooks for headers and logging
fastify.addHook('onRequest', async (request, reply) => {
  // Add custom headers
  reply.header('apiName', packageJson.name);
  reply.header('apiVersion', packageJson.version);

  // Log request start
  const requestId = fastify.logger.routeStart(request);
  (request as any).requestId = requestId;
  (request as any).startTime = process.hrtime();
});

fastify.addHook('preSerialization', async (request, reply, payload: any) => {
  // Skip processing for /docs routes or if payload is not a json object
  if (
    typeof payload !== 'object' ||
    payload === null ||
    reply.getHeader('Content-Type') !== 'application/json'
  ) {
    return payload; // Return as is if not a JSON object
  }

  const originalJson = payload.json.bind(reply); // Preserve original json method

  fastify.logger.info(`Original response payload: ${JSON.stringify(payload)}`); // log the original response payload

  const start = (request as any).startTime;
  const end = process.hrtime();
  const durationInMs =
    (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

  // Extract custom response properties from payload
  const {
    isSuccess = true,
    message = 'Success',
    error,
    override = false,
    ...data
  } = payload;

  let responsePayload;

  // Check if payload is an array or a single object
  if (Array.isArray(payload)) {
    // If it's an array, wrap it in Results
    payload = { Results: payload };
  } else if (typeof payload === 'object' && payload !== null) {
    // If it's a single object, wrap it in Result
    payload = { Result: payload };
  }

  if (override) {
    responsePayload = data; // If override is true, return the response as-is
  } else if (isSuccess) {
    responsePayload = {
      ...payload,
      GenerationTime_ms: durationInMs,
      Success: true,
      Message: message,
    };
  } else {
    responsePayload = {
      Success: false,
      Message: message,
      Error: error,
      GenerationTime_ms: durationInMs,
    };
  }

  return originalJson(responsePayload); // Send the formatted response
});

fastify.addHook('onResponse', async (request, reply) => {
  const start = (request as any).startTime;
  const end = process.hrtime();
  const durationInMs =
    (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

  fastify.logger.routeEnd(
    request,
    reply,
    (request as any).requestId,
    durationInMs
  );
});

// Error handling
fastify.setErrorHandler((error, request, reply) => {
  if (reply.sent) return; // Prevent double response

  fastify.logger.logWithErrorHandling(error.message, error);

  reply
    .status(500)
    .send({
      isSuccess: false,
      message: 'Internal server error',
      error: error.message,
    }); // Send error response
});

fastify.register(FastifySwagger, {
  mode: 'dynamic',
  openapi: {
    info: {
      title: packageJson.name,
      version: packageJson.version,
      description: packageJson.description || 'API documentation',
    },
    servers: [
      {
        url: `http://localhost:${httpsPort || 3000}`,
        description: 'Development server',
      },
      {
        url: `https://${productionDomain || 'api.example.com'}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'API key authentication',
        },
      },
    },
  },
});

let server: FastifyInstance | null = null;

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
    fastify.logger.warn(
      'Server instance not available, skipping close operation'
    );
  }
};

// Only start server automatically if not in test environment
if (nodeEnv !== 'test') {
  startServer();
}

export { fastify as app, startServer, closeServer };
