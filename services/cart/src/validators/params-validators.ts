import { z } from 'zod';

export const IdParamSchema = z.object({
  id: z
    .string({ required_error: 'Cart ID is not defined' })
    .transform((id) => parseInt(id)),
});
