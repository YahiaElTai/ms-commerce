/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createLogger, format, transports } from 'winston';

const logLevel = process.env['NODE_ENV'] === 'test' ? 'silent' : 'info';

const applicationLogger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, ...args }) =>
      JSON.stringify({
        severity: level.toUpperCase(),
        message,
        ...args,
        service: 'cart',
      })
    )
  ),
  transports: [new transports.Console()],
});

export default applicationLogger;
