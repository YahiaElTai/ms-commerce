import express, { Request, Response } from 'express';
import { BadRequestError, VersionMistachError } from '../errors';
import { computeProductFields } from '../model';
import { prisma } from '../prisma';
import {
  Actions,
  ProductDraftUpdateSchema,
  addVariantActionSchema,
  removeVariantActionSchema,
  changeVariantPriceActionSchema,
  IdParamSchema,
  ProductSchema,
} from '../validators';
import { TOPICS, produceMessage } from '../kafka/producer';

// Currently there's no information given to the user if one of the update actions fail.
// If all succeeds then great, the new updated product will be send to the user
// if one of them fail, then the execution of update actions will stop as it is an array
// eg: 10 update actions sent, and the 5th one fails, then 6th ... 10th are not executed
// and the error of the 5th update action is sent to the user

const router = express.Router();

router.put(
  '/api/:projectKey/products/:id',
  // As of Express@5 This syntax is supported however the types are not updated yet
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    // Validate ID and parse it into a number as required by PostgreSQL
    const { id } = IdParamSchema.parse(req.params);

    const { actions, version } = ProductDraftUpdateSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            price: true,
          },
        },
      },
    });

    if (!existingProduct) {
      throw new BadRequestError(`Product with ID '${id}' could not be found`);
    }

    if (existingProduct.version !== version) {
      throw new VersionMistachError();
    }

    for (const action of actions) {
      switch (action.type) {
        case Actions.Enum.addVariant: {
          const validatedAction = addVariantActionSchema.parse(action);

          await prisma.product.update({
            where: { id },
            data: {
              variants: {
                create: {
                  sku: validatedAction.value.sku,
                  price: {
                    create: validatedAction.value.price,
                  },
                },
              },
              version: {
                increment: 1,
              },
            },
          });

          await produceMessage(TOPICS.productUpdated, {
            id,
            action: validatedAction,
          });
          break;
        }
        case Actions.Enum.removeVariant: {
          const validatedAction = removeVariantActionSchema.parse(action);

          const variant = existingProduct.variants.find(
            (variant) => variant.sku === validatedAction.value.sku
          );

          if (!variant) {
            throw new BadRequestError(
              `Variant with SKU '${validatedAction.value.sku}' could not be found`
            );
          }

          await prisma.product.update({
            where: { id },
            data: {
              variants: {
                delete: {
                  sku: variant.sku,
                },
              },
              version: {
                increment: 1,
              },
            },
          });

          await produceMessage(TOPICS.productUpdated, {
            id,
            action: validatedAction,
          });
          break;
        }
        case Actions.Enum.changeVariantPrice: {
          const validatedAction = changeVariantPriceActionSchema.parse(action);

          const variant = existingProduct.variants.find(
            (variant) => variant.sku === validatedAction.value.sku
          );

          if (!variant) {
            throw new BadRequestError(
              `Variant with SKU '${validatedAction.value.sku}' could not be found`
            );
          }

          await prisma.product.update({
            where: { id },
            data: {
              variants: {
                update: {
                  where: { sku: variant.sku },
                  data: {
                    price: {
                      update: validatedAction.value.price,
                    },
                  },
                },
              },
              version: {
                increment: 1,
              },
            },
          });

          await produceMessage(TOPICS.productUpdated, {
            id,
            action: validatedAction,
          });

          break;
        }
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            price: true,
          },
        },
      },
    });

    if (!updatedProduct) {
      throw new BadRequestError(
        `Product with ID '${id}' could not be found. This is likely a server error. If this issue persist, please contact our support team.`
      );
    }

    const validatedProduct = ProductSchema.parse(updatedProduct);

    const computedProduct = computeProductFields(validatedProduct);

    return res.send(computedProduct);
  }
);

export { router as UpdateProductRouter };
