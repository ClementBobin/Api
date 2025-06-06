import { hashPassword } from '../../lib/hash';
import prisma from '../../lib/db/prismaClient';
import { app } from '../../lib/express';
import {
  type CreateUserSchemaType,
  CreateUserResponseSchema,
} from './user.schema';

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
  const users = prisma.users.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });

  // Validate the list of users against the response schema
  const parsedUsers = CreateUserResponseSchema.array().safeParse(users);
  if (!parsedUsers.success) {
    app.logger.logWithErrorHandling('Invalid users data:', parsedUsers.error, false, 'warn');
  }

  return users;
}

export async function findUserById(id: number) {
  const user = prisma.users.findUnique({
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