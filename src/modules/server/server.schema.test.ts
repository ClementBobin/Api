// Import necessary modules and types from server.schema
import { HealthCheck, HealthCheckType } from './server.schema';

// Describe the test suite for server.schema
describe('Server.schema tests', () => {

    // Describe the test suite for HealthCheck schema
    describe('HealthCheck schema', () => {

        // Test case for validating a correct HealthCheck object
        it('should validate a correct HealthCheck object', () => {
            // Define a valid HealthCheck object
            const validHealthCheck: HealthCheckType = {
                status: 'OK',
                uptime: '123456 seconds',
                message: 'Server is running',
                timestamp: '2021-09-01T12:00:00.000Z',
                version: '14.17.0',
                environment: 'production',
                unix: 1630512000000
            };
            // Expect the HealthCheck object to be parsed without throwing an error
            expect(() => HealthCheck.parse(validHealthCheck)).not.toThrow();
        });

        // Test case for invalidating an incorrect HealthCheck object
        it('should invalidate an incorrect HealthCheck object', () => {
            // Define an invalid HealthCheck object
            const invalidHealthCheck = {
                status: 'OK',
                uptime: '123456 seconds',
                message: 'Server is running',
                timestamp: 'invalid-timestamp',
                version: '14.17.0',
                environment: 'production',
                unix: 'invalid-unix'
            };
            // Expect the HealthCheck object to throw an error when parsed
            expect(() => HealthCheck.parse(invalidHealthCheck)).toThrow();
        });
    });
});