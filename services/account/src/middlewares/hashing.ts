import type { Prisma } from '@prisma/client';
import type { z } from 'zod';
import { PasswordHashing } from '../utils';
import { UserDraftSchema } from '../validators';

export type TUser = z.infer<typeof UserDraftSchema>;

interface IMiddlewareParams extends Prisma.MiddlewareParams {
  args: {
    data: {
      password?: string;
    };
  };
}

export const hashingMiddlware: Prisma.Middleware<TUser> = async (
  params: IMiddlewareParams,
  next
) => {
  if (
    params.action === 'create' &&
    params.model === 'User' &&
    params.args.data.password
  ) {
    const hashed = await PasswordHashing.toHash(params.args.data.password);

    params.args.data.password = hashed;
  }

  const result = await next(params);

  return result;
};
