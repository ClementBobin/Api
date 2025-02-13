import { app } from './lib/express.ts';
import router from './routes/index.ts';
import { apiReference } from '@scalar/express-api-reference';
import OpenApiSpecification from './docs/scalar.docs.ts';

app.use(
  '/docs',
  apiReference({spec: {content: OpenApiSpecification,},}),
)

app.use('/api', router);

export { app };