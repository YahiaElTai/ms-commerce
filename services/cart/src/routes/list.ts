import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/api/carts', async (req: Request, res: Response) => {
  const id = req.header('UserId');
  const email = req.header('UserEmail');

  const carts = await prisma.cart.findMany({
    include: { lineItems: true },
  });

  console.log({ id, email });
  res.send(carts);
});

export { router as CartsRouter };
