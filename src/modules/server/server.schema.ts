// Importing the Zod library for schema validation
import { z } from 'zod';

// Importing a function to extend Zod with OpenAPI capabilities
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Function to create a generic response schema dynamically
import { createResponseSchema } from '../../lib/docs/server.schema';

// Extending Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Defining a schema for HealthCheck using Zod
export const HealthCheck = z.object({
    // Status of the service
    status: z.string().openapi({ description: 'Status of the service', example: 'OK' }),
    // Uptime in seconds
    uptime: z.string().openapi({ description: 'Uptime in seconds', example: '123456 seconds' }),
    // Message indicating server status
    message: z.string().openapi({ description: 'Message indicating server status', example: 'Server is running' }),
    // Timestamp of the health check
    timestamp: z.string().datetime().openapi({ description: 'Timestamp of the health check', example: '2021-09-01T12:00:00.000Z' }),
    // API version
    version: z.string().openapi({ description: 'Api version', example: '14.17.0' }),
    // Environment in which the server is running
    environment: z.string().openapi({ description: 'Environment in which the server is running', example: 'production' }),
    // Unix timestamp
    unix: z.number().openapi({ description: 'Unix timestamp', example: 1630512000000 })
}).openapi('HealthCheck', { description: 'Health check details' });

// TypeScript type for HealthCheck schema
export type HealthCheckType = z.infer<typeof HealthCheck>;

// Creating a response schema that includes the HealthCheck schema
export const ResponseWithHealthCheck = createResponseSchema(HealthCheck);