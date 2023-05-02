import type { NextFunction, Request, Response } from 'express';
import type { TFormattedErrors } from '../validators';

import { CustomError } from '../errors';
import { ZodError, ZodIssue } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { applicationLogger } from '../loggers';

const GENERIC_ERROR_MESSAGE =
  'Something went wrong. If the issue persist, please contact our support team.';

const formatZodError = (err: ZodError): (TFormattedErrors | undefined)[] => {
  const errors = err.flatten((issue: ZodIssue) => ({
    message: issue.message,
    errorCode: issue.code,
    path: issue.path,
  }));

  return Object.values(errors.fieldErrors)
    .flatMap((err) => err)
    .concat(errors.formErrors);
};

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const { method, headers, originalUrl } = req;

  const originalHost = req.headers['x-forwarded-host'] || req.headers.host;
  const userId = headers['userid'] as string;
  const projectKey = headers['projectkey'] as string;

  if (err instanceof ZodError) {
    applicationLogger.error('Zod validation errors', {
      errorJsonString: err,
      method,
      originalUrl,
      host: originalHost,
      userId,
      projectKey,
    });

    return res.status(400).send(formatZodError(err));
  }

  if (err instanceof CustomError) {
    applicationLogger.error(err.message, {
      errorJsonString: err,
      method,
      originalUrl,
      host: originalHost,
      userId,
      projectKey,
    });

    return res.status(err.statusCode).send([{ message: err.message }]);
  }

  // This logic can be refactored to account for other relevant error codes from Prisma
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    const message =
      'Variant with the given SKU already exists. SKUs must be unique across all products within a project.';
    applicationLogger.error(message, {
      errorJsonString: err,
      method,
      originalUrl,
      host: originalHost,
      userId,
      projectKey,
    });

    return res.status(400).send([{ message }]);
  }

  applicationLogger.error(GENERIC_ERROR_MESSAGE, {
    errorJsonString: err,
    method,
    originalUrl,
    host: originalHost,
    userId,
    projectKey,
  });
  return res.status(500).send([{ message: GENERIC_ERROR_MESSAGE }]);
};

export default errorHandlerMiddleware;
