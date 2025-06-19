import { Request, Response, RequestHandler } from 'express';
import { app } from '../../lib/express';
import { z } from 'zod'; // Importing zod for validation
import { verifyPassword } from '../../lib/hash';
import {
  type CreateUserSchemaType,
  type LoginSchemaType,
  CreateUserSchema,
  LoginSchema,
} from './user.schema';
import { createUser, findUserByEmail, findUsers, findUserById } from './user.service';

export const registerUserHandler: RequestHandler = async (
  request: Request<{}, {}, CreateUserSchemaType>,
  reply: Response
): Promise<void> => {
  try {
    // Validate request body against CreateUserSchema
    const parsedBody = CreateUserSchema.safeParse(request.body);
    if (!parsedBody.success) {
      app.logger.logWithErrorHandling('Invalid request body:', parsedBody.error, false, 'warn'); // Logging validation error
      reply.status(400).json({ isSuccess: false, message: 'Invalid request body', error: parsedBody.error }); // Sending error response
      return; // ✅ Explicitly stop execution
    }
    // Wrap the DB operation to track time
    const user = await app.logger.trackOperationTime(createUser(request.body), 'createUser DB Operation');
    reply.status(201).send(user);
  } catch (e) {
    console.error(e);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const loginHandler: RequestHandler = async (
  request: Request<{}, {}, LoginSchemaType>,
  reply: Response
): Promise<void> => {
  // Validate request body against LoginSchema
  const parsedBody = LoginSchema.safeParse(request.body);
  if (!parsedBody.success) {
    app.logger.logWithErrorHandling('Invalid request body:', parsedBody.error, false, 'warn'); // Logging validation error
    reply.status(400).json({ isSuccess: false, message: 'Invalid request body', error: parsedBody.error }); // Sending error response
    return; // ✅ Explicitly stop execution
  }

  const user = await app.logger.trackOperationTime(findUserByEmail(request.body.email), 'RequestHandler');

  if (!user) {
    reply.status(401).send({ message: 'Invalid email or password' });
    return; // ✅ Explicitly stop execution
  }

  const correctPassword = verifyPassword({
    candidatePassword: request.body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    reply.send({ accessToken: '123456' });
    return;
  }

  reply.status(401).send({ message: 'Invalid email or password' });
};

export const getUsersHandler: RequestHandler = async (
  request: Request,
  reply: Response
): Promise<void> => {
  const users = await findUsers();
  reply.send(users);
};

export const getUserByIdHandler: RequestHandler<{ id: string }> = async (
  request: Request<{ id: string }>,
  reply: Response
): Promise<void> => {
  const userId = parseInt(request.params.id, 10);

  const validUserId = z.number().safeParse(userId); // Validating userId using zod
  if (!validUserId.success) {
    app.logger.logWithErrorHandling('Invalid UserId:', validUserId.error, false, 'warn'); // Logging validation error
    reply.status(400).json({ isSuccess: false, message: 'Invalid UserId', error: validUserId.error }); // Sending error response
    return;
  }

  const user = await findUserById(userId);

  if (!user) {
    reply.status(404).send({ message: 'User not found' });
    return; // ✅ Explicitly stop execution
  }

  reply.send(user);
};