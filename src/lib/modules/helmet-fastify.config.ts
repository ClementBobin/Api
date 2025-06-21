import fastifyHelmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

export const configureHelmet = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        'script-src': ['\'self\'', 'https://cdn.jsdelivr.net'],
      },
    },
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  });
};