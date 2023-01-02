import express, { Request, Response } from 'express';
import { excludeIdsFromProduct, prisma } from '../../prisma';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/products', async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    select: excludeIdsFromProduct,
  });

  res.send(products);
});

export { router as ProductsRouter };
