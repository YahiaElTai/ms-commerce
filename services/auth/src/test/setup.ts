import { prisma } from '../prisma';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
