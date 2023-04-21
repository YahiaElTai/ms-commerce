import request from 'supertest';
import { app } from '../../app';
import {
  FormattedErrors,
  ProductResponseSchema,
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

describe('when product draft object is not provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/test-project/products')
      .send({})
      .expect(400);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]?.message).toBe('Required');
  });
});

describe('when required product name is not provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/test-project/products')
      .send({
        productKey: 'product-1',
        variants: [
          {
            sku: 'product-sku-1',
            price: { centAmount: 2000, currencyCode: 'EUR' },
          },
        ],
      })
      .expect(400);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]?.message).toBe('Required');
  });
});

describe('when providing an invalid sku', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/test-project/products')
      .send({
        name: 'product-1',
        variants: [
          { sku: 12, price: { centAmount: 2000, currencyCode: 'EUR' } },
        ],
      })
      .expect(400);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]?.message).toBe('Expected string, received number');
  });
});

describe('when correct draft object is provided', () => {
  it('should respond with 201 and return the created product', async () => {
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

    expect(producer.produceMessage).toHaveBeenCalledWith(
      response.body,
      producer.TOPICS.productCreated
    );

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
              id: validatedVariant.price?.id,
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
