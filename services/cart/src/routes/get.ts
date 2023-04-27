import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { computeCartFields } from '../model';
import { prisma } from '../prisma';
import { CartSchema } from '../validators';
import { IdParamSchema } from '../validators/params-validators';

const router = express.Router();

router.get(
  '/api/:projectKey/carts/:id([0-9a-fA-F]{24})',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { id } = IdParamSchema.parse(req.params);

    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        lineItems: {
          include: {
            price: true,
            variant: {
              include: {
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundError(`Cart with ID '${id}' could not be found`);
    }

    const validatedCart = CartSchema.parse(cart);

    const computedCart = computeCartFields(validatedCart);

    res.send(computedCart);
  }
);

export { router as GetCartRouter };
