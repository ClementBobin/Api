import { Request, Response, RequestHandler } from "express";
import { app } from "../../server";
import { verifyPassword } from "../../../lib/hash";
import type { CreateUserSchemaType, LoginSchemaType } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

export const registerUserHandler: RequestHandler = async (
  request: Request<{}, {}, CreateUserSchemaType>,
  reply: Response
): Promise<void> => {
  try {
    // Wrap the DB operation to track time
    const user = await app.logger.trackOperationTime(createUser(request.body), 'createUser DB Operation');
    reply.status(201).send(user);
  } catch (e) {
    console.error(e);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};


export const loginHandler: RequestHandler = async (
  request: Request<{}, {}, LoginSchemaType>,
  reply: Response
): Promise<void> => {
  const user = await app.logger.trackOperationTime(findUserByEmail(request.body.email), "RequestHandler");

  if (!user) {
    reply.status(401).send({ message: "Invalid email or password" });
    return; // ✅ Explicitly stop execution
  }

  const correctPassword = verifyPassword({
    candidatePassword: request.body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    reply.send({ accessToken: "123456" });
    return;
  }

  reply.status(401).send({ message: "Invalid email or password" });
};

export const getUsersHandler: RequestHandler = async (
  request: Request,
  reply: Response
): Promise<void> => {
  const users = await findUsers();
  reply.send(users);
};
