import fs from 'fs';
import path from 'path';

const httpsPort = parseInt(process.env.PORT || '3443', 10);
const packageJsonPath = path.resolve('.', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const url = process.env.URL || 'http://localhost';
const productionUrl = process.env.PRODUCTION_URL || 'https://api.example.com';
const logLevel = process.env.LOG_LEVEL || 'info';
const logFileEnabled = process.env.LOG_TO_FILE === 'true';
const keepLogsInProd = process.env.KEEP_LOGS_IN_PROD === 'true';
const logDirectory = process.env.LOG_DIRECTORY || './logs';
const dateFormat = process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss';
const storageDateFormat = process.env.STORAGE_DATE_PATTERNS || 'YYYY-MM';
const unixFormat = process.env.UNIX_FORMAT === 'true';
const nodeEnv = process.env.NODE_ENV || 'development';
const keepLogsFor = process.env.KEEP_LOGS_FOR || '90d';
const docEnable = process.env.DOC_ENABLE === 'true';

export { httpsPort, url, packageJson, productionUrl, logLevel, logFileEnabled, keepLogsInProd, logDirectory, dateFormat, storageDateFormat, unixFormat, nodeEnv, keepLogsFor, docEnable };