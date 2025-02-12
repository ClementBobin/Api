import { getUsers, createUser, getUserById } from '../controllers/userController.ts'

export default async function userRoutes(fastify) {
  fastify.get('/users', getUsers)

  fastify.post('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, createUser)

  fastify.get('/users/:id', getUserById)
}
