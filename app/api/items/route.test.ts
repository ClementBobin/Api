/**
 * @jest-environment node
 */
import { POST } from './route';
import prisma from '@/lib/client';
import type { NextRequest } from 'next/server';

// Mock prisma
// We want to ensure we're mocking the prisma client for this test
// so we don't actually make a call to the database
jest.mock('@/lib/client', () => ({
  __esModule: true,
  default: {
    item: {
      create: jest.fn(),
    },
  },
}));

it('should return added data with status 201', async () => {
  const requestObj = {
    json: async () => ({ name: 'Item 3' }),
  } as NextRequest;

  // Mock the prisma client to return a value
  (prisma.items.create as jest.Mock).mockResolvedValue({ id: 2, name: 'Item 3' });

  // Call the POST function
  const response = await POST(requestObj);
  const body = await response.json();

  // Check the response
  expect(response.status).toBe(201);
  expect(body.id).toEqual(expect.any(Number));
  expect(body.name).toBe('Item 3');
  expect(prisma.items.create).toHaveBeenCalledTimes(1);
});

it('should return status 400 when name is missing from request body', async () => {
  const requestObj = {
    json: async () => ({}),
  } as NextRequest;

  (prisma.items.create as jest.Mock).mockResolvedValue({ id: 2, name: 'Item 3' });

  const response = await POST(requestObj);
  const body = await response.json();

  expect(response.status).toBe(400);
  expect(body.message).toEqual(expect.any(String));
  expect(prisma.items.create).not.toHaveBeenCalled();
});

it('should return status 500 when prisma query rejects', async () => {
  const requestObj = {
    json: async () => ({ name: 'Item 3' }),
  } as NextRequest;

  // Mock the prisma client to reject the query
  (prisma.items.create as jest.Mock).mockRejectedValue(new Error('Failed to create item'));

  const response = await POST(requestObj);
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body.message).toEqual(expect.any(String));
});