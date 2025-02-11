import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany()
    return { users }
  } catch (error) {
    return { error: 'An error occurred while fetching users.' }
  }
})
