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

    // create intial product
    const product = await prisma.product.create({
      data: {
        name,
        projectKey,
        productKey,
        description,
        variants: {
          createMany: {
            data: variants.map((variant) => ({ sku: variant.sku })),
          },
        },
      },
      include: {
        variants: {
          include: {
            price: true,
          },
        },
      },
    });

    // update variants with their own prices
    // due to Prisma limitations, these steps have to be done separately
    for (const variant of variants) {
      await prisma.variant.update({
        where: { sku: variant.sku },
        data: {
          price: {
            create: variant.price,
          },
        },
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        variants: {
          include: {
            price: true,
          },
        },
      },
    });

    const validatedProduct = ProductSchema.parse(updatedProduct);

    const computedProduct = computeProductFields(validatedProduct);

    await produceMessage(TOPICS.productCreated, computedProduct);

    res.status(201).send(computedProduct);
  }
);

export { router as CreateProductRouter };
