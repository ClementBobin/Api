// Import necessary modules and types from server.schema
import { createResponseSchema, ResponseError, ResponseErrorType } from './server.schema';
import { HealthCheck } from '../../modules/health/health.schema';

// Describe the test suite for server.schema
describe('Server.schema tests', () => {
    // Describe the test suite for Response schema
    describe('Response schema', () => {
        // Create a Response schema with HealthCheck
        const ResponseWithHealthCheck = createResponseSchema(HealthCheck);

        // Test case for validating a correct ResponseWithHealthCheck object
        it('should validate a correct ResponseWithHealthCheck object', () => {
            // Define a valid ResponseWithHealthCheck object
            const validResponse = {
                Result: {
                    Status: 'OK',
                    Uptime: '123456 seconds',
                    Message: 'Server is running',
                    Timestamp: '2021-09-01T12:00:00.000Z',
                    Version: '14.17.0',
                    Unix: 1630512000000
                },
                Results: [
                    {
                        Status: 'OK',
                        Uptime: '123456 seconds',
                        Message: 'Server is running',
                        Timestamp: '2021-09-01T12:00:00.000Z',
                        Version: '14.17.0',
                        Unix: 1630512000000
                    }
                ],
                GenerationTime_ms: 123.456,
                Success: true,
                Message: 'Success'
            };
            // Expect the ResponseWithHealthCheck object to be parsed without throwing an error
            expect(() => ResponseWithHealthCheck.parse(validResponse)).not.toThrow();
        });

        // Test case for invalidating an incorrect ResponseWithHealthCheck object
        it('should invalidate an incorrect ResponseWithHealthCheck object', () => {
            // Define an invalid ResponseWithHealthCheck object
            const invalidResponse = {
                Result: {
                    Status: 'OK',
                    Uptime: '123456 seconds',
                    Message: 'Server is running',
                    Timestamp: '2021-09-01T12:00:00.000Z',
                    Version: '14.17.0',
                    Unix: 1630512000000
                },
                Results: 'invalid-results',
                GenerationTime_ms: 'invalid-generationtime',
                Success: true,
                Message: 'Success'
            };
            // Expect the ResponseWithHealthCheck object to throw an error when parsed
            expect(() => ResponseWithHealthCheck.parse(invalidResponse)).toThrow();
        });
    });

    // Describe the test suite for ResponseError schema
    describe('ResponseError schema', () => {

        // Test case for validating a correct ResponseError object
        it('should validate a correct ResponseError object', () => {
            // Define a valid ResponseError object
            const validResponseError: ResponseErrorType = {
                GenerationTime_ms: '123456ms',
                Success: false,
                Message: 'Error',
                Error: { detail: 'Some error detail' }
            };
            // Expect the ResponseError object to be parsed without throwing an error
            expect(() => ResponseError.parse(validResponseError)).not.toThrow();
        });
    });
});