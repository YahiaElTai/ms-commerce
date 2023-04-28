import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';

export const createProduct = async (sku: string) => {
  const product = await prisma.product.create({
    data: {
      name: 'HM pants',
      productKey: 'hm-pants-key',
      projectKey: 'test-project',
      originalId: '644a5818b37fd1ee5926c85e',
    },
  });

  await prisma.variantForProduct.create({
    data: {
      productId: product.id,
      sku,
      price: {
        set: {
          centAmount: 67000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
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
