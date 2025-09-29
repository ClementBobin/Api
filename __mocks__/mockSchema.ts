import { faker } from '@faker-js/faker';

export const capteurTypes = Array.from({ length: 5 }, () => ({
  Id: faker.string.uuid(),
  Name: faker.commerce.department(),
  Module: faker.commerce.productAdjective(),
  Type: faker.commerce.productMaterial(),
  ModelName: faker.commerce.productName(),
}));

export const sites = Array.from({ length: 10 }, () => ({
  Id: faker.string.uuid(),
  Name: faker.company.name(),
}));

export const capteurs = (capteurTypes: { Id: string }[]) =>
  Array.from({ length: 20 }, () => ({
    DevEUI: faker.string.uuid(),
    AppEUI: faker.string.uuid(),
    IdCapteurType: faker.helpers.arrayElement(capteurTypes).Id,
    Description: faker.lorem.sentence(),
    Commentaire: faker.lorem.sentence(),
    Name: faker.commerce.productName(),
    LowBattery: faker.datatype.boolean(),
  }));

export const siteHasCapteurs = (
  capteurs: { DevEUI: string }[],
  sites: { Id: string }[]
) => {
  const uniquePairs = new Set<string>();
  const data: { IdSite: string; DevEUI: string; Commentaire: string }[] = [];

  while (data.length < 30) {
    const IdSite = faker.helpers.arrayElement(sites).Id;
    const DevEUI = faker.helpers.arrayElement(capteurs).DevEUI;
    const pair = `${IdSite}-${DevEUI}`;

    if (!uniquePairs.has(pair)) {
      uniquePairs.add(pair);
      data.push({
        IdSite,
        DevEUI,
        Commentaire: faker.lorem.sentence(),
      });
    }
  }

  return data;
};

export const releverCapteurs = (capteurs: { DevEUI: string }[]) =>
  Array.from({ length: 50 }, () => ({
    Time: faker.date.recent().toISOString(),
    Id: faker.string.uuid(),
    ValueType: faker.helpers.arrayElement(['A', 'V', 'mA']),
    DevEUI: faker.helpers.arrayElement(capteurs).DevEUI,
    Value: faker.number.float({ min: 0, max: 100 }),
    ValueRaw: faker.number.float({ min: 0, max: 100 }),
    ValueTypeRaw: faker.helpers.arrayElement(['A', 'V', 'mA']),
  }));
