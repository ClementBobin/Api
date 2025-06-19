import { healthController } from './server.controller';
import { mockRequest, mockResponse } from '../../../__mocks__/test-utils';
import { HealthCheck } from './server.schema';
import { packageJson, nodeEnv } from '../../lib/config/env.config';

// Mock process.uptime
const mockUptime = jest.spyOn(process, 'uptime');

describe('healthController', () => {
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    mockUptime.mockReturnValue(123.45);
  });

  it('should return correct health check data when validation succeeds', async () => {
    const mockDate = new Date('2023-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
    
    await healthController(req, res, jest.fn());
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      Status: 'OK',
      Uptime: '123.45 seconds',
      Message: 'Server is running',
      Timestamp: mockDate.toISOString(),
      Version: packageJson.version,
      Environment: nodeEnv,
      Unix: mockDate.getTime()
    });
  });

  it('should include correct version from package.json', async () => {
    await healthController(req, res, jest.fn());
    
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Version: packageJson.version
      })
    );
  });

  it('should include correct environment variable', async () => {
    await healthController(req, res, jest.fn());
    
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Environment: nodeEnv
      })
    );
  });
});