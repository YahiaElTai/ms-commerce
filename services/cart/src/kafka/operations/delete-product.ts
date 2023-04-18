import { z } from 'zod';
import { IdSchema } from '../../validators';
import { prisma } from '../../prisma';

type ID = z.infer<typeof IdSchema>;

const deleteProduct = async (value: string) => {
  const receivedProductId = JSON.parse(value) as ID;
  try {
    const validatedID = IdSchema.parse(receivedProductId);

    const product = await prisma.product.findFirst({
      where: { originalId: validatedID },
    });

    if (!product) {
      console.error(
        `💣 Error deleting a product - Product with original ID '${validatedID}' could not be found`
      );

      return;
    }

    await prisma.product.delete({ where: { id: product.id } });
  } catch (e) {
    console.error('💣 Error happened while deleting product with value', value);
    console.log(e);
  }
};

export default deleteProduct;
