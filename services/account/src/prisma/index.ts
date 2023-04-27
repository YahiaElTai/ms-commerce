import { PrismaClient } from '@prisma/client';
import { hashingMiddlware } from '../middlewares';

export * from './utils';

const prisma = new PrismaClient();

prisma.$use(hashingMiddlware);

export { prisma };
