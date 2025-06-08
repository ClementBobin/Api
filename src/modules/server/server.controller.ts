import { FastifyRequest, FastifyReply } from 'fastify';
import { app } from '../../lib/fastify';
import { packageJson, nodeEnv } from '../../lib/config/config.server';
import {
    HealthCheck
} from './server.schema';

export const HealthController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    app.logger.info('Health check endpoint called');
  
    const result = {
      Status: 'OK',
      Uptime: `${process.uptime()} seconds`,
      Message: 'Server is running',
      Timestamp: new Date().toISOString(),
      Version: packageJson.version,
      Environment: nodeEnv,
      Unix: new Date().getTime()
    };
  
    const validation = HealthCheck.strict().safeParse(result);
    if (!validation.success) {
      app.logger.logWithErrorHandling('Invalid health check response:', validation.error, false, 'warn');
      return reply.status(500).send({ // Explicit return
        isSuccess: false,
        message: 'Internal server error',
        error: validation.error
      });
    }
  
    return reply.status(200).send(validation.data); // Explicit return
  } catch (error) {
    return reply.code(500).send({ // Explicit return
      error: 'Health check failed', 
      details: (error as Error).message 
    });
  }
};