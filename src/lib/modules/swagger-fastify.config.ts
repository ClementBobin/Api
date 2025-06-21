import FastifySwagger from '@fastify/swagger';
import { packageJson, httpsPort, productionDomain } from '../config/config.server';
import type { FastifyInstance } from 'fastify';

export const configureSwagger = async (fastify: FastifyInstance) => {
  await fastify.register(FastifySwagger, {
    mode: 'dynamic',
    openapi: {
      info: {
        title: packageJson.name,
        version: packageJson.version,
        description: packageJson.description || 'API documentation',
      },
      servers: [
        {
          url: `http://localhost:${httpsPort}`,
          description: 'Development server',
        },
        {
          url: `https://${productionDomain}`,
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
};