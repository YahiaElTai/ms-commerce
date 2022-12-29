import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import { ZodError, ZodIssue } from 'zod';

const GENERIC_ERROR_MESSAGE =
  'Something went wrong. If the issue persist, please contact our support team.';

const formatZodError = (err: ZodError) => {
  const errors = err.flatten((issue: ZodIssue) => ({
    message: issue.message,
    errorCode: issue.code,
    path: issue.path,
  })).fieldErrors;

  return Object.values(errors).flatMap((err) => err);
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

  console.error(err);
  return res.status(500).send([{ message: GENERIC_ERROR_MESSAGE }]);
};
