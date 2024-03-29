import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestLogger } from '../loggers';

const buildCorrelationId = (userId?: string, projectKey?: string) => {
  if (!userId || !projectKey) {
    return uuidv4();
  }

  return `account/${projectKey}/${userId}/${uuidv4()}`;
};

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = new Date().getTime();

  res.on('finish', () => {
    const elapsedTime = new Date().getTime() - startTime;
    const { statusCode } = res;
    const { method, headers, originalUrl } = req;

    const host = headers['host'];
    const userId = headers['userid'] as string;
    const projectKey = headers['projectkey'] as string;

    const correlationId = buildCorrelationId(userId, projectKey);

    // don't log requests proxied to other service
    // logging is handled at the service itself
    if (!originalUrl.includes('products') && !originalUrl.includes('carts')) {
      requestLogger.info(
        `${method} ${originalUrl} ${statusCode} ${elapsedTime}ms`,
        {
          projectKey,
          host,
          userId,
          correlationId,
          method,
          statusCode,
          url: originalUrl,
        }
      );
    }
  });

  next();
};

export default requestLoggerMiddleware;
