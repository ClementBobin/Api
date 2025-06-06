import { app } from './lib/express';
import { apiReference } from '@scalar/express-api-reference';
import { docs } from './lib/docs/docOpenApi';

// Importing routes
import router from './modules/user/user.routes';

// Mount the API routes
app.use('/api', router);

// Swagger documentation route
app.use(
    '/docs',
    apiReference({ spec: { content: docs } }),
);