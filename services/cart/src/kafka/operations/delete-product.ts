import { z } from 'zod';
import { IdSchema } from '../../validators';
import { prisma } from '../../prisma';

type TReceivedId = z.infer<typeof IdSchema>;

const deleteProduct = async (value: string) => {
  const receivedId = JSON.parse(value) as TReceivedId;

  try {
    const validatedID = IdSchema.parse(receivedId);

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
