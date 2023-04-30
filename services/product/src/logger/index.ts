/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createLogger, format, transports } from 'winston';

const logLevel = process.env['NODE_ENV'] === 'test' ? 'silent' : 'info';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({
        level,
        message,
        timestamp,
        projectKey,
        host,
        userId,
        correlationId,
      }) =>
        JSON.stringify({
          severity: level.toUpperCase(),
          textPayload: message,
          timestamp,
          labels: {
            projectKey,
            service: 'product',
            host,
            userId,
            correlationId,
          },
        })
    )
  ),
  transports: [new transports.Console()],
});

export default logger;
