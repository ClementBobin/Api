import { Request, Response, NextFunction } from 'express';
import type { Logger } from 'winston';

export const configureResponseLogger = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    const requestId = logger.routeStart(req);

    const originalJson = res.json.bind(res);

    res.json = function (this: Response, payload: any): Response {
      const end = process.hrtime();
      const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

      const { isSuccess = true, message = 'Success', error, override = false, ...data } = payload;

      let responsePayload;

      if (Array.isArray(payload)) {
        payload = { Results: payload };
      } else if (typeof payload === 'object' && payload !== null) {
        payload = { Result: payload };
      }

      if (override) {
        responsePayload = data;
      } else if (isSuccess) {
        responsePayload = {
          ...payload,
          GenerationTime_ms: durationInMs,
          Success: true,
          Message: message,
        };
      } else {
        responsePayload = {
          Success: false,
          Message: message,
          Error: error,
          GenerationTime_ms: durationInMs,
        };
      }

      return originalJson(responsePayload);
    };

    res.on('finish', () => {
      const end = process.hrtime();
      const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;
      logger.routeEnd(req, res, requestId, durationInMs);
    });

    next();
  };
};