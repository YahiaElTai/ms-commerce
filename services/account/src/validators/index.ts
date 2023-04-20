import { z } from 'zod';

export const UserDraftSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20),
  firstName: z.string().default(''),
  lastName: z.string().default(''),
});

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().default(''),
  lastName: z.string().default(''),
});

export const CookiesSchema = z.object({
  access_token: z.string(),
});
