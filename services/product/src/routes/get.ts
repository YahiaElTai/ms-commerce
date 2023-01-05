import express, { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import { computeProductFields } from '../model';
import { excludeIdsFromProduct, prisma } from '../prisma';
import { IdParamSchema, ProductSchema } from '../validators';

const router = express.Router();

// As of Express@5 This syntax is supported however the types are not updated yet
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/products/:id', async (req: Request, res: Response) => {
  const { id } = IdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({
    where: { id },
    select: excludeIdsFromProduct,
  });

  if (!product) {
    throw new NotFoundError(`Product with ID '${id}' could not be found`);
  }

  const validatedProduct = ProductSchema.parse(product);

  const computedProduct = computeProductFields(validatedProduct);

  res.send(computedProduct);
});

export { router as GetProductRouter };
