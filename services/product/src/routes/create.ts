import express, { Request, Response } from 'express';
import { computeProductFields } from '../model';
import { prisma } from '../prisma';
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

    // 1. create product
    const product = await prisma.product.create({
      data: {
        name,
        projectKey,
        productKey,
        description,
      },
      include: {
        variants: true,
      },
    });

    // 2. create and connect all variants with prices (composite types)
    for (const variant of variants) {
      await prisma.variant.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: {
            set: variant.price,
          },
        },
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        variants: true,
      },
    });

    const validatedProduct = ProductSchema.parse(updatedProduct);

    const computedProduct = computeProductFields(validatedProduct);

    await produceMessage(TOPICS.productCreated, computedProduct);

    res.status(201).send(computedProduct);
  }
);

export { router as CreateProductRouter };
