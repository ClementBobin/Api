import { app } from './lib/express';
import { apiReference } from '@scalar/express-api-reference';
import { docs } from './lib/docs/docOpenApi';
import dotenv from 'dotenv';

// Importing routes
import router from './modules/user/user.routes';

dotenv.config(); // Load environment variables from .env file

// Mount the API routes
app.use('/api', router);

if (process.env.DOC_ENABLE === 'true') {
    // Swagger documentation route
    app.use(
        '/docs',
        apiReference({ spec: { content: docs } }),
    );
}