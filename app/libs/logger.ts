import {
  createLogger,
  format,
  transports,
} from 'winston';
import type { Logger, LoggerOptions } from 'winston';
import { getLogLevel } from '../configs';

const options: LoggerOptions = {
  level: getLogLevel() || 'info',
  defaultMeta: {
    service: 'gugukun-bot',
  },
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({
      filename: 'logs/app.log',
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
};

export const logger: Logger = createLogger(options);
