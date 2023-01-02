import request from 'supertest';
import { app } from '../app';

export const createProduct = (sku: string) =>
  request(app)
    .post('/api/products')
    .send({
      name: 'HM pants',
      productKey: 'hm-pants-key',
      variants: [
        {
          sku,
          price: {
            centAmount: 67000,
            currencyCode: 'EUR',
          },
        },
      ],
    })
    .expect(201);

export const createCart = (sku: string) =>
  request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      currency: 'EUR',
      lineItems: [{ quantity: 12, sku }],
    })
    .expect(201);
