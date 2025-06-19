import { configureErrorHandler } from './error-handler-express.config';
import { mockRequest, mockResponse, mockLogger } from '../../../__mocks__/test-utils';

describe('Error Handler Middleware', () => {
  it('should log the error and send 500 response', () => {
    const logger = mockLogger();
    const errorHandler = configureErrorHandler(logger);
    const req = mockRequest();
    const res = mockResponse();
    const error = new Error('Test error');

    errorHandler(error, req, res, jest.fn());

    expect(logger.logWithErrorHandling).toHaveBeenCalledWith('Test error', error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      isSuccess: false,
      message: 'Internal server error',
      error: 'Test error'
    });
  });
});