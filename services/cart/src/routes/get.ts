import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { computeCartFields } from '../model';
import { excludeCartIdFromLineItem, prisma } from '../prisma';
import { IdParamSchema } from '../validators/params-validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/carts/:id', async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);

  const cart = await prisma.cart.findUnique({
    where: { id },
    select: excludeCartIdFromLineItem,
  });

  if (!cart) {
    throw new NotFoundError(`Cart with ID '${id}' could not be found`);
  }

  const computedCart = await computeCartFields(cart);

  res.send(computedCart);
});

export { router as GetCartRouter };
