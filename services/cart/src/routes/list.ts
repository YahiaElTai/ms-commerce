import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/api/carts', async (req: Request, res: Response) => {
  const carts = await prisma.cart.findMany({
    include: { lineItems: true },
  });

  res.send(carts);
});

export { router as CartsRouter };
