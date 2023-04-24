import express, { Request, Response } from 'express';
import type { z } from 'zod';
import { computeProductFields } from '../model';
import { prisma } from '../prisma';
import {
  ParseQueryParamsSchema,
  QueryParamsSchema,
  ProductResponseSchema,
  ProductSchema,
  ProjectKeyParamSchema,
} from '../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/:projectKey/products', async (req: Request, res: Response) => {
  const { projectKey } = ProjectKeyParamSchema.parse(req.params);
  // to ensure proper validations on `limit` and `offset`
  // first these should be parsed to integer with `parseInt()` with `ParseQueryParamsSchema`
  // and then passed to `QueryParamsSchema` for proper validation
  const parsedValues = ParseQueryParamsSchema.parse(req.query);

  const { limit, offset, sortBy, sortDirection } = QueryParamsSchema.parse({
    ...req.query,
    ...parsedValues,
  });

  const orderBy =
    sortBy === 'variantsCount'
      ? { variants: { _count: sortDirection } }
      : { [sortBy]: sortDirection };

  const products = await prisma.product.findMany({
    include: {
      variants: {
        include: {
          price: true,
        },
      },
    },
    where: { projectKey },
    skip: offset,
    take: limit,
    orderBy,
  });

  type TProductResponse = z.infer<typeof ProductResponseSchema>;
  const computedProducts: TProductResponse[] = [];

  for (const product of products) {
    const validatedProduct = ProductSchema.parse(product);
    const computedProduct = computeProductFields(validatedProduct);

    const validatedComputedProduct =
      ProductResponseSchema.parse(computedProduct);

    computedProducts.push(validatedComputedProduct);
  }

  res.send({
    offset,
    limit,
    count: computedProducts.length,
    results: computedProducts,
  });
});

export { router as ListProductsRouter };
