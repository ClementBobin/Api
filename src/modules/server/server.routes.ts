// src/modules/server/server.routes.ts
import { FastifyInstance } from 'fastify';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { HealthCheck, ResponseWithHealthCheck } from './server.schema';
import { HealthController } from './server.controller';
import { docEnable } from '../../lib/config/config.server';

export default async function serverRoutes(fastify: FastifyInstance) {
    // Health check route with schema
    fastify.get('/health', {
      schema: {
        description: 'Health check endpoint',
        tags: ['Server'],
        response: {
          200: {
            description: 'Server is running',
            type: 'object',
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              isSuccess: { type: 'boolean' },
              message: { type: 'string' },
              error: { type: 'string' }
            }
          }
        }
      }
  }, HealthController);

  if (docEnable) {
    fastify.register(ScalarApiReference, {
      routePrefix: '/docs',
      hooks: {
        onRequest: (request, reply, done) => done(),
        preHandler: (request, reply, done) => done(),
      },
    });
  }
}
