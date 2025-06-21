import request from 'supertest';
import { app } from '../../lib/express';
import userRoutes from './user.routes';
import { createUser, findUserByEmail, findUsers, findUserById } from './user.service';
import { verifyPassword } from '../../lib/hash';
import { mockUserWithId } from '../../../__mocks__/mockService';

jest.mock('./user.service');
jest.mock('../../lib/hash');

app.use('/api', userRoutes);

describe('User Controller', () => {
    it('Register a new user successfully', async () => {
        // Mock the createUser service to return a user object
        const mockUser = mockUserWithId();

        (createUser as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app)
            .post('/api/users')
            .send({ name: mockUser.name, email: mockUser.email, password: mockUser.password });
        expect(response.status).toBe(201);
        expect(response.body.result).toHaveProperty('id');
        expect(response.body.result).toHaveProperty('name', mockUser.name);
        expect(response.body.result).toHaveProperty('email', mockUser.email);
    });

    it('Fail to register a user with invalid input', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: '', email: 'invalid-email', password: 'short' });
        expect(response.status).toBe(400);
    });

    it('Login user successfully', async () => {
        // Mock the findUserByEmail
        const mockUser = mockUserWithId();

        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockReturnValue(true);
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: mockUser.email, password: mockUser.password });
        expect(response.status).toBe(200);
        expect(response.body.result).toHaveProperty('accessToken');
    });

    it('Fail to login with invalid credentials', async () => {
        (findUserByEmail as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'john@example.com', password: 'wrongpassword' });
        expect(response.status).toBe(401);
    });

    it('Get all users successfully', async () => {
        const mockUsers = [mockUserWithId(), mockUserWithId()];

        (findUsers as jest.Mock).mockResolvedValue(mockUsers);
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.results).toHaveLength(mockUsers.length);
    });

    it('Get user by ID successfully', async () => {
        const mockUser = mockUserWithId();

        (findUserById as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app).get(`/api/users/${mockUser.id}`);
        expect(response.status).toBe(200);
        expect(response.body.result).toHaveProperty('id', mockUser.id);
        expect(response.body.result).toHaveProperty('name', mockUser.name);
        expect(response.body.result).toHaveProperty('email', mockUser.email);
    });

    it('Fail to get user by non-existent ID', async () => {
        const userId = '999';
        (findUserById as jest.Mock).mockResolvedValue(null);
        const response = await request(app).get(`/api/users/${userId}`);
        expect(response.status).toBe(404);
    });

    it('Fail to get user by invalid ID', async () => {
        const response = await request(app).get('/api/users/invalid-id');
        expect(response.status).toBe(400);
    });
});