import { faker } from '@faker-js/faker';

// Helper function to generate mock SiteHasCapteur data
export const generateMockSiteHasCapteur = () => ({
  IdSite: faker.string.uuid(),
  Commentaire: faker.lorem.sentence(),
  CreatedAt: faker.date.past(),
  UpdatedAt: faker.date.recent(),
  DevEUI: faker.string.uuid(),
  Site: {
    Id: faker.string.uuid(),
    Name: faker.lorem.word(),
    CreatedAt: faker.date.past(),
    UpdatedAt: faker.date.recent(),
  },
  Capteur: {
    DevEUI: faker.string.uuid(),
    AppEUI: faker.string.uuid(),
    IdCapteurType: faker.string.uuid(),
    Description: faker.lorem.sentence(),
    Name: faker.lorem.word(),
    Commentaire: faker.lorem.sentence(),
    CreatedAt: faker.date.past(),
    UpdatedAt: faker.date.recent(),
  },
});

// Helper function to generate mock Capteur data
export const generateMockCapteur = () => ({
  DevEUI: faker.string.uuid(),
  AppEUI: faker.string.uuid(),
  IdCapteurType: faker.string.uuid(),
  Description: faker.lorem.sentence(),
  Commentaire: faker.lorem.sentence(),
  Name: faker.lorem.word(),
  LowBattery: faker.datatype.boolean(),
  CreatedAt: faker.date.past(),
  UpdatedAt: faker.date.recent(),
  SiteHasCapteurs: [
    {
      Site: {
        Name: faker.lorem.word(),
      },
    },
  ],
  RelevesCapteur: [
    {
      Id: faker.string.uuid(),
      Value: faker.number.float(),
      Time: faker.date.past(),
      ValueType: faker.lorem.word(),
      ValueRaw: faker.number.float(),
      ValueTypeRaw: faker.lorem.word(),
    },
  ],
});

  // Helper function to generate mock Site data
  export const generateMockSite = () => ({
    Id: faker.string.uuid(),
    Name: faker.lorem.word(),
    CreatedAt: faker.date.past(),
    UpdatedAt: faker.date.recent(),
    SiteHasCapteurs: [
      {
        Capteur: {
          DevEUI: faker.string.uuid(),
          CapteurType: {
            Type: faker.lorem.word(),
            ModelName: faker.lorem.word(),
          },
          RelevesCapteur: [
            {
              Id: faker.string.uuid(),
            },
          ],
        },
      },
    ],
  });

  
    // Helper function to generate mock ReleverCapteur data
    export const generateMockReleverCapteur = () => ({
      Id: faker.string.uuid(),
      DevEUI: faker.string.uuid(),
      Value: faker.number.float(),
      ValueRaw: faker.number.float(),
      ValueType: faker.lorem.word(),
      ValueTypeRaw: faker.lorem.word(),
      Time: faker.date.past(),
      CreatedAt: faker.date.past(),
      UpdatedAt: faker.date.recent(),
      Capteur: {
        DevEUI: faker.string.uuid(),
        CapteurName: faker.lorem.word(),
        CapteurType: {
          Type: faker.lorem.word(),
          ModelName: faker.lorem.word(),
        },
      },
    });

      // Helper function to generate mock CapteurType data
      export const generateMockCapteurType = () => ({
        Id: faker.string.uuid(),
        Name: faker.lorem.word(),
        Type: faker.lorem.word(),
        ModelName: faker.lorem.word(),
        Module: faker.lorem.word(),
        CreatedAt: faker.date.past(),
        UpdatedAt: faker.date.recent(),
        Capteurs: [
          {
            DevEUI: faker.string.uuid(),
          },
        ],
      });
