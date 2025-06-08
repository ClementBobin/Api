import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const httpsPort = parseInt(process.env.PORT || '3443', 10);
const packageJsonPath = path.resolve('.', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const productionDomain = process.env.PRODUCTION_DOMAIN || 'api.example.com';
const logLevel = process.env.LOG_LEVEL || 'info';
const logFileEnabled = process.env.LOG_TO_FILE === 'true';
const keepLogsInProd = process.env.KEEP_LOGS_IN_PROD === 'true';
const logDirectory = process.env.LOG_DIRECTORY || './logs';
const dateFormat = process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss';
const unixFormat = process.env.UNIX_FORMAT === 'true';
const nodeEnv = process.env.NODE_ENV || 'development';
const keepLogsFor = process.env.KEEP_LOGS_FOR || '90d';
const docEnable = process.env.DOC_ENABLE === 'true';

export { httpsPort, packageJson, productionDomain, logLevel, logFileEnabled, keepLogsInProd, logDirectory, dateFormat, unixFormat, nodeEnv, keepLogsFor, docEnable };