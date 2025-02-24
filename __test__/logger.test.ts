import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/logger'; // Assuming the logger is being imported from this path

// Mocking `winston`'s createLogger and its methods

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LOG_TO_CONSOLE = 'true'; // Ensure it's set for every test if needed
    process.env.LOG_LEVEL = 'info'; // Ensure default log level is set
  });

  it('should log request start with routeStart', () => {
    const req = {
      protocol: 'http',
      httpVersion: '1.1',
      method: 'GET',
      originalUrl: '/test',
      headers: { 'user-agent': 'jest' },
    };
    const requestId = 'test-request-id';
    (uuidv4 as jest.Mock).mockReturnValue(requestId);

    // Call the routeStart method
    logger.routeStart(req);

    // Test if info method was called with the correct message
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      `HTTP/1.1 GET /test - Request ID: ${requestId} with headers: ${JSON.stringify(req.headers)}`
    );
  });

  it('should log request end with routeEnd', () => {
    const req = {
      protocol: 'http',
      httpVersion: '1.1',
      method: 'GET',
      originalUrl: '/test',
    };
    const res = {
      statusCode: 200,
      getHeaders: jest.fn().mockReturnValue({ 'content-type': 'application/json' }),
    };
    const requestId = 'test-request-id';
    const durationInMs = 123;

    // Call the routeEnd method
    logger.routeEnd(req, res, requestId, durationInMs);

    // Test if info method was called with the correct message
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      `HTTP/1.1 GET /test - Request ID: ${requestId} - Status: 200, DurationTotal: ${durationInMs}ms, Response Headers: ${JSON.stringify(res.getHeaders())}`
    );
  });

  it('should log error stack trace with logWithErrorHandling', () => {
    const error = new Error('Test error');

    // Call logWithErrorHandling with an error
    logger.logWithErrorHandling('error', error);

    // Test if the log method was called with the error stack
    expect(winston.createLogger().log).toHaveBeenCalledWith('error', error.stack);
  });

  it('should log message normally with logWithErrorHandling', () => {
    const message = 'Test message';

    // Call logWithErrorHandling with a regular message
    logger.logWithErrorHandling('info', message);

    // Test if the log method was called with the message
    expect(winston.createLogger().log).toHaveBeenCalledWith('info', message);
  });

  it('should track operation time with trackOperationTime', async () => {
    const operation = new Promise((resolve) => setTimeout(() => resolve('result'), 100));
    const operationName = 'testOperation';

    // Track the operation time
    const result = await logger.trackOperationTime(operation, operationName);

    // Test if the result matches
    expect(result).toBe('result');

    // Check if the info method was called with operation time
    expect(winston.createLogger().info).toHaveBeenCalledWith(expect.stringContaining(`${operationName} took`));
  });

  it('should log to console when LOG_TO_CONSOLE is true', () => {
    process.env.LOG_TO_CONSOLE = 'true'; // Set this env var to ensure the transport is added
    process.env.LOG_LEVEL = 'info';

    // Import the logger to trigger the setup
    require('../lib/logger'); // Ensures the logger setup is called after mocking

    // Test if the 'add' method is called to add the console transport
    expect(winston.createLogger().add).toHaveBeenCalled();

    // Test if the info method is called with a log message
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      expect.stringContaining('Request ID')
    );
  });

  it('should not add console transport if LOG_TO_CONSOLE is false', () => {
    process.env.LOG_TO_CONSOLE = 'false';

    // Import the logger to trigger the setup
    require('../lib/logger'); // Ensures the logger setup is called after mocking

    // Test that the 'add' method is not called for console transport
    expect(winston.createLogger().add).not.toHaveBeenCalled();
  });

  it('should log to file when LOG_TO_FILE is true', () => {
    process.env.LOG_TO_FILE = 'true'; // Set this env var to ensure the transport is added

    // Import the logger to trigger the setup
    require('../lib/logger'); // Ensures the logger setup is called after mocking

    // Test if the 'add' method was called to add the DailyRotateFile transport
    expect(winston.createLogger().add).toHaveBeenCalled();

    // Test if the info method is called with a log message
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      expect.stringContaining('Request ID')
    );
  });

  it('should not add file transport if LOG_TO_FILE is false', () => {
    process.env.LOG_TO_FILE = 'false';

    // Import the logger to trigger the setup
    require('../lib/logger'); // Ensures the logger setup is called after mocking

    // Test that the 'add' method is not called for file transport
    expect(winston.createLogger().add).not.toHaveBeenCalled();
  });
});
