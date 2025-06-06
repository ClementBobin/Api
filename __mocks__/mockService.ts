import { faker } from '@faker-js/faker';

export const mockUser = () => {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
  };
};

export const mockCreateUser = () => {
  return {
    ...mockUser(),
    password: faker.internet.password(),
  };
};

export const mockUserWithId = () => {
  return {
    ...mockCreateUser(),
    id: faker.number.int({ min: 1, max: 1000 }),
    salt: faker.string.alphanumeric(16),
  };
};