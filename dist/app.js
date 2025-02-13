import { app } from './lib/express.js';
import router from './routes/index.js';
import { apiReference } from '@scalar/express-api-reference';
import OpenApiSpecification from './docs/scalar.docs.js';
app.use('/docs', apiReference({ spec: { content: OpenApiSpecification } }));
app.use('/api', router);
export { app };
