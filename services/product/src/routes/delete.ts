import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { prisma } from '../prisma';
import { IdParamSchema } from '../validators';
import { TOPICS, produceMessage } from '../kafka/producer';

const router = express.Router();

router.delete(
  '/api/:projectKey/products/:id([0-9a-fA-F]{24})',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { id } = IdParamSchema.parse(req.params);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' could not be found`);
    }

    await prisma.product.delete({ where: { id } });

    await produceMessage(TOPICS.productDeleted, id);

    res.send([
      { message: `Product with ID '${id}' was successfully deleted.` },
    ]);
  }
);

export { router as DeleteProductRouter };
