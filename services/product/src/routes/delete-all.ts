import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/api/products', async (_req: Request, res: Response) => {
  const { count } = await prisma.product.deleteMany({});

  res.send([{ message: `${count} products have been deleted successfully` }]);
});

export { router as DeleteProductsRouter };
