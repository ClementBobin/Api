import prisma from '../lib/PrismaClient'

async function main() {
  await prisma.users.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", password: "password1", salt: "salt1" },
      { name: "Bob", email: "bob@example.com", password: "password2", salt: "salt2" }
    ],
  });
}

main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());