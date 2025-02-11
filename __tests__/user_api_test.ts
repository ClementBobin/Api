// __tests__/api.test.ts
import request from 'supertest';
import { app } from '../src/app'; // import the app

describe("API Test", () => {
  it("should return users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
  });
});
