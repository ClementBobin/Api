import fastifyRateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export const configureRateLimit = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, {
    max: Number(process.env.NUMBER_REQUEST_PER_IP) || 100,
    timeWindow: Number(process.env.REMEMBER_IP_MINUTES) || 15 * 60 * 1000,
    errorResponseBuilder: () => ({
      isSuccess: false,
      message: 'Too many requests, please try again later.',
    }),
  });
};