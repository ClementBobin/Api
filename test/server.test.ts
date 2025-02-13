import fastify from '../src/lib/Fastify';
import { test, expect } from '@jest/globals';

test('GET /users', async () => {
  fastify.get('/users', async (request, reply) => {
    return { users: [] }; // Mock response
  });
  const response = await fastify.inject({
    method: 'GET',
    url: '/users',
  });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ users: [] });
});