import { z } from 'zod';
import {
  ProductActionsSchema,
  ProductUpdatedResponseSchema,
  addVariantActionSchema,
  changeVariantPriceActionSchema,
  removeVariantActionSchema,
} from '../../validators';
import { prisma } from '../../prisma';
import { applicationLogger } from '../../loggers';

type TProductUpdated = z.infer<typeof ProductUpdatedResponseSchema>;

const updateProduct = async (value: string) => {
  const receivedMessage = JSON.parse(value) as TProductUpdated;

  try {
    const product = await prisma.product.findFirst({
      where: { originalId: receivedMessage.id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      applicationLogger.error(
        'Error happened while processing message from product_updated topic',
        {
          errorJsonString: `Product with original ID '${receivedMessage.id}' could not be found`,
          topic: 'product_updated',
          receivedValue: value,
        }
      );

      return;
    }

    switch (receivedMessage.action.type) {
      case ProductActionsSchema.Enum.addVariant: {
        const validatedAction = addVariantActionSchema.parse(
          receivedMessage.action
        );

        await prisma.product.update({
          where: { id: product.id },
          data: {
            variants: {
              create: {
                sku: validatedAction.value.sku,
                price: {
                  set: validatedAction.value.price,
                },
              },
            },
            version: {
              increment: 1,
            },
          },
        });

        break;
      }
      case ProductActionsSchema.Enum.removeVariant: {
        const validatedAction = removeVariantActionSchema.parse(
          receivedMessage.action
        );

        const variant = product.variants.find(
          (variant) => variant.sku === validatedAction.value.sku
        );

        if (!variant) {
          applicationLogger.error(
            'Error happened while processing message from product_updated topic',
            {
              errorJsonString: `Variant with SKU '${validatedAction.value.sku}' could not be found`,
              topic: 'product_updated',
              receivedValue: value,
            }
          );

          return;
        }

        await prisma.product.update({
          where: { id: product.id },
          data: {
            variants: {
              delete: {
                sku: validatedAction.value.sku,
              },
            },
            version: {
              increment: 1,
            },
          },
        });

        break;
      }
      case ProductActionsSchema.Enum.changeVariantPrice: {
        const validatedAction = changeVariantPriceActionSchema.parse(
          receivedMessage.action
        );

        const variant = product.variants.find(
          (variant) => variant.sku === validatedAction.value.sku
        );

        if (!variant) {
          applicationLogger.error(
            'Error happened while processing message from product_updated topic',
            {
              errorJsonString: `Variant with SKU '${validatedAction.value.sku}' could not be found`,
              topic: 'product_updated',
              receivedValue: value,
            }
          );

          return;
        }

        await prisma.product.update({
          where: { id: product.id },
          data: {
            variants: {
              update: {
                where: { sku: validatedAction.value.sku },
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

        break;
      }
    }
  } catch (e) {
    applicationLogger.error(
      'Error happened while processing message from product_updated topic',
      { errorJsonString: e, topic: 'product_updated', receivedValue: value }
    );
  }
};

export default updateProduct;
