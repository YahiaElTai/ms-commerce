import express, { Request, Response } from 'express';
import { excludeIdsFromProduct, prisma } from '../../prisma';
import { ProductDraftSchema } from '../../validators/product-validators';

const router = express.Router();

router.post(
  '/api/products',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { variants, name, productKey, description } =
      ProductDraftSchema.parse(req.body);

    const variant = await prisma.variant.create({
      data: {
        sku: variants[0].sku,
        price: {
          create: variants[0].price,
        },
      },
    });

    const product = await prisma.product.create({
      data: {
        name,
        productKey,
        description,
        variants: {
          connect: { id: variant.id },
        },
      },
      select: excludeIdsFromProduct,
    });

    res.status(201).send(product);
  }
);

export { router as CreateProductRouter };
