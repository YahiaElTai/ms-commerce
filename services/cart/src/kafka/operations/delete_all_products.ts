import { z } from 'zod';
import { prisma } from '../../prisma';
import { projectKeySchema } from '../../validators';
import { applicationLogger } from '../../loggers';

type TProjectKey = z.infer<typeof projectKeySchema>;

const deleteAllProducts = async (value: string) => {
  const projectKey = JSON.parse(value) as TProjectKey;

  try {
    await prisma.product.deleteMany({ where: { projectKey } });
  } catch (e) {
    applicationLogger.error(
      'Error happened while processing message from product_all_deleted topic',
      { errorJsonString: e, topic: 'product_all_deleted', receivedValue: value }
    );
    return;
  }
};

export default deleteAllProducts;
