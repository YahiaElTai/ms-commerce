import { z } from 'zod';
import {
  ProductActionsSchema,
  ProductUpdatedMessageSchema,
  addVariantActionSchema,
  changeVariantPriceActionSchema,
  removeVariantActionSchema,
} from '../../validators';
import { prisma } from '../../prisma';

type TProductUpdated = z.infer<typeof ProductUpdatedMessageSchema>;

const updateProduct = async (value: string) => {
  const receivedMessage = JSON.parse(value) as TProductUpdated;

  const product = await prisma.product.findFirst({
    where: { originalId: receivedMessage.id },
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

      await prisma.product.update({
        where: { id: product.id },
        data: {
          variants: {
            delete: {
              id: validatedAction.value.id,
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

      await prisma.product.update({
        where: { id: product.id },
        data: {
          variants: {
            update: {
              where: { id: validatedAction.value.id },
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
