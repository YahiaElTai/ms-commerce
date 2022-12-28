import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { CartSchema } from '../validators';

const router = express.Router();

router.post(
  '/api/carts',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { customerEmail, lineItems, shippingMethodId } = CartSchema.parse(
      req.body
    );

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

    res.status(201).send({ cart });
  }
);

export { router as CreateCartRouter };
