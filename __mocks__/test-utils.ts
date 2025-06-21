import type { Logger } from 'winston';

export const mockLogger = (): Logger => {
  const logger = jest.createMockFromModule<typeof import('../src/lib/docs/logger')>('../src/lib/docs/logger').default;

  logger.info = jest.fn();
  logger.error = jest.fn();
  logger.warn = jest.fn();
  logger.logWithErrorHandling = jest.fn();
  logger.routeStart = jest.fn().mockReturnValue('mock-request-id');
  logger.routeEnd = jest.fn();
  logger.trackOperationTime = jest.fn(async (operation: Promise<any>) => await operation);

  return logger;
};