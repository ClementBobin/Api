import { Request, Response, NextFunction } from 'express';

export const mockRequest = (options: Partial<Request> = {}): Request => {
  return {
    headers: {},
    method: 'GET',
    originalUrl: '/test',
    ...options,
  } as Request;
};

export const mockResponse = (options: Partial<Response> = {}): Response => {
  const res: Partial<Response> = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    removeHeader: jest.fn(),
    on: jest.fn(),
    ...options,
  };
  return res as Response;
};

export const mockNext = (): NextFunction => jest.fn();

export const mockLogger = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  routeStart: jest.fn().mockReturnValue('mock-request-id'),
  routeEnd: jest.fn(),
  logWithErrorHandling: jest.fn(),
});