import { z } from 'zod';

export const UserSchema = z.object({
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
