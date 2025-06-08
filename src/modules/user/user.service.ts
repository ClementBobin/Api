import { hashPassword } from '../../lib/hash';
import prisma from '../../lib/db/prismaClient';
import {
  type CreateUserSchemaType,
  CreateUserResponseSchema,
} from './user.schema';
import { app } from '../../lib/fastify';

export async function createUser(input: CreateUserSchemaType) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.users.create({
    data: { ...rest, salt, password: hash },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  // Validate the created user against the response schema
  const parsedUser = CreateUserResponseSchema.safeParse(user);
  if (!parsedUser.success) {
    app.logger.logWithErrorHandling('Invalid user data:', parsedUser.error, false, 'warn');
  }

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  try {
    const users = await prisma.users.findMany({
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    app.logger.info('Fetching all users from the database');
    
    // Log the actual data structure for debugging
    app.logger.info('Users data:', JSON.stringify(users, null, 2));

    // Validate the data
    const parsedUsers = CreateUserResponseSchema.array().safeParse(users);
    
    if (!parsedUsers.success) {
      app.logger.error('Zod validation failed:', parsedUsers.error);
      throw new Error('Invalid user data structure');
    }

    // Return properly formatted data
    return {
      success: true,
      data: users,
      count: users.length,
    };
    
  } catch (error) {
    app.logger.error('Error in findUsers:', error);
    throw error;
  }
}

export async function findUserById(id: number) {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  // Validate the found user against the response schema
  const parsedUser = CreateUserResponseSchema.safeParse(user);
  if (!parsedUser.success) {
    app.logger.logWithErrorHandling('Invalid user data:', parsedUser.error, false, 'warn');
  }

  return user;
}