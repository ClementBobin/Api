import prisma from '../src/lib/db/prismaClient'; // Import the Prisma client
import { generateMockUsers, generateMockProducts } from '../__mocks__/mockSchema';

// Main function to orchestrate the seeding process
async function main() {
  await seedUsers();
  await seedProducts();
}

// Function to seed Users table
async function seedUsers() {
  const users = Array.from({ length: 10 }, generateMockUsers); // Generate 10 mock users

  for (const user of users) {
    await prisma.users.create({
      data: user,
    });
  }

  console.log('Users seeded successfully');
}

// Function to seed Products table
async function seedProducts() {
  const users = await prisma.users.findMany({
    select: { id: true },
  });

  const products = users.flatMap((user) =>
    Array.from({ length: 5 }, () => generateMockProducts(user.id)) // Generate 5 products for each user
  );

  for (const product of products) {
    await prisma.products.create({
      data: product,
    });
  }

  console.log('Products seeded successfully');
}

// Execute the main function and handle errors
main()
  .then(() => console.log('Seeding completed!')) // Log success message
  .catch((e) => console.error(e)) // Log any errors
  .finally(() => prisma.$disconnect()); // Disconnect the Prisma client