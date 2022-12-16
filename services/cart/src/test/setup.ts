import { prisma } from '../prisma';
import { generateToken } from '@ms-commerce/common';

beforeEach(async () => {
  await prisma.cart.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

declare global {
  function signin(): Promise<string[]>;
}

global.signin = async () => {
  const payload = {
    id: Math.floor(Math.random() * 10).toString(),
    email: 'test@test.com',
  };

  const token = generateToken(payload.id, payload.email);

  return [`access_token=${token}`];
};
