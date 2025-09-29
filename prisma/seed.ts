import prisma from '../src/lib/db/PrismaClient';
import { closeServer } from '../src/lib/express';
import {
  capteurTypes,
  sites,
  capteurs,
  siteHasCapteurs,
  releverCapteurs,
} from '../__mocks__/mockSchema';

async function main() {
  await prisma.capteurType.createMany({ data: capteurTypes });

  await prisma.site.createMany({ data: sites });

  const capteurData = capteurs(capteurTypes);
  await prisma.capteur.createMany({ data: capteurData });

  const siteHasCapteurData = siteHasCapteurs(capteurData, sites);
  await prisma.siteHasCapteur.createMany({ data: siteHasCapteurData });

  const releverCapteurData = releverCapteurs(capteurData);
  await prisma.releverCapteur.createMany({ data: releverCapteurData });
}

// Execute the main function and handle errors
main()
  .then(() => console.log('Seeding completed!')) // Log success message
  .catch((e) => console.error(e)) // Log any errors
  .finally(() => {
    prisma.$disconnect(); // Disconnect the Prisma client
    closeServer(); // Close the server
  });
