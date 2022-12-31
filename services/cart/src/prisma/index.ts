import { PrismaClient } from '@prisma/client';
export * from './utils';

export const prisma = new PrismaClient();
