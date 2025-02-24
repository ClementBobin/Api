import { createUser, findUserByEmail, findUsers } from './user.service'
import { prismaMock } from '../../../lib/singleton'
describe('User Service', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        salt: 'randomSalt',
        password: 'hashedPassword',
      };

      prismaMock.users.create.mockResolvedValue(user);

      const result = await createUser(input);

      expect(result).toEqual(user);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';

      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        salt: 'randomSalt',
      };

      prismaMock.users.findUnique.mockResolvedValue(user);

      const result = await findUserByEmail(email);

      expect(result).toEqual(user);
    });
  });

  describe('findUsers', () => {
    it('should find all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test1@example.com',
          name: 'Test User 1',
          password: 'defaultPassword',
          salt: 'defaultSalt',
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'hashedPassword1',
          salt: 'randomSalt1',
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Test User 2',
          password: 'hashedPassword2',
          salt: 'randomSalt2',
        },
      ];

      prismaMock.users.findMany.mockResolvedValue(users);

      const result = await findUsers();

      expect(result).toEqual(users);
    });
  });
});
