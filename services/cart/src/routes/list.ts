import express, { Request, Response } from 'express';
import { excludeCartIdFromLineItem, prisma } from '../prisma';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/carts', async (_req: Request, res: Response) => {
  const carts = await prisma.cart.findMany({
    select: excludeCartIdFromLineItem,
  });

  res.send(carts);
});

export { router as CartsRouter };
