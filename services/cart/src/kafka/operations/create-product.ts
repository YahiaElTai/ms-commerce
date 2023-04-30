import { z } from 'zod';
import { prisma } from '../../prisma';
import { ProductSchema } from '../../validators';
import { applicationLogger } from '../../loggers';

type TProduct = z.infer<typeof ProductSchema>;

const createProduct = async (value: string) => {
  const receivedProduct = JSON.parse(value) as TProduct;

  try {
    // validate received product
    const { id, name, productKey, description, variants, projectKey } =
      ProductSchema.parse(receivedProduct);

    // 1. create the product
    const product = await prisma.product.create({
      data: {
        name,
        projectKey,
        originalId: id,
        productKey,
        description,
      },
    });

    // 2. create all variants and connect them to the product
    for (const variant of variants) {
      await prisma.variantForProduct.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: {
            set: variant.price,
          },
        },
      });
    }
  } catch (e) {
    applicationLogger.error(
      'Error happened while processing message from product_created topic',
      { errorJsonString: e, topic: 'product_created', receivedValue: value }
    );
  }
};

export default createProduct;
