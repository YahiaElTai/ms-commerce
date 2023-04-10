import type { NextFunction, Request, Response } from 'express';
import type { FormattedErrors } from '../validators';

import { CustomError } from '../errors';
import { ZodError, ZodIssue } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const GENERIC_ERROR_MESSAGE =
  'Something went wrong. If the issue persist, please contact our support team.';

const formatZodError = (err: ZodError): (FormattedErrors | undefined)[] => {
  const errors = err.flatten((issue: ZodIssue) => ({
    message: issue.message,
    errorCode: issue.code,
    path: issue.path,
  }));

  return Object.values(errors.fieldErrors)
    .flatMap((err) => err)
    .concat(errors.formErrors);
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).send(formatZodError(err));
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send([{ message: err.message }]);
  }

  // This logic can be refactored to account for other relevant error codes from Prisma
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(400).send([
      {
        message:
          'Variant with the given SKU already exists. SKUs must be unique across all products within a project.',
      },
    ]);
  }

  console.error(err);
  return res.status(500).send([{ message: GENERIC_ERROR_MESSAGE }]);
};
