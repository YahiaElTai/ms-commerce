import type { ZodIssueCode } from 'zod';

export type TFormattedErrors = {
  message: string;
  errorCode: ZodIssueCode;
  path: (string | number)[];
};
