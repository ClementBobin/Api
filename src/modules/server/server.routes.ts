

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

const router = express.Router();

// Register OpenAPI paths
registry.registerPath({
    method: 'get',
    path: '/health',
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
  
router.post('/health', healthController);

if (process.env.DOC_ENABLE === 'true') {
    // Swagger documentation route
    router.use(
        '/docs',
        apiReference({ spec: { content: docs } }),
    );
}

export default router;