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
