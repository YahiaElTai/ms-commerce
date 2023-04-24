import { z } from 'zod';
import { prisma } from '../../prisma';
import { projectKeySchema } from '../../validators';

type ProjectKeyType = z.infer<typeof projectKeySchema>;

const deleteAllProducts = async (value: string) => {
  const projectKey = JSON.parse(value) as ProjectKeyType;

  try {
    await prisma.product.deleteMany({ where: { projectKey } });
  } catch (e) {
    console.error('💣 Error happened while deleting products');
    console.log(e);
    return;
  }
};

export default deleteAllProducts;
