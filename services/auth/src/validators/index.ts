import { z } from 'zod';

export const UserDraftSchema = z.object({
  password: z.string().min(5),
  email: z.string().email(),
});

export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email(),
});

export const CookiesSchema = z.object({
  access_token: z.string(),
});

export const BasicResponseSchema = z.array(z.object({ message: z.string() }));
