import winston from 'winston';
import path from 'path';
import fs from 'fs';

// check out logs file
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
};

// wiston logger configuration
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      const { timestamp, level, url, method } = info;
      return `[${timestamp}] ${level.toUpperCase()}: ${method || ''} ${url || ''}`.trim();
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'gateway.log') }),
    new winston.transports.Console()
  ],
});

