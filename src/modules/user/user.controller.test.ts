import { app } from '../../lib/fastify';
import userRoutes from './user.routes';
import { createUser, findUserByEmail, findUsers, findUserById } from './user.service';
import { verifyPassword } from '../../lib/hash';
import { mockUserWithId } from '../../../__mocks__/mockService';

jest.mock('./user.service');
jest.mock('../../lib/hash');

// Register routes for testing
app.register(userRoutes, { prefix: '/api' });

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Register a new user successfully', async () => {
    const mockUser = mockUserWithId();
    (createUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password
      }
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.Result).toHaveProperty('id');
    expect(body.Result).toHaveProperty('name', mockUser.name);
    expect(body.Result).toHaveProperty('email', mockUser.email);
  });

  it('Fail to register a user with invalid input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        name: '',
        email: 'invalid-email',
        password: 'short'
      }
    });

    expect(response.statusCode).toBe(400);
  });

  it('Login user successfully', async () => {
    const mockUser = mockUserWithId();
    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockReturnValue(true);

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: mockUser.email,
        password: mockUser.password
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.Result).toHaveProperty('accessToken');
  });

  it('Fail to login with invalid credentials', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'john@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.statusCode).toBe(401);
  });

  it('Get all users successfully', async () => {
    const mockUsers = [mockUserWithId(), mockUserWithId()];
    (findUsers as jest.Mock).mockResolvedValue(mockUsers);

    const response = await app.inject({
      method: 'GET',
      url: '/api/users'
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.Results).toHaveLength(mockUsers.length);
  });

  it('Get user by ID successfully', async () => {
    const mockUser = mockUserWithId();
    (findUserById as jest.Mock).mockResolvedValue(mockUser);

    const response = await app.inject({
      method: 'GET',
      url: `/api/users/${mockUser.id}`
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.Result).toHaveProperty('id', mockUser.id);
    expect(body.Result).toHaveProperty('name', mockUser.name);
    expect(body.Result).toHaveProperty('email', mockUser.email);
  });

  it('Fail to get user by non-existent ID', async () => {
    const userId = '999';
    (findUserById as jest.Mock).mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: `/api/users/${userId}`
    });

    expect(response.statusCode).toBe(404);
  });

  it('Fail to get user by invalid ID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/users/invalid-id'
    });

    expect(response.statusCode).toBe(400);
  });
});