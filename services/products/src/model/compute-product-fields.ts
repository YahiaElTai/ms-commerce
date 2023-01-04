import type { z } from 'zod';
import type { ProductSchema, ProductResponseSchema } from '../validators';

type Product = z.infer<typeof ProductSchema>;

type ProductResponse = z.infer<typeof ProductResponseSchema>;

export const computeProductFields = (product: Product): ProductResponse => ({
  ...product,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});
