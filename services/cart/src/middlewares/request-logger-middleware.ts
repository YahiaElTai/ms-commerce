import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestLogger } from '../loggers';

const buildCorrelationId = (userId?: string, projectKey?: string) => {
  if (!userId || !projectKey) {
    return uuidv4();
  }
  return `cart/${projectKey}/${userId}/${uuidv4()}`;
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

    const originalHost = req.headers['x-forwarded-host'] || req.headers.host;
    const userId = headers['userid'] as string;
    const projectKey = headers['projectkey'] as string;

    const correlationId = buildCorrelationId(userId, projectKey);

    requestLogger.info(
      `${method} ${originalUrl} ${statusCode} ${elapsedTime}ms`,
      {
        projectKey,
        host: originalHost,
        userId,
        correlationId,
        method,
        statusCode,
        url: originalUrl,
      }
    );
  });

  next();
};

export default requestLoggerMiddleware;
