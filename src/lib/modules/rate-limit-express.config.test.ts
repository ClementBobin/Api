import { configureRateLimit } from './rate-limit-express.config';
import rateLimit from 'express-rate-limit';

jest.mock('express-rate-limit');

describe('Rate Limit Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use default values when env vars are not set', () => {
    const rateLimitMock = rateLimit as jest.MockedFunction<typeof rateLimit>;
    configureRateLimit();
    
    expect(rateLimitMock).toHaveBeenCalledWith({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        isSuccess: false,
        message: 'Too many requests, please try again later.'
      }
    });
  });

  it('should use environment variables when set', () => {
    process.env.REMEMBER_IP_MINUTES = '30';
    process.env.NUMBER_REQUEST_PER_IP = '200';
    
    const rateLimitMock = rateLimit as jest.MockedFunction<typeof rateLimit>;
    configureRateLimit();
    
    expect(rateLimitMock).toHaveBeenCalledWith({
      windowMs: 30 * 60 * 1000,
      max: 200,
      message: {
        isSuccess: false,
        message: 'Too many requests, please try again later.'
      }
    });
  });
});