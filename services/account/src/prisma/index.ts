import { PrismaClient } from '@prisma/client';
import { prismaHashingMiddlware } from '../middlewares';

export * from './utils';

const prisma = new PrismaClient();

prisma.$use(prismaHashingMiddlware);

export { prisma };
