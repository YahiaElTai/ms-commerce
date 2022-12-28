import { Request } from 'express';
import { z } from 'zod';
import { UserSchema } from '../validators';

export interface IJwtRequest extends Request {
  cookies: {
    access_token?: string;
  };
}

export type User = z.infer<typeof UserSchema>;

export interface UserPayload {
  id: string;
  email: string;
}
