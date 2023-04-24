import type { z } from 'zod';
import { ProductSchema, ProductResponseSchema } from '../validators';

type TProduct = z.infer<typeof ProductSchema>;
type TProductResponse = z.infer<typeof ProductResponseSchema>;

export const computeProductFields = (product: TProduct): TProductResponse => ({
  ...product,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});
