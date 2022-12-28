import { Prisma } from '@prisma/client';
import { Password } from '../utils';
import { User } from '../types';

interface IMiddlewareParams extends Prisma.MiddlewareParams {
  args: {
    data: {
      password?: string;
    };
  };
}

export const hashingMiddlware: Prisma.Middleware<User> = async (
  params: IMiddlewareParams,
  next
) => {
  if (
    params.action === 'create' &&
    params.model === 'User' &&
    params.args.data.password
  ) {
    const hashed = await Password.toHash(params.args.data.password);

    params.args.data.password = hashed;
  }

  const result = await next(params);

  return result;
};
