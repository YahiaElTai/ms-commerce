import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@ms-commerce/common';
import { prisma } from '../prisma';

const router = express.Router();

router.post(
  '/api/carts',
  [
    body('customerEmail').isEmail(),
    body('lineItems')
      .isArray({ min: 1 })
      .withMessage('You must add at least one line item to the cart'),
    body('shippingMethodId').notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { customerEmail, lineItems, shippingMethodId } = req.body;

    const cart = await prisma.cart.create({
      data: {
        customerEmail,
        lineItems: {
          createMany: {
            data: lineItems,
          },
        },
        shippingMethodId,
      },
      include: {
        lineItems: true,
      },
    });

    // const messageId = await pubSubClient.publishMessage(
    //   Topics.CART_CREATED,
    //   cart
    // );

    res.status(201).send({ cart });
  }
);

export { router as CreateCartRouter };
