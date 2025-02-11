# Nuxt 3 API with Prisma, Testing, and Seeding

## 🚀 Project Overview
This project is a **Nuxt 3 API** setup with **Prisma** for database access, **Vitest** for testing, and a **seeding script** to populate initial data. It is designed to work with **PostgreSQL** (NeonDatabase recommended) but can be adapted for other databases.

---

## 📦 Tech Stack
- **Nuxt 3** – Server-side rendering and API capabilities
- **Prisma** – Database ORM
- **Vitest** – Unit and integration testing
- **Supertest** – HTTP assertions for API testing
- **PostgreSQL** – Database (NeonDatabase recommended)

---

## 📂 Directory Structure
```
my-nuxt-api/
│── prisma/
│   ├── schema.prisma  # Database schema
│   ├── seed.ts        # Database seeding script
│── server/
│   ├── api/
│   │   ├── users.ts   # API endpoint to get users
│── test/
│   ├── api.test.ts    # API test file
│── .env               # Environment variables (DATABASE_URL)
│── package.json       # Dependencies & scripts
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/my-nuxt-api.git
cd my-nuxt-api
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
npx prisma db seed --preview-feature
```

### 6️⃣ Start the Nuxt Server
```sh
npm run dev
```

---

## 📜 API Routes

### **GET /api/users**
Fetch all users from the database.
```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany()
  return { users }
})
```

---

## 🧪 Running Tests
Tests are written using **Vitest** and **Supertest**.
Run tests with:
```sh
npx vitest
```

Example test in `test/api.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from 'h3'

const app = createApp()

describe("API Test", () => {
  it("should return users", async () => {
    const res = await request(app).get("/api/users")
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("users")
  })
})
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
npx prisma db seed --preview-feature
```

---

## 📌 Summary
✅ **Nuxt 3 API** with server routes  
✅ **Prisma ORM** for database management  
✅ **Vitest & Supertest** for testing  
✅ **Database seeding** with initial data  
✅ **PostgreSQL (NeonDatabase recommended)**  

You’re all set! 🚀 Modify the models, add new API routes, and expand as needed.