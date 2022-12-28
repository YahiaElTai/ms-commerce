import { z } from 'zod';

export const UserDraftSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(5),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Not a valid email'),
});

export const UserSchema = z.object({
  id: z.union([
    z.string({
      required_error: 'User ID is required',
    }),
    z.number({ required_error: 'User ID is required' }),
  ]),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Not a valid email'),
});

export const CookiesSchema = z.object({
  access_token: z.string(),
});

export const BasicResponseSchema = z.array(z.object({ message: z.string() }));
