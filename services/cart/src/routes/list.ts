import express, { Request, Response } from 'express';
import { excludeCartIdFromLineItem, prisma } from '../prisma';
import {
  ParseQueryParamsSchema,
  QueryParamsSchema,
} from '../validators/params-validators';

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

  res.send({ offset, limit, count: carts.length, results: carts });
});

export { router as CartsRouter };
