import prisma from '../lib/prismaClient'

import { FastifyRequest, FastifyReply } from 'fastify'

export const getUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  })
  reply.send(users)
}

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email } = req.body as { name: string; email: string }
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    })
    reply.code(201).send(newUser)
  } catch (error) {
    reply.code(400).send({ error: 'User creation failed', details: (error as Error).message })
  }
}

export const getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string }
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })
  if (!user) return reply.code(404).send({ error: 'User not found' })
  reply.send(user)
}
