import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

const buildCorrelationId = (userId?: string, projectKey?: string) => {
  if (!userId || !projectKey) {
    return '';
  }
  return `product/${projectKey}/${userId}/${uuidv4()}`;
};

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = new Date().getTime();

  res.on('finish', () => {
    const elapsedTime = new Date().getTime() - startTime;
    const { statusCode } = res;
    const { method, headers, originalUrl, params } = req;

    const projectKey = params['projectKey'];
    const host = headers['host'];
    const userId = headers['userid'] as string;

    const correlationId = buildCorrelationId(userId, projectKey);

    logger.info(`${method} ${originalUrl} ${statusCode} ${elapsedTime}ms`, {
      projectKey,
      host,
      userId,
      correlationId,
    });
  });

  next();
};
