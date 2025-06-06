import request from 'supertest'; // Import supertest for HTTP assertions
import { app } from './express'; // Import the Express app and server instance
import fs from 'fs'; // Import the file system module

// Mock the logger to avoid actual logging during tests
const mockLogger = {
    logWithErrorHandling: jest.fn(), // Mock the logWithErrorHandling function
    routeStart: jest.fn().mockReturnValue('request-id'), // Mock the routeStart function to return a request ID
    routeEnd: jest.fn(), // Mock the routeEnd function
    info: jest.fn(), // Mock the info function
};

// Assign the mock logger to the app's logger
app.logger = mockLogger as any;

describe('Express App', () => {

    // Test suite for the /health endpoint
    describe('GET /health', () => {
        it('should return 200 with health check information', async () => {
            // Mock reading package.json to return a specific version
            const packageJson = { version: '1.0.0' };
            jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(packageJson));

            // Make a GET request to the /health endpoint
            const response = await request(app).get('/health');

            // Extract the response body
            const responseBody = response.body;

            // Assert that the response body contains the expected health check information
            expect(responseBody.Result).toMatchObject({
                Status: 'OK',
                Message: 'Server is running',
                Version: '1.0.0',
            });
            expect(responseBody.Result).toHaveProperty('Uptime'); // Check if Uptime property exists
            expect(responseBody.Result).toHaveProperty('Timestamp'); // Check if Timestamp property exists
            expect(responseBody.Result).toHaveProperty('Unix'); // Check if Unix property exists
        });
    });

    // Test suite for the request logging middleware
    describe('Request Logging Middleware', () => {
        it('should log request start and end', async () => {
            // Make a GET request to the /health endpoint
            const response = await request(app).get('/health');

            // Assert that the response status is 200
            expect(response.status).toBe(200);
            // Assert that the routeStart and routeEnd functions were called
            expect(mockLogger.routeStart).toHaveBeenCalled();
            expect(mockLogger.routeEnd).toHaveBeenCalled();
        });

        it('should override res.json and add generation time', async () => {
            // Make a GET request to the /health endpoint
            const response = await request(app).get('/health');

            // Assert that the response status is 200
            expect(response.status).toBe(200);
            // Assert that the response body contains the GenerationTime_ms property
            expect(response.body).toHaveProperty('GenerationTime_ms');
            // Assert that the response body contains the Success property with value true
            expect(response.body).toHaveProperty('Success', true);
            // Assert that the response body contains the Message property with value 'Success'
            expect(response.body).toHaveProperty('Message', 'Success');
        });
    });
});