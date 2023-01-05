import express, { Request, Response } from 'express';
import { computeProductFields } from '../model';
import { excludeIdsFromProduct, prisma } from '../prisma';
import { ProductDraftSchema, ProductSchema } from '../validators';

const router = express.Router();

router.post(
  '/api/products',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { description, name, productKey, variants } =
      ProductDraftSchema.parse(req.body);

    // create all variants
    for (const variant of variants) {
      await prisma.variant.create({
        data: {
          sku: variant.sku,
          price: {
            create: variant.price,
          },
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        productKey,
        description,
        variants: {
          connect: variants.map((variant) => ({ sku: variant.sku })),
        },
      },
      select: excludeIdsFromProduct,
    });

    const validatedProduct = ProductSchema.parse(product);

    const computedProduct = computeProductFields(validatedProduct);

    res.status(201).send(computedProduct);
  }
);

export { router as CreateProductRouter };
