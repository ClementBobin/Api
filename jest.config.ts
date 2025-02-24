module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
    '^.+\\.jsx?$': 'babel-jest', // Use babel-jest for JavaScript files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@scalar/express-api-reference).+\\.js$', // Ensure @scalar is transformed
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat TypeScript files as ESM
  globals: {
    'ts-jest': {
      useBabelrc: true,
    },
  },
  preset: 'ts-jest/presets/default-esm', // Add this for ESM support in TypeScript
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Handle .js extension in imports
  },
};
