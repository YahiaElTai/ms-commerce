import { z } from 'zod';
import { IdSchema } from '../../validators';
import { prisma } from '../../prisma';
import { applicationLogger } from '../../loggers';

type TId = z.infer<typeof IdSchema>;

const deleteProduct = async (value: string) => {
  const id = JSON.parse(value) as TId;

  try {
    const validatedID = IdSchema.parse(id);

    const product = await prisma.product.findFirst({
      where: { originalId: validatedID },
    });

    if (!product) {
      applicationLogger.error(
        'Error happened while processing message from product_deleted topic',
        {
          errorJsonString: `Product with original ID '${validatedID}' could not be found`,
          topic: 'product_deleted',
          receivedValue: value,
        }
      );

      return;
    }

    await prisma.product.delete({ where: { id: product.id } });
  } catch (e) {
    applicationLogger.error(
      'Error happened while processing message from product_deleted topic',
      { errorJsonString: e, topic: 'product_deleted', receivedValue: value }
    );
  }
};

export default deleteProduct;
