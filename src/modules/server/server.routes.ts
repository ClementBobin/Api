import express from 'express';
import {
  healthController
} from './server.controller';
import registry from '../../lib/docs/openAPIRegistry';
import { ResponseError } from '../../lib/docs/server.schema';
import {
  ResponseWithHealthCheck
} from './server.schema';
import { apiReference } from '@scalar/express-api-reference';
import { docs } from '../../lib/docs/docOpenApi';
import { app } from '../../lib/express';
import { docEnable } from '../../lib/config/env.config';

const router = express.Router();

// Register OpenAPI paths
registry.registerPath({
    method: 'get',
    path: '/api/health',
    summary: 'Health check endpoint',
    tags: ['Server'],
    responses: {
      200: {
        description: 'Server is running',
        content: {
          'application/json': {
            schema: ResponseWithHealthCheck,
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ResponseError,
          },
        },
      },
    },
  });
  
router.get('/health', healthController);

if (docEnable) {
  registry.registerPath({
    method: 'get',
    path: '/api/docs',
    summary: 'API documentation',
    tags: ['Server'],
    responses: {
      200: {
        description: 'API documentation',
      },
    },
  });

  // Swagger documentation route
  router.use(
      '/docs',
      apiReference({ spec: { content: docs } }),
  );

  registry.registerPath({
    method: 'get',
    path: '/api/openapi.json',
    summary: 'OpenAPI JSON documentation',
    tags: ['Server'],
    responses: {
      200: {
        description: 'OpenAPI JSON documentation',
      },
    },
  });

  // OpenAPI JSON route
  router.get('/openapi.json', (req, res) => {
    const openApiDocument = docs();
    res.json(openApiDocument);
  });
}

export default router;