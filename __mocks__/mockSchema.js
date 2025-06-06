import { faker } from '@faker-js/faker';
// Helper function to generate mock Users data
export const generateMockUsers = () => ({
    id: faker.number.int({ min: 1, max: 2147483647 }), // Ensure the ID fits within a 32-bit signed integer
    email: faker.internet.email(),
    name: faker.person.firstName(), // Optional field
    password: faker.internet.password(),
    salt: faker.string.alphanumeric(16),
});
// Helper function to generate mock Products data
export const generateMockProducts = (ownerId) => ({
    id: faker.number.int({ min: 1, max: 2147483647 }), // Prisma will autoincrement this in the database
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    title: faker.commerce.productName(),
    content: faker.lorem.sentence(), // Optional field
    price: parseFloat(faker.commerce.price()),
    ownerId, // Foreign key to Users
});
