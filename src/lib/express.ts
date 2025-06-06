import express, { Request, Response, NextFunction } from 'express'; // Importing express and necessary types
import rateLimit from 'express-rate-limit'; // Importing express-rate-limit for rate limiting
import helmet from 'helmet'; // Importing helmet for security
import { Logger } from 'winston'; // Importing Logger type from winston
import logger from './docs/logger'; // Importing custom logger
import dotenv from 'dotenv'; // Importing dotenv to load environment variables
import registry from './docs/openAPIRegistry'; // Importing OpenAPI registry
import { ResponseWithHealthCheck, HealthCheck } from './docs/server.schema'; // Importing Zod schemas for validation
import fs from 'fs'; // Importing fs for file system operations
import path from 'path'; // Importing path for path operations
import http from 'http'; // Importing http module

// Load environment variables from .env file
dotenv.config();

const httpsPort = process.env.PORT || 3443; // Setting the HTTPS port from environment variable or default to 3443
// Read package.json to get the version
const packageJsonPath = path.resolve('.', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const appVersion = packageJson.version;
const appName = packageJson.name;

// Extend Express.Application to include the `logger` property
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Application {
      logger: Logger; // Logger will be globally available so you can access by app.logger
    }
    interface Response {
      json: () => Response // Override json method to include custom response formatting
    }
  }
}

const app = express(); // Creating an Express application

// Security middleware to set HTTP headers for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ['\'self\'', 'https://cdn.jsdelivr.net'], // Allow scripts from self and jsdelivr
      },
    },
  })
);

// Rate limiting middleware to protect against DDoS and brute force attacks
const limiter = rateLimit({
  windowMs: (Number(process.env.REMEMBER_IP_MINUTES) || 15) * 60 * 1000, // n minutes window for rate limiting requests per IP
  max: Number(process.env.NUMBER_REQUEST_PER_IP) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    isSuccess: false,
    message: 'Too many requests, please try again later.'
  }
});

app.use(limiter); // Apply the rate limiting middleware

// Custom middleware to remove unwanted headers and add required headers
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.removeHeader('X-Powered-By'); // Remove X-Powered-By header
  res.removeHeader('Server'); // Remove Server header

  // Add custom headers
  res.setHeader('apiName', appName);
  res.setHeader('apiVersion', appVersion);

  next();
});

// Use express.json() middleware to parse JSON bodies
app.use(express.json());

// Error Handling Middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  app.logger.logWithErrorHandling(error.message, error); // Log the error
  res.status(500).json({ isSuccess: false, message: 'Internal server error', error: error.message }); // Send error response
};

app.use(errorHandler); // Use the error handling middleware

// Middleware to log request start and end and format the response
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime(); // Store start time in res.locals for later use

  const requestId = app.logger.routeStart(req); // Log request start and capture the request ID

  // Override the default res.json method
  const originalJson = res.json.bind(res);

  res.json = function (this: Response, payload: any): Response {
    const end = process.hrtime(); // Calculate the duration
    const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

    // Extract custom response properties from payload
    const { isSuccess = true, message = 'Success', error, override = false, ...data } = payload;

    let responsePayload;

    // Check if payload is an array or a single object
    if (Array.isArray(payload)) {
      // If it's an array, wrap it in Results
      payload = { Results: payload };
    } else if (typeof payload === 'object' && payload !== null) {
      // If it's a single object, wrap it in Result
      payload = { Result: payload };
    }

    if (override) {
      responsePayload = data; // If override is true, return the response as-is
    } else if (isSuccess) {
      responsePayload = {
        ...payload,
        GenerationTime_ms: durationInMs,
        Success: true,
        Message: message,
      };
    } else {
      responsePayload = {
        Success: false,
        Message: message,
        Error: error,
        GenerationTime_ms: durationInMs,
      };
    }

    return originalJson(responsePayload); // Send the formatted response
  };

  // Log when the response finishes
  res.on('finish', () => {
    const end = process.hrtime(); // Calculate the duration
    const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;
    app.logger.routeEnd(req, res, requestId, durationInMs); // Log the request end
  });

  next(); // Proceed to the next middleware
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  app.logger.info('Health check endpoint called'); // Log the health check call

  const result = {
    Status: 'OK',
    Uptime: `${process.uptime()} seconds`,
    Message: 'Server is running',
    Timestamp: new Date().toISOString(),
    Version: appVersion,
    Unix: new Date().getTime()
  };

  const ValidateHealthCheck = HealthCheck.strict().safeParse(result); // Validate the health check response
  if (!ValidateHealthCheck.success) {
    app.logger.logWithErrorHandling('Invalid health check response:', ValidateHealthCheck.error, false, 'warn'); // Log validation error
    res.status(500).json({ isSuccess: false, message: 'Internal server error', error: ValidateHealthCheck.error }); // Send error response
    return;
  }

  res.status(200).json(result); // Send the health check response
});

// Register OpenAPI paths
registry.registerPath({
  method: 'get',
  path: '/health',
  summary: 'Health check endpoint',
  tags: ['Server'],
  responses: {
    200: {
      description: 'Server is running',
      content: {
        'application/json': {
          schema: ResponseWithHealthCheck,
        },
      },
    },
    500: {
      description: 'Internal server error',
    },
  },
});

// Attach logger to app
app.logger = logger;

let server: http.Server | null = null;

const startServer = (port?: number) => {
  const actualPort = port || httpsPort;
  if (server) {
    app.logger.warn('Server is already running');
    return server;
  }
  
  server = app.listen(actualPort, () => {
    app.logger.info(`Server is running on port ${actualPort}`);
  });
  
  return server;
};

const closeServer = () => {
  return new Promise<void>((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          app.logger.error('Error closing server:', err);
          reject(err);
        } else {
          app.logger.info('Server closed successfully');
          server = null;
          resolve();
        }
      });
    } else {
      app.logger.warn('Server instance not available, skipping close operation');
      resolve();
    }
  });
};

// Only start server automatically if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}


export { app, startServer, closeServer }; // Export the app
