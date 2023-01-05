import express, { Request, Response } from 'express';
import { excludeIdsFromProduct, prisma } from '../../prisma';
import {
  ProductDraftSchema,
  VariantDraftSchema,
} from '../../validators/product-validators';

const router = express.Router();

router.post(
  '/api/cartsp/',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { variants, name, productKey, description } =
      ProductDraftSchema.parse(req.body);

    const validatedVariant = VariantDraftSchema.parse(variants[0]);

    const variant = await prisma.variantForProduct.create({
      data: {
        sku: validatedVariant.sku,
        price: {
          create: {
            centAmount: validatedVariant.price.centAmount,
            currencyCode: validatedVariant.price.currencyCode,
            fractionDigits: validatedVariant.price.fractionDigits,
          },
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
