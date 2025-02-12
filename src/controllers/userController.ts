import prisma from '../lib/prismaClient.ts'

export const getUsers = async (req, reply) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  })
  reply.send(users)
}

export const createUser = async (req, reply) => {
  const { name, email } = req.body
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    })
    reply.code(201).send(newUser)
  } catch (error) {
    reply.code(400).send({ error: 'User creation failed', details: error.message })
  }
}

export const getUserById = async (req, reply) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })
  if (!user) return reply.code(404).send({ error: 'User not found' })
  reply.send(user)
}
