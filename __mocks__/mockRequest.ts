// mockRequest.ts
import { faker } from '@faker-js/faker';

// Site-related requests
export const generateMockSiteRequest = () => ({
  Name: faker.company.name(),
});

// Capteur creation request
export const generateMockCapteurRequest = () => ({
  AppEUI: faker.string.uuid(),
  IdCapteurType: faker.string.uuid(),
  Description: faker.lorem.sentence(),
  Commentaire: faker.lorem.sentence(),
  Name: faker.commerce.productName(),
});

// SiteHasCapteur linking request
export const generateMockSiteHasCapteurRequest = () => ({
  IdSite: faker.string.uuid(),
  DevEUI: faker.string.uuid(),
  Commentaire: faker.lorem.sentence(),
});

// CapteurType creation request
export const generateMockCapteurTypeRequest = () => ({
  Name: faker.commerce.department(),
  Module: faker.commerce.productAdjective(),
  Type: faker.commerce.productMaterial(),
  ModelName: faker.commerce.productName(),
});

// ReleverCapteur creation request
export const generateMockReleverCapteurRequest = () => ({
  DevEUI: faker.string.uuid(),
  CapteurName: faker.commerce.productName(),
  Time: faker.date.recent().toISOString(),
  Value: faker.number.float({ min: 0, max: 100 }),
  ValueRaw: faker.number.float({ min: 0, max: 100 }),
  ValueType: faker.helpers.arrayElement(['A', 'V', 'mA']),
  ValueTypeRaw: faker.helpers.arrayElement(['A', 'V', 'mA']),
});

// Common query params request
export const generateMockQueryParams = () => ({
  IdSite: faker.string.uuid(),
  SiteName: faker.company.name(),
  CapteurName: faker.commerce.productName(),
  CapteurTypeName: faker.commerce.department(),
  Module: faker.commerce.productAdjective(),
  Type: faker.commerce.productMaterial(),
  Model: faker.commerce.productName(),
});

// ReleverCapteur filters (with time)
export const generateMockReleverCapteurQueryParams = () => ({
  ...generateMockQueryParams(),
  TimeStart: faker.date.past().toISOString(),
  TimeEnd: faker.date.recent().toISOString(),
});

// Helper function to generate mock data for SiteDTO
export const generateMockSiteDTO = () => ({
    Name: faker.lorem.word(),
  });
  
  // Helper function to generate mock data for SiteResponse
  export const generateMockSiteResponse = () => ({
    Id: faker.string.uuid(),
    Name: faker.lorem.word(),
    CreatedAt: faker.date.past(),
    UpdatedAt: faker.date.recent(),
    CapteurCount: faker.number.int({ min: 0, max: 100 }),
    DataCount: faker.number.int({ min: 0, max: 1000 }),
    DistinctCapteurTypes: [faker.lorem.word(), faker.lorem.word()],
    DistinctCapteurModels: [faker.lorem.word(), faker.lorem.word()],
  });
  
  // Helper function to generate mock data for SiteHasCapteurDTO
 export const generateMockSiteHasCapteurDTO = () => ({
    IdSite: faker.string.uuid(),
    DevEUI: faker.string.uuid(),
    Commentaire: faker.lorem.sentence(),
  });
  
  // Helper function to generate mock data for SiteHasCapteurResponse
 export const generateMockSiteHasCapteurResponse = () => ({
    IdSite: faker.string.uuid(),
    Commentaire: faker.lorem.sentence(),
    CreatedAt: faker.date.past(),
    UpdatedAt: faker.date.recent(),
    Capteurs: [
      {
        DevEUI: faker.string.uuid(),
        AppEUI: faker.string.uuid(),
        IdCapteurType: faker.string.uuid(),
        Description: faker.lorem.sentence(),
        Commentaire: faker.lorem.sentence(),
        Name: faker.lorem.word(),
      },
    ],
  });
  
// Helper function to generate mock data for CapteurDTO
export const generateMockCapteurDTO = () => ({
    DevEUI: faker.string.uuid(),
    AppEUI: faker.string.uuid(),
    IdCapteurType: faker.string.uuid(),
    Description: faker.lorem.sentence(),
    Commentaire: faker.lorem.sentence(),
    Name: faker.lorem.word(),
});

