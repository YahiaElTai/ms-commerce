import { prisma } from '../prisma';

beforeEach(async () => {
  await prisma.cart.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
