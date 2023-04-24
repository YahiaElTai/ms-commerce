import { z } from 'zod';
import { prisma } from '../../prisma';
import { ProductSchema } from '../../validators';

type TProduct = z.infer<typeof ProductSchema>;

const createProduct = async (value: string) => {
  const product = JSON.parse(value) as TProduct;

  try {
    // validate received product
    const { id, name, productKey, description, variants, projectKey } =
      ProductSchema.parse(product);

    // create all variants
    for (const variant of variants) {
      await prisma.variantForProduct.create({
        data: {
          sku: variant.sku,
          price: {
            create: variant.price,
          },
        },
      });
    }

    // finally create the product
    await prisma.product.create({
      data: {
        name,
        projectKey,
        originalId: id,
        productKey,
        description,
        variants: {
          connect: variants.map((variant) => ({ sku: variant.sku })),
        },
      },
    });
  } catch (e) {
    console.error('💣 Error happened while creating product with value', value);
    console.error(e);
  }
};

export default createProduct;
