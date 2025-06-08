import { FastifyRequest, FastifyReply } from 'fastify';
import {
  type CreateUserSchemaType,
  CreateUserSchema,
} from './user.schema';
import { z } from 'zod';
import { createUser, findUsers, findUserById } from './user.service';

export const registerUserHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parsedBody = CreateUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.code(400).send({ error: 'Invalid request body', details: parsedBody.error });
    }

    const user = await createUser(parsedBody.data as CreateUserSchemaType);

    reply.code(201).send(user);
  } catch (error) {
    reply.code(500).send({ error: 'User creation failed', details: (error as Error).message });
  }
};

// Example user controller fix
export const getUsersHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await findUsers(); // Make sure this returns the actual data, not a promise
    
    return users; // Let Fastify handle the serialization
  } catch (error) {
    return reply.code(500).send({
      isSuccess: false,
      message: 'Failed to get users',
      error: (error as Error).message
    });
  }
};

export const getUserByIdHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };

    const userId = parseInt(id, 10);

    const validUserId = z.number().int().safeParse(userId); // Validating userId as an integer using zod
    if (!validUserId.success) {
      reply.status(400).send({ isSuccess: false, message: 'Invalid UserId', error: validUserId.error }); // Sending error response
      return;
    }

    const user = await findUserById(userId);

    if (!user) return reply.code(404).send({ error: 'User not found' });
    reply.send(user);
  } catch (error) {
    reply.code(500).send({ error: 'Failed to retrieve user', details: (error as Error).message });
  }
};
