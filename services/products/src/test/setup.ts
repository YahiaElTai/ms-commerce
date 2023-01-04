import { prisma } from '../prisma';

beforeAll(async () => {
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
