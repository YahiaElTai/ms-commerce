import { PrismaClient } from '@prisma/client';
import { hashingMiddlware } from '../middlewares/hashing';

const prisma: PrismaClient = new PrismaClient();

prisma.$use(hashingMiddlware);

export { prisma };
