import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z.string().transform((id) => parseInt(id)),
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
  sortBy: z.enum(['customerEmail', 'lineItemCount']).default('customerEmail'),
  sortDirection: z.enum(['asc', 'desc']).default('asc').default('asc'),
});
