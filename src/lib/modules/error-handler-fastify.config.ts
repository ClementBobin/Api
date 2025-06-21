import type { FastifyInstance } from 'fastify';

export const configureErrorHandler = async (fastify: FastifyInstance) => {
    fastify.setErrorHandler((error, request, reply) => {
      if (reply.sent) return;
  
      fastify.logger.logWithErrorHandling(error.message, error);
  
      reply.status(500).send({
        isSuccess: false,
        message: 'Internal server error',
        error: error.message,
      });
    });
  };