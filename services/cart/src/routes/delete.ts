import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { prisma } from '../prisma';
import { IdParamSchema } from '../validators/params-validators';

const router = express.Router();

router.delete(
  '/api/:projectKey/carts/:id([0-9a-fA-F]{24})',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { id } = IdParamSchema.parse(req.params);

    const cart = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundError(`Cart with ID '${id}' could not be found`);
    }

    await prisma.cart.delete({ where: { id } });

    res.send([{ message: `Cart with ID '${id}' was successfully deleted.` }]);
  }
);

export { router as DeleteCartRouter };
