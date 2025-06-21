import type { FastifyInstance } from 'fastify';
import { packageJson } from '../config/config.server';

export const configureRequestHooks = async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request, reply) => {
      reply.header('apiName', packageJson.name);
      reply.header('apiVersion', packageJson.version);
      
      const requestId = fastify.logger.routeStart(request);
      (request as any).requestId = requestId;
      (request as any).startTime = process.hrtime();
    });
  
    fastify.addHook('preSerialization', async (request, reply, payload: any) => {
      if (typeof payload !== 'object' || payload === null ||
          reply.getHeader('Content-Type') !== 'application/json') {
        return payload;
      }
  
      const start = (request as any).startTime;
      const end = process.hrtime();
      const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;
  
      const { isSuccess = true, message = 'Success', error, override = false, ...data } = payload;
  
      let responsePayload;
  
      if (Array.isArray(payload)) {
        payload = { results: payload };
      } else if (typeof payload === 'object' && payload !== null) {
        payload = { result: payload };
      }
  
      if (override) {
        responsePayload = data;
      } else if (isSuccess) {
        responsePayload = {
          ...payload,
          generationTime_ms: durationInMs,
          success: true,
          message: message,
        };
      } else {
        responsePayload = {
          success: false,
          message: message,
          error: error,
          generationTime_ms: durationInMs,
        };
      }
  
      return responsePayload;
    });
  
    fastify.addHook('onResponse', async (request, reply) => {
      const start = (request as any).startTime;
      const end = process.hrtime();
      const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;
  
      fastify.logger.routeEnd(request, reply, (request as any).requestId, durationInMs);
    });
  };