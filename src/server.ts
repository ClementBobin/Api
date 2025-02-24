import { app } from '../lib/express';
import router from './modules/user/user.routes';
import logger from '../lib/logger'; // Import the logger from logger.js

// Add logger to app instance so it's available globally
app.logger = logger;

// Mount the API routes
app.use('/api', router);

// Export the app
export { app };
