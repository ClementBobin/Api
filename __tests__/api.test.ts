import request from 'supertest';
import { createServer } from 'http';
import { handler } from '../app/api/users/route';
import { createRequest, createResponse } from 'node-mocks-http';

describe("API Test", () => {
  it("should return users", async () => {
    const server = createServer((req, res) => {
      // Manually mock Next.js request and response
      const mockReq = createRequest({
        method: 'GET',
        url: '/api/users',  // Mock the URL for the request
      });
      const mockRes = createResponse();

      // Call the Next.js API handler
      handler(mockReq, mockRes);

      // Ensure the response is correctly handled
      res.write(mockRes._getData());
      res.end();
    });

    const res = await request(server).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
  });
});
