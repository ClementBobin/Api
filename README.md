# Next.js API with Prisma, Testing, and Seeding

## 🚀 Project Overview
This project is a **Next.js API** setup with **Prisma** for database management, **Jest + Supertest** for testing, and a **seeding script** to populate initial data. It uses **PostgreSQL** (NeonDatabase recommended).

---

## 📦 Tech Stack
- **Next.js** – API routes and server-side logic
- **Prisma** – ORM for database operations
- **Jest** – Testing framework [testAPI](https://dev.to/dforrunner/how-to-unit-test-nextjs-13-app-router-api-routes-with-jest-and-react-testing-library-270a) [TestUnit](https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing#mocking-prisma-client)
- **Supertest** – API request testing 
- **PostgreSQL** – Database (NeonDatabase recommended)

---

## 📂 Directory Structure
```
my-next-api/
│── prisma/
│   ├── schema.prisma  # Database schema
│   ├── seed.ts        # Database seeding script
│── pages/api/
│   ├── users.ts       # API endpoint for fetching users
│── __tests__/
│   ├── api.test.ts    # API test file
│── .env               # Environment variables (DATABASE_URL)
│── package.json       # Dependencies & scripts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/my-next-api.git
cd my-next-api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Database
Edit `.env` and set your **PostgreSQL database URL**:
```env
DATABASE_URL="postgresql://user:password@your-neon-db-host/dbname"
```

### 4️⃣ Initialize Prisma & Migrate Database
```sh
npx prisma generate
npx prisma migrate dev --name init
```

### 5️⃣ Run the Seed Script
```sh
npx prisma db seed
```

### 6️⃣ Start the Next.js Server
```sh
npm run dev
```

---

## 📜 API Routes

### **GET /api/users**
Fetch all users from the database.
```ts
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const users = await prisma.user.findMany()
        return res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve users' })
    }
}

export const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        return GET(req, res)
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
```

---

## 🧪 Running Tests
Tests are written using **Jest** and **Supertest**.
Run tests with:
```sh
npm run test
```

Example test in `__tests__/api.test.ts`:
```ts
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
```

---

## 🏗️ Seeding the Database
The `prisma/seed.ts` script populates initial data:
```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" }
    ],
  })
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```
Run it with:
```sh
npx prisma db seed
```

---

## 📌 Summary
✅ **Next.js API** with server routes  
✅ **Prisma ORM** for database management  
✅ **Jest + Supertest** for API testing  
✅ **Database seeding** with initial data  
✅ **PostgreSQL (NeonDatabase recommended)**  

You’re all set! 🚀 Modify the models, add new API routes, and expand as needed.

