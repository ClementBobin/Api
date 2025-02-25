export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true, // Enable ESM mode
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!@scalar/express-api-reference)', // Allow this package to be transformed
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/lib/singleton.ts'],
  clearMocks: true,
};
