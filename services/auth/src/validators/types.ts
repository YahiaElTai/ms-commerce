import type { ZodIssueCode } from 'zod';

export type FormattedErrors =
  | {
      message: string;
      errorCode: ZodIssueCode;
      path: (string | number)[];
    }
  | undefined;
