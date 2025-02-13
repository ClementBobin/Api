import prisma from '../lib/client';

async function main() {
  await prisma.users.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", acceptTermsAndConditions: true },
      { name: "Bob", email: "bob@example.com", acceptTermsAndConditions: true }
    ],
  });
}

main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
