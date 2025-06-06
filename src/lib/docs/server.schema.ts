// Importing the Zod library for schema validation
import { z } from 'zod';

// Importing a function to extend Zod with OpenAPI capabilities
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extending Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Defining a schema for HealthCheck using Zod
export const HealthCheck = z.object({
    // Status of the service
    Status: z.string().openapi({ description: 'Status of the service', example: 'OK' }),
    // Uptime in seconds
    Uptime: z.string().openapi({ description: 'Uptime in seconds', example: '123456 seconds' }),
    // Message indicating server status
    Message: z.string().openapi({ description: 'Message indicating server status', example: 'Server is running' }),
    // Timestamp of the health check
    Timestamp: z.string().datetime().openapi({ description: 'Timestamp of the health check', example: '2021-09-01T12:00:00.000Z' }),
    // API version
    Version: z.string().openapi({ description: 'Api version', example: '14.17.0' }),
    // Unix timestamp
    Unix: z.number().openapi({ description: 'Unix timestamp', example: 1630512000000 })
}).openapi('HealthCheck', { description: 'Health check details' });

// Function to create a generic response schema dynamically
export const createResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
      // Result is a nullable field of the provided schema type
      Result: schema.nullable(),
      // Results is an array of the provided schema type, nullable
      Results: z.array(schema).nullable(),
      // Duration of the response generation, optional field
      GenerationTime_ms: z.number().optional().openapi({ description: 'Duration of the response generation', example: 123.456 }),
      // Success status, optional field
      Success: z.boolean().optional().openapi({ description: 'Success status', example: true }),
      // Message, nullable and optional field
      Message: z.string().nullable().optional().openapi({ description: 'Message', example: 'Success' })
    }).openapi('Response', { description: 'Generic API response' });

// Defining a schema for ResponseError using Zod
export const ResponseError = z.object({
    // Duration of the response generation
    GenerationTime_ms: z.string().openapi({ description: 'Duration of the response generation', example: '123456ms' }),
    // Success status
    Success: z.boolean().openapi({ description: 'Success status', example: false }),
    // Message, nullable field
    Message: z.string().nullable().openapi({ description: 'Message', example: 'Error' }),
    // Error details
    Error: z.any().openapi({ description: 'Error details' }),
}).openapi('ResponseError', { description: 'Error details' });

// TypeScript type for HealthCheck schema
export type HealthCheckType = z.infer<typeof HealthCheck>;

// Creating a response schema that includes the HealthCheck schema
export const ResponseWithHealthCheck = createResponseSchema(HealthCheck);

// TypeScript type for ResponseError schema
export type ResponseErrorType = z.infer<typeof ResponseError>;