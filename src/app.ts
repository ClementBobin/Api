import { app } from './lib/express';

// Importing routes
import serverRoutes from './modules/server/server.routes';

import userRoutes from './modules/user/user.routes';

// API routes
app.use('/api', serverRoutes);

// Mount the API routes
app.use('/api/users', userRoutes);