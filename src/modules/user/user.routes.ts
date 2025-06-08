// src/modules/user/user.routes.ts
import { FastifyInstance } from 'fastify';
import {
  registerUserHandler,
  getUsersHandler,
  getUserByIdHandler
} from './user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    schema: {
      description: 'Get all users',
      tags: ['Users'],
      response: {
        200: {
          description: 'List of users',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    }
  }, getUsersHandler);

  fastify.post('/', {
    schema: {
      description: 'Create a new user',
      tags: ['Users'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      response: {
        201: {
          description: 'User created',
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        }
      }
    }
  }, registerUserHandler);

  fastify.get('/:id', {
    schema: {
      description: 'Get user by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'User details',
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        404: {
          description: 'User not found',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, getUserByIdHandler);
}