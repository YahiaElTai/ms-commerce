import { z } from 'zod';
import { prisma } from '../../prisma';
import { projectKeySchema } from '../../validators';

type TProjectKey = z.infer<typeof projectKeySchema>;

const deleteAllProducts = async (value: string) => {
  const projectKey = JSON.parse(value) as TProjectKey;

  try {
    await prisma.product.deleteMany({ where: { projectKey } });
  } catch (e) {
    console.error('💣 Error happened while deleting products');
    console.log(e);
    return;
  }
};

export default deleteAllProducts;
