import express, { Request, Response } from 'express';
import { computeProductFields } from '../model';
import { excludeIdsFromProduct, prisma } from '../prisma';
import {
  ProductDraftSchema,
  ProductSchema,
  ProjectKeyParamSchema,
} from '../validators';
import { TOPICS, produceMessage } from '../kafka/producer';

const router = express.Router();

router.post(
  '/api/:projectKey/products',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    const { projectKey } = ProjectKeyParamSchema.parse(req.params);

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
        projectKey,
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

    await produceMessage(TOPICS.productCreated, computedProduct);

    res.status(201).send(computedProduct);
  }
);

export { router as CreateProductRouter };
