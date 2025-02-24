import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { apiReference } from '@scalar/express-api-reference';
import swaggerJSDoc from 'swagger-jsdoc';
import { Logger } from 'winston';
import dotenv from 'dotenv';
import * as process from "node:process";

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

// Extend Express.Application to include the `logger` property
declare global {
  namespace Express {
    interface Application {
      logger: Logger; // Logger will be globally available
    }
    interface Response {
      json: (data: any) => this; // Ensure json returns the Response object itself
    }
  }
}

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:" + port,
        description: "Development server"
      },
      {
        url: "https://api.example.com",
        description: "Production server"
      }
    ],
  },
  apis: ["./src/modules/*/*.routes.ts", "./src/modules/*/*.routes.js"], // Path to the route files where docs are defined
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();
app.use(helmet());

// Use express.json() middleware
app.use(express.json());

// Middleware to log request start and end
app.use(async (req: Request, res: Response, next: NextFunction) => {
  // Store start time in res.locals for later use
  const start = process.hrtime();

  // Log request start and capture the request ID
  const requestId = app.logger.routeStart(req);

  // Override the default res.json method
  const originalJson = res.json.bind(res);

  res.json = function (this: Response, obj: any): Response {
    const end = process.hrtime();
    const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

    // Add the 'time' field to the response object
    return originalJson({
      ...obj,
      generationtime_ms: `${durationInMs}ms`, // Add the duration to the JSON response body
    });
  };

  // Log when the response finishes
  res.on('finish', () => {
    const end = process.hrtime();
    const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;
    // Ensure the duration is calculated and logged with request ID
    app.logger.routeEnd(req, res, requestId, durationInMs);
  });

  next();
});

// Swagger documentation route
app.use(
  '/docs',
  apiReference({ spec: { content: swaggerDocs } }),
);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Server start
app.listen(port, () => {
  app.logger.info(`Server is running on http://localhost:${port}`);
});

export { app };
