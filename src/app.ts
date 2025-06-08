import { app } from './lib/fastify';

import userRoutes from './modules/user/user.routes';
import serverRoutes from './modules/server/server.routes';

// Register routes
app.register(userRoutes, { prefix: '/api/v1/users' });
app.register(serverRoutes);