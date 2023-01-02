import express, { Request, Response } from 'express';
import { computeCartFields } from '../model';
import { excludeCartIdFromLineItem, prisma } from '../prisma';
import {
  ParseQueryParamsSchema,
  QueryParamsSchema,
} from '../validators/params-validators';
import { CartResponseSchema } from '../validators';
import type { z } from 'zod';

type CartResponseList = z.infer<typeof CartResponseSchema>;

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/carts', async (req: Request, res: Response) => {
  // to ensure proper validations on `limit` and `offset`
  // first these should be parsed to integer with `parseInt()` with `ParseQueryParamsSchema`
  // and then passed to `QueryParamsSchema` for proper validation
  const parsedValues = ParseQueryParamsSchema.parse(req.query);

  const { limit, offset, sortBy, sortDirection } = QueryParamsSchema.parse({
    ...req.query,
    ...parsedValues,
  });

  const orderBy =
    sortBy === 'lineItemCount'
      ? { lineItems: { _count: sortDirection } }
      : { [sortBy]: sortDirection };

  const carts = await prisma.cart.findMany({
    select: excludeCartIdFromLineItem,
    skip: offset,
    take: limit,
    orderBy,
  });

  const computedCarts: CartResponseList[] = [];

  for (const cart of carts) {
    const computedCart = await computeCartFields(cart);
    const validatedComputedCart = CartResponseSchema.parse(computedCart);

    computedCarts.push(validatedComputedCart);
  }

  res.send({
    offset,
    limit,
    count: computedCarts.length,
    results: computedCarts,
  });
});

export { router as CartsRouter };
