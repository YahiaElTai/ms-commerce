import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import { ZodError, ZodIssue } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { FormattedErrors } from '../validators';

const GENERIC_ERROR_MESSAGE =
  'Something went wrong. If the issue persist, please contact our support team.';

const formatZodError = (err: ZodError): FormattedErrors[] => {
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
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2017') {
    res
      .status(400)
      .send([
        { message: 'The Line item id provided does not exist on this cart.' },
      ]);
  }

  console.error(err);
  return res.status(500).send([{ message: GENERIC_ERROR_MESSAGE }]);
};
