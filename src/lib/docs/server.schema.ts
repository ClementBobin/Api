// Importing the Zod library for schema validation
import { z } from 'zod';

// Importing a function to extend Zod with OpenAPI capabilities
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extending Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

// Function to create a generic response schema dynamically
export const createResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
      // Result is a nullable field of the provided schema type
      result: schema.nullable(),
      // Results is an array of the provided schema type, nullable
      results: z.array(schema).nullable(),
      // Duration of the response generation, optional field
      generationTime_ms: z.number().optional().openapi({ description: 'Duration of the response generation', example: 123.456 }),
      // Success status, optional field
      success: z.boolean().optional().openapi({ description: 'Success status', example: true }),
      // Message, nullable and optional field
      message: z.string().nullable().optional().openapi({ description: 'Message', example: 'Success' })
    }).openapi('Response', { description: 'Generic API response' });

// Defining a schema for ResponseError using Zod
export const ResponseError = z.object({
    // Duration of the response generation
    generationTime_ms: z.string().openapi({ description: 'Duration of the response generation', example: '123456ms' }),
    // Success status
    success: z.boolean().openapi({ description: 'Success status', example: false }),
    // Message, nullable field
    message: z.string().nullable().openapi({ description: 'Message', example: 'Error' }),
    // Error details
    error: z.any().openapi({ description: 'Error details' }),
}).openapi('ResponseError', { description: 'Error details' });

// TypeScript type for ResponseError schema
export type ResponseErrorType = z.infer<typeof ResponseError>;