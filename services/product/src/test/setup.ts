import { prisma } from '../prisma';

afterAll(async () => {
  await prisma.$disconnect();
});
