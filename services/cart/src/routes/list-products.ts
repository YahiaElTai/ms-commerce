import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import {
  ParseQueryParamsSchema,
  ProjectKeyParamSchema,
  QueryParamsSchema,
} from '../validators/params-validators';

const router = express.Router();

router.get(
  '/api/:projectKey/carts/products',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { projectKey } = ProjectKeyParamSchema.parse(req.params);
    // to ensure proper validations on `limit` and `offset`
    // first these should be parsed to integer with `parseInt()` with `ParseQueryParamsSchema`
    // and then passed to `QueryParamsSchema` for proper validation
    const parsedValues = ParseQueryParamsSchema.parse(req.query);

    const { limit, offset } = QueryParamsSchema.parse({
      ...req.query,
      ...parsedValues,
    });

    const products = await prisma.product.findMany({
      where: { projectKey },
    });

    res.send({
      offset,
      limit,
      count: products.length,
      results: products,
    });
  }
);

export { router as ListProductsRouter };
