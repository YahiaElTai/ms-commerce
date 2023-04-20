import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';

export const createProduct = async (sku: string) => {
  const variant = await prisma.variantForProduct.create({
    data: {
      sku,
      price: {
        create: {
          centAmount: 67000,
          currencyCode: 'EUR',
        },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'HM pants',
      productKey: 'hm-pants-key',
      projectKey: 'test-project',
      originalId: 1,
      variants: {
        connect: { id: variant.id },
      },
    },
  });
};

export const createCart = (sku: string) =>
  request(app)
    .post('/api/test-project/carts')
    .send({
      customerEmail: 'test@test.com',
      currency: 'EUR',
      lineItems: [{ quantity: 12, sku }],
    })
    .expect(201);

export const createCartWithoutLineItems = () =>
  request(app)
    .post('/api/test-project/carts')
    .send({
      customerEmail: 'test@test.com',
      currency: 'EUR',
      lineItems: [],
    })
    .expect(201);
