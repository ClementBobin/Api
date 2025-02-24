import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import DailyRotateFile from 'winston-daily-rotate-file';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set up custom log levels and colors
const customColors = {
  trace: 'white',
  debug: 'green',
  info: 'green',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
};

// Create a logger instance
const logger = winston.createLogger({
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    crit: 1,
    fatal: 0
  },
});

if (process.env.LOG_TO_CONSOLE === 'true') {
  logger.add(new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info', // Set default log level
    format: winston.format.combine(
      winston.format.colorize(), // Add colorization
      winston.format.timestamp({ format: process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp in specified format
      winston.format.printf(({ timestamp, level, message }) => {
        const unixTime = process.env.UNIX_FORMAT === 'true' ? ` ${Math.floor(new Date(timestamp as string).getTime() / 1000)}` : '';
        return `[${timestamp}${unixTime}] ${level}: ${message}`;
      }),
    ),
  }));
}

// Add a conditionally added DailyRotateFile transport
if (process.env.LOG_TO_FILE === 'true' && !(process.env.ENVIRONMENT == "production" && process.env.KEEP_LOGS_IN_PROD == 'false')) {
  logger.add(new DailyRotateFile({
    level: 'info', // Set log level
    dirname: process.env.LOG_DIRECTORY || './logs', // Directory from .env
    filename: '%DATE%.log', // Filename pattern: LOG-YYYY-MM-DD.log
    datePattern: process.env.DATE_PATTERNS || 'YYYY-MM', // Rotate log files daily
    zippedArchive: true, // Compress old logs (e.g., .gz)
    maxFiles: `${process.env.KEEP_LOGS_FOR || '90d'}`, // Retain logs for the last 90 days
    format: winston.format.combine(
      winston.format.timestamp({ format: process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        const unixTime = process.env.UNIX_FORMAT === 'true' ? ` ${Math.floor(new Date(timestamp as string).getTime() / 1000)}` : '';
        return `[${timestamp}${unixTime}] ${level}: ${message}`;
      })
    ),
  }));
}

// Add custom colors to winston
winston.addColors(customColors);

// Extend the Logger interface to include routeStart and routeEnd
declare module 'winston' {
  interface Logger {
    logger: Logger;
    logWithErrorHandling(level: string, msg: any): void;
    routeStart(req: any): string; // Returns the request ID
    routeEnd(req: any, res: any, id: string, durationInMs: number): void;
    trackOperationTime<T>(operation: Promise<T>, operationName: string): Promise<T>;
  }
}

// Implement routeStart and routeEnd methods
logger.routeStart = function (req: any): string {
  const requestId = uuidv4(); // Generate a unique ID for the request
  req.requestId = requestId; // Attach requestId to the request object

  // Log request start with headers and method
  logger.info(`${req.protocol.toUpperCase()}/${req.httpVersion} ${req.method} ${req.originalUrl} - Request ID: ${requestId} with headers: ${JSON.stringify(req.headers)}`);

  return requestId; // Return request ID for later use in routeEnd
};

logger.routeEnd = function (req: any, res: any, id: string, durationInMs: number): void {
  const statusCode = res.statusCode; // Get the status code
  const headers = res.getHeaders(); // Get the response headers

  // Log request end with status code, request ID, duration, and response headers
  logger.info(`${req.protocol.toUpperCase()}/${req.httpVersion} ${req.method} ${req.originalUrl} - Request ID: ${id} - Status: ${statusCode}, DurationTotal: ${durationInMs}ms, Response Headers: ${JSON.stringify(headers)}`);
};

// Custom method to handle errors properly
logger.logWithErrorHandling = function(level: string, msg: any) {
  if (msg instanceof Error) {
    // If the message is an error, log the stack trace
    this.log(level, msg.stack);
  } else {
    // If it's not an error, log the message normally
    this.log(level, msg);
  }
};

logger.trackOperationTime = async function<T>(operation: Promise<T>, operationName: string): Promise<T> {
  const start = process.hrtime();

  // Get the stack trace to extract file and function name
  const stack = new Error().stack || '';
  const stackLines = stack.split('\n');
  const callerLine = stackLines[2]; // The 2nd line of the stack trace is where the function was called from

  // Extract file and function name from the stack trace line
  const match = callerLine.match(/at\s+([^(]+)\s+\(([^:]+):(\d+):(\d+)\)/);
  const functionName = match ? match[1] : 'unknownFunction';
  const fileName = match ? match[2] : 'unknownFile';

  const result = await operation;
  const end = process.hrtime();
  const durationInMs = (end[0] * 1e9 + end[1] - (start[0] * 1e9 + start[1])) / 1e6;

  // Log the operation with the file and function name
  logger.info(`${operationName} took ${durationInMs}ms, called from ${functionName} in ${fileName}`);

  return result;
};

export default logger;
