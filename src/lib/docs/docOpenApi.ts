// Import the OpenAPI registry from the local file
import registry from './openAPIRegistry';

import dotenv from 'dotenv'; // Importing dotenv to load environment variables from a .env file

// Import the OpenApiGeneratorV3 class from the zod-to-openapi package
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

// Import the fs and path modules from Node.js
import fs from 'fs';
import path from 'path';

// Load environment variables from the .env file
dotenv.config();

// Function to generate the OpenAPI document
export const docs = () => {
    // Read package.json to get the version
    const packageJsonPath = path.resolve('.', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const appVersion = packageJson.version;

    // Create a new instance of OpenApiGeneratorV3 with the registry definitions
    const generator = new OpenApiGeneratorV3(registry.definitions);

    // Generate the OpenAPI document with the specified configuration
    const openApiDocument = generator.generateDocument({
        openapi: '3.0.0', // OpenAPI version
        info: {
            title: 'User API', // Title of the API
            version: appVersion, // Version of the API
            description: 'An API for managing user', // Description of the API
        },
        servers: [
            { url: `http://localhost:${process.env.PORT}`, description: 'Development server' }, // Development server URL
            { url: 'https://api.example.com', description: 'Production server' }, // Production server URL
        ],
    });

    // Return the generated OpenAPI document
    return openApiDocument;
};