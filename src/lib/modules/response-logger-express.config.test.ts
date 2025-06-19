import { configureResponseLogger } from './response-logger-express.config';
import { mockRequest, mockResponse, mockNext, mockLogger } from '../../../__mocks__/test-utils';

describe('Response Logger Middleware', () => {
  let logger: ReturnType<typeof mockLogger>;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  let next: ReturnType<typeof mockNext>;

  beforeEach(() => {
    logger = mockLogger();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  it('should call routeStart on request', () => {
    configureResponseLogger(logger)(req, res, next);
    expect(logger.routeStart).toHaveBeenCalledWith(req);
  });

  it('should override res.json to format successful response', () => {
    const middleware = configureResponseLogger(logger);
    middleware(req, res, next);

    const testPayload = { data: 'test' };
    res.json(testPayload);

    expect(res.json).toHaveBeenCalledWith({
      Result: { data: 'test' },
      GenerationTime_ms: expect.any(Number),
      Success: true,
      Message: 'Success'
    });
  });

  it('should override res.json to format error response', () => {
    const middleware = configureResponseLogger(logger);
    middleware(req, res, next);

    const testPayload = { isSuccess: false, message: 'Error', error: 'Test error' };
    res.json(testPayload);

    expect(res.json).toHaveBeenCalledWith({
      Success: false,
      Message: 'Error',
      Error: 'Test error',
      GenerationTime_ms: expect.any(Number)
    });
  });

  it('should call routeEnd when response finishes', () => {
    const middleware = configureResponseLogger(logger);
    middleware(req, res, next);

    // Simulate response finish
    const finishCallback = (res.on as jest.Mock).mock.calls[0][1];
    finishCallback();

    expect(logger.routeEnd).toHaveBeenCalledWith(
      req,
      res,
      'mock-request-id',
      expect.any(Number)
    );
  });

  it('should call next()', () => {
    configureResponseLogger(logger)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});