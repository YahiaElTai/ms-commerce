import express, { Request, Response } from 'express';
import { BadRequestError } from '@ms-commerce/common';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/api/carts/:id', async (req: Request, res: Response) => {
  const cart = await prisma.cart.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { lineItems: true },
  });

  console.log(cart);

  if (!cart) {
    throw new BadRequestError('Cart with given ID could not be found');
  }

  res.send(cart);
});

export { router as SingleCartRouter };
