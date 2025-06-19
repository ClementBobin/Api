import { app } from './lib/express';

// Importing routes
import userRoutes from './modules/user/user.routes';
import serverRoutes from './modules/server/server.routes';

// Mount the API routes
app.use('/api', userRoutes);
app.use('/api', serverRoutes);