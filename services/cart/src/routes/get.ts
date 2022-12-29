import express, { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import { prisma } from '../prisma';
import { IdParamSchema } from '../validators/params-validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/carts/:id', async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);

  const cart = await prisma.cart.findUnique({
    where: { id },
    include: { lineItems: true },
  });

  if (!cart) {
    throw new BadRequestError(`Cart with ID '${id}' could not be found`);
  }

  res.send(cart);
});

export { router as GetCartRouter };
