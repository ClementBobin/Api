import { healthController } from './server.controller';
import { mockRequest, mockResponse, mockNext } from '../../../__mocks__/test-utils';
import { HealthCheck } from './server.schema';

describe('healthController', () => {
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  let next: ReturnType<typeof mockNext>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create fresh mocks for each test
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  it('should return a 200 status with health check data when successful', async () => {
    // Mock process.uptime to return a predictable value
    const mockUptime = 12345;
    jest.spyOn(process, 'uptime').mockReturnValue(mockUptime);

    // Mock Date to return predictable values
    const mockDate = new Date('2023-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

    await healthController(req, res, next);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      uptime: `${mockUptime} seconds`,
      message: 'Server is running',
      timestamp: mockDate.toISOString(),
      version: expect.any(String),
      environment: expect.any(String),
      unix: mockDate.getTime()
    });

    // Verify logger was called
    // expect(app.logger.info).toHaveBeenCalledWith('Health check endpoint called');
  });

  it('should handle validation errors and return 500 status', async () => {
    // Force the validation to fail by mocking the schema
    jest.spyOn(HealthCheck, 'strict').mockReturnValue({
      safeParse: () => ({
        success: false,
        error: new Error('Validation failed')
      })
    } as any);

    await healthController(req, res, next);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      isSuccess: false,
      message: 'Internal server error',
      error: expect.any(Error)
    });

    // Verify error was logged
    // expect(app.logger.logWithErrorHandling).toHaveBeenCalledWith(
    //   'Invalid health check response:',
    //   expect.any(Error),
    //   false,
    //   'warn'
    // );
  });

  it('should handle unexpected errors and return 500 status', async () => {
    // Force an error by making process.uptime throw
    jest.spyOn(process, 'uptime').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await healthController(req, res, next);

    // Verify error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});