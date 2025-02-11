import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp, toNodeListener } from 'h3'
import { createServer } from 'http'

const app = createApp()
const server = createServer(toNodeListener(app))

describe("API Test", () => {
  it("should return users", async () => {
    const res = await request(server).get("/api/users")
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("users")
  })
})