// Helper function to generate mock data for CapteurReponse
export const generateMockCapteurReponse = () => ({
    ...generateMockCapteurDTO(),
    ReleverCapteurs: [generateMockReleverCapteurDTOUpdate(), generateMockReleverCapteurDTOUpdate()],
    SiteHasCapteurs: [generateMockSiteDTO(), generateMockSiteDTO()],
});

// Helper function to generate mock data for CapteurTypeDTO
export const generateMockCapteurTypeDTO = () => ({
    Name: faker.lorem.word(),
    Type: faker.lorem.word(),
    ModelName: faker.lorem.word(),
    Module: faker.lorem.word(),
});

// Helper function to generate mock data for CapteurTypeResponse
export const generateMockCapteurTypeResponse = () => ({
    Id: faker.string.uuid(),
    Name: faker.lorem.word(),
    Type: faker.lorem.word(),
    ModelName: faker.lorem.word(),
    Module: faker.lorem.word(),
    CreatedAt: faker.date.past().toISOString(),
    UpdatedAt: faker.date.recent().toISOString(),
    Capteurs: [faker.string.uuid(), faker.string.uuid()],
});

// Helper function to generate mock data for CommonQueryParams
export const generateMockCommonQueryParams = () => ({
    IdSite: faker.string.uuid(),
    SiteName: faker.lorem.word(),
    CapteurName: faker.lorem.word(),
    CapteurTypeName: faker.lorem.word(),
    Module: faker.lorem.word(),
    Type: faker.lorem.word(),
    Model: faker.lorem.word(),
});

// Helper function to generate mock data for DeviceStatus
export const generateMockDeviceStatus = () => ({
    DeviceId: faker.string.uuid(),
    Status: 'alive',
    Timestamp: faker.date.recent().toISOString(),
});

// Helper function to generate mock data for DeviceDecoder
export const generateMockDeviceDecoder = () => ({
    DecoderType: faker.lorem.word(),
    DecoderConfig: { IntensityMax: faker.number.int({ min: 0, max: 100 }) },
});

// Helper function to generate mock data for DeviceContext
export const generateMockDeviceContext = () => ({
    Module: faker.lorem.word(),
    ProductType: faker.lorem.word(),
    SiteName: faker.lorem.word(),
    TypeName: faker.lorem.word(),
    DeviceName: faker.lorem.word(),
    Decoder: generateMockDeviceDecoder(),
});

// Helper function to generate mock data for DeviceData
export const generateMockDeviceData = () => ({
    DevEUI: faker.string.uuid(),
    AppEUI: faker.string.uuid(),
    Time: faker.date.recent().toISOString(),
    Value: faker.number.hex.toString(),
    Context: generateMockDeviceContext(),
});

// Helper function to generate mock data for ErrorLog
export const generateMockErrorLog = () => ({
    Message: faker.lorem.sentence(),
    Source: faker.lorem.word(),
    Details: faker.lorem.sentence(),
});

// Helper function to generate mock data for Log
export const generateMockLog = () => ({
    Id: faker.string.uuid(),
    Level: faker.helpers.arrayElement(['info', 'error', 'warning', 'critical']),
    AppEUI: faker.string.uuid(),
    DevEUI: faker.string.uuid(),
    Payload: generateMockDeviceData(),
    Error: generateMockErrorLog(),
});

// Helper function to generate mock data for ReleverCapteurDTOUpdate
export const generateMockReleverCapteurDTOUpdate = () => ({
    Time: faker.date.recent().toISOString(),
    Value: faker.number.float({ min: 0, max: 100 }),
    ValueType: faker.lorem.word(),
    ValueRaw: faker.number.float(),
    ValueTypeRaw: faker.lorem.word(),
});

// Helper function to generate mock data for ReleverCapteurDTOCreate
export const generateMockReleverCapteurDTOCreate = () => ({
    ...generateMockReleverCapteurDTOUpdate(),
    DevEUI: faker.string.uuid(),
    CapteurName: faker.lorem.word(),
});

// Helper function to generate mock data for ReleverCapteurResponse
export const generateMockReleverCapteurResponse = () => ({
    DevEUI: faker.string.uuid(),
    Data: [
        {
            ...generateMockReleverCapteurDTOUpdate(),
            Id: faker.string.uuid(),
        },
    ],
});

// Helper function to generate mock data for ReleverCapteursQueryParams
export const generateMockReleverCapteursQueryParams = () => ({
    ...generateMockCommonQueryParams(),
    TimeStart: faker.date.recent().toISOString(),
    TimeEnd: faker.date.recent().toISOString(),
});
