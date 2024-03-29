import request from 'supertest';
import { app } from '../../app';
import {
  ProductResponseSchema,
  TFormattedErrors,
  VariantSchema,
} from '../../validators';

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

describe('when product is not found', () => {
  it('should respond with 404 ', async () => {
    const response: { body: TFormattedErrors[] } = await request(app)
      .delete('/api/test-project/products/6449a42b087131a41584dcfb')
      .send()
      .expect(404);

    expect(response.body[0]?.message).toBe(
      "Product with ID '6449a42b087131a41584dcfb' could not be found"
    );
  });
});

describe('when product is found', () => {
  it('should respond with the found product', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const response = await request(app)
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

    const validatedProduct = ProductResponseSchema.parse(response.body);

    const validatedVariant = VariantSchema.parse(validatedProduct.variants[0]);

    expect(validatedProduct).toEqual(
      expect.objectContaining({
        id: validatedProduct.id,
        version: 1,
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        description: null,
        createdAt: validatedProduct.createdAt,
        updatedAt: validatedProduct.updatedAt,
        variants: [
          {
            id: validatedVariant.id,
            sku: randomSKU,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        ],
      })
    );
  });
});
