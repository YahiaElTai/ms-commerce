import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';

beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// adding signin function to the global object of NodeJS
// just to avoid having to import this function everywhere
declare global {
  function signin(): Promise<string[]>;
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
