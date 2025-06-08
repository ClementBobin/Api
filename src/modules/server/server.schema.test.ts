// Import necessary modules and types from health.schema
import { HealthCheck, HealthCheckType } from './server.schema';

// Describe the test suite for health.schema
describe('Health.schema tests', () => {
    // Describe the test suite for HealthCheck schema
    describe('HealthCheck schema', () => {

        // Test case for validating a correct HealthCheck object
        it('should validate a correct HealthCheck object', () => {
            // Define a valid HealthCheck object
            const validHealthCheck: HealthCheckType = {
                Status: 'OK',
                Uptime: '123456 seconds',
                Message: 'Server is running',
                Timestamp: '2021-09-01T12:00:00.000Z',
                Version: '14.17.0',
                Environment: 'production',
                Unix: 1630512000000
            };
            // Expect the HealthCheck object to be parsed without throwing an error
            expect(() => HealthCheck.parse(validHealthCheck)).not.toThrow();
        });

        // Test case for invalidating an incorrect HealthCheck object
        it('should invalidate an incorrect HealthCheck object', () => {
            // Define an invalid HealthCheck object
            const invalidHealthCheck = {
                Status: 'OK',
                Uptime: '123456 seconds',
                Message: 'Server is running',
                Timestamp: 'invalid-timestamp',
                Version: '14.17.0',
                Environment: 'production',
                Unix: 'invalid-unix'
            };
            // Expect the HealthCheck object to throw an error when parsed
            expect(() => HealthCheck.parse(invalidHealthCheck)).toThrow();
        });
    });
});