import { app } from '../../lib/fastify';
import { HealthController } from './server.controller';
import { HealthCheck } from './server.schema';

// Mock the logger
jest.mock('../../lib/fastify', () => {
  const actual = jest.requireActual('../../lib/fastify');
  return {
    app: {
      ...actual.app,
      logger: {
        info: jest.fn(),
        logWithErrorHandling: jest.fn()
      }
    }
  };
});

describe('HealthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'uptime').mockReturnValue(123.45);
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a valid health check response', async () => {
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const result = await HealthController(
      {} as any,
      mockReply as any
    );

    expect(app.logger.info).toHaveBeenCalledWith('Health check endpoint called');
    
    const expectedResponse = {
      Status: 'OK',
      Uptime: '123.45 seconds',
      Message: 'Server is running',
      Timestamp: '2023-01-01T00:00:00.000Z',
      Version: '1.0.0',
      Unix: 1672531200000
    };

    expect(result).toEqual(expectedResponse);
    expect(mockReply.status).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });

  it('should handle validation error when health check response is invalid', async () => {
    // Mock the schema validation to fail
    const originalParse = HealthCheck.strict().safeParse;
    jest.spyOn(HealthCheck, 'strict').mockReturnValue({
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: new Error('Validation error')
      })
    } as any);

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await HealthController(
      {} as any,
      mockReply as any
    );

    expect(app.logger.logWithErrorHandling).toHaveBeenCalledWith(
      'Invalid health check response:',
      expect.any(Error),
      false,
      'warn'
    );
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      isSuccess: false,
      message: 'Internal server error',
      error: expect.any(Error)
    });

    // Restore the original implementation
    jest.spyOn(HealthCheck, 'strict').mockReturnValue({
      safeParse: originalParse
    } as any);
  });

  it('should handle unexpected errors', async () => {
    const mockError = new Error('Unexpected error');
    const mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Force an error in the controller
    jest.spyOn(process, 'uptime').mockImplementation(() => {
      throw mockError;
    });

    await HealthController(
      {} as any,
      mockReply as any
    );

    expect(mockReply.code).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'User creation failed',
      details: 'Unexpected error'
    });
  });
});