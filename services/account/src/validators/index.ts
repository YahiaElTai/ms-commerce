import { z } from 'zod';

// user validators
export const UserDraftSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20),
  firstName: z.string().default(''),
  lastName: z.string().default(''),
});

export const UserSchema = z.object({
  id: z.number(),
  version: z.number().int(),
  email: z.string().email(),
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  projects: z.array(z.string()).default([]),
});

export const PayloadSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});

export const CookiesSchema = z.object({
  access_token: z.string(),
});

export const Actions = z.enum(['addProject', 'removeProject']);

export const ActionSchema = z.object({
  type: Actions,
  value: z.object({
    key: z.string().nonempty(),
  }),
});

export const UserDraftUpdateSchema = z.object({
  version: z.number().int(),
  action: ActionSchema,
});

// project validators
export const IdParamSchema = z.object({
  id: z.string().transform((id) => parseInt(id)),
});

export const ProjectDraftSchema = z.object({
  key: z.string().nonempty(),
});

export const ProjectSchema = z.object({
  id: z.number(),
  key: z.string().nonempty(),
});

export const ParseQueryParamsSchema = z.object({
  limit: z
    .string()
    .transform((limit) => parseInt(limit))
    .default('20'),
  offset: z
    .string()
    .transform((offset) => parseInt(offset))
    .default('0'),
});

export const QueryParamsSchema = z.object({
  limit: z.number().min(1).max(500).int().default(20),
  offset: z.number().min(0).max(10000).int().default(0),
  sortBy: z.enum(['key']).default('key'),
  sortDirection: z.enum(['asc', 'desc']).default('asc').default('asc'),
});
