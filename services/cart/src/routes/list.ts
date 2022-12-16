import express, { Request, Response } from 'express';
import { requireAuth } from '@ms-commerce/common';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/api/carts', requireAuth, async (req: Request, res: Response) => {
  const carts = await prisma.cart.findMany({
    include: { lineItems: true },
  });

  res.send(carts);
});

export { router as CartsRouter };
