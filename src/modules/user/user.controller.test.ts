import request from 'supertest';
import express from 'express';
import { app } from '../../../lib/express';
import { registerUserHandler, loginHandler, getUsersHandler } from './user.controller';
import { createUser, findUserByEmail, findUsers } from './user.service';
import { verifyPassword } from '../../../lib/hash';

jest.mock('./user.service');
jest.mock('../../../lib/hash');

app.use(express.json());
app.post('/api/users', registerUserHandler);
app.post('/api/auth/login', loginHandler);
app.get('/api/users', getUsersHandler);

describe('User Controller', () => {
    it('Register a new user successfully', async () => {
        (createUser as jest.Mock).mockResolvedValue({ id: '1', name: 'John Doe', email: 'john@example.com' });
        const response = await request(app)
            .post('/api/users')
            .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'John Doe');
        expect(response.body).toHaveProperty('email', 'john@example.com');
    });

    it('Fail to register a user with invalid input', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: '', email: 'invalid-email', password: 'short' });
        expect(response.status).toBe(400);
    });

    it('Login user successfully', async () => {
        (findUserByEmail as jest.Mock).mockResolvedValue({ email: 'john@example.com', password: 'hashedpassword', salt: 'salt' });
        (verifyPassword as jest.Mock).mockReturnValue(true);
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'john@example.com', password: 'password123' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    });

    it('Fail to login with invalid credentials', async () => {
        (findUserByEmail as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'john@example.com', password: 'wrongpassword' });
        expect(response.status).toBe(401);
    });

    it('Get all users successfully', async () => {
        (findUsers as jest.Mock).mockResolvedValue([{ id: '1', name: 'John Doe', email: 'john@example.com' }]);
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});