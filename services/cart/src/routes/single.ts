import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth } from '@ms-commerce/common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
  '/api/carts/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      throw new BadRequestError('Cart with given ID could not be found');
    }

    res.send(cart);
  }
);

export { router as SingleCartRouter };
