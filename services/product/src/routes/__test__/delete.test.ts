import request from 'supertest';
import { app } from '../../app';
import { ProductResponseSchema } from '../../validators';

import * as producer from '../../kafka/producer';

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn(() => ({
      producer: jest.fn(() => ({
        connect: jest.fn(),
        send: jest.fn(),
        disconnect: jest.fn(),
      })),
    })),
  };
});

describe('when product is found', () => {
  it('should delete the product and informs the user', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const createdProductResponse = await request(app)
      .post('/api/test-project/products')
      .send({
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        variants: [
          {
            sku: randomSKU,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
            },
          },
        ],
      })
      .expect(201);

    const validatedProduct = ProductResponseSchema.parse(
      createdProductResponse.body
    );

    const response: { body: [{ message: string }] } = await request(app)
      .delete(`/api/test-project/products/${validatedProduct.id}`)
      .send()
      .expect(200);

    expect(response.body[0].message).toBe(
      `Product with ID '${validatedProduct.id}' was successfully deleted.`
    );

    await request(app)
      .get(`/api/test-project/products/${validatedProduct.id}`)
      .send()
      .expect(404);
  });
});
