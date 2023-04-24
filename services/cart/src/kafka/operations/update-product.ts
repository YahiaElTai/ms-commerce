import { z } from 'zod';
import {
  ProductActionsSchema,
  ProductUpdatedResponseSchema,
  addVariantActionSchema,
  changeVariantPriceActionSchema,
  removeVariantActionSchema,
} from '../../validators';
import { prisma } from '../../prisma';
import { BadRequestError } from '../../errors';

type TProductUpdated = z.infer<typeof ProductUpdatedResponseSchema>;

const updateProduct = async (value: string) => {
  const receivedMessage = JSON.parse(value) as TProductUpdated;

  const product = await prisma.product.findFirst({
    where: { originalId: receivedMessage.id },
    include: {
      variants: {
        include: {
          price: true,
        },
      },
    },
  });

  if (!product) {
    console.error(
      `💣 Error deleting a product - Product with original ID '${receivedMessage.id}' could not be found`
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
                create: validatedAction.value.price,
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
        throw new BadRequestError(
          `Variant with SKU '${validatedAction.value.sku}' could not be found`
        );
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
        throw new BadRequestError(
          `Variant with SKU '${validatedAction.value.sku}' could not be found`
        );
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
};

export default updateProduct;
