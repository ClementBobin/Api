import { Request, Response, RequestHandler } from 'express';
import { app } from '../../lib/express';
import { packageJson, nodeEnv } from '../../lib/config/env.config';
import { HealthCheck } from './server.schema';

export const healthController: RequestHandler = async (
    request: Request,
    reply: Response
  ): Promise<void> => {
    try {
        app.logger.info('Health check endpoint called'); // Log the health check call

        const result = {
            status: 'OK',
            uptime: `${process.uptime()} seconds`,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            version: packageJson.version, // Get the version from package.json
            environment: nodeEnv, // Get the environment from environment variables
            unix: new Date().getTime()
        };

        const ValidateHealthCheck = HealthCheck.strict().safeParse(result); // Validate the health check response
        if (!ValidateHealthCheck.success) {
            app.logger.logWithErrorHandling('Invalid health check response:', ValidateHealthCheck.error, false, 'warn'); // Log validation error
            reply.status(500).json({ isSuccess: false, message: 'Internal server error', error: ValidateHealthCheck.error }); // Send error response
            return;
        }

        reply.status(200).json(result); // Send the health check response
    } catch (e) {
        app.logger.logWithErrorHandling('Error in health check endpoint:', e); // Log unexpected errors
        reply.status(500).send({ error: 'Internal Server Error' }); // Send generic error response
    }
  };