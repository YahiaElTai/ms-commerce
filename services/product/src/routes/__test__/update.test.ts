import request from 'supertest';
import { app } from '../../app';
import { ProductResponseSchema, TFormattedErrors } from '../../validators';
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('when incorrect update action is provided', () => {
  it('should respond with 400 and helpful error messages', async () => {
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

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      1,
      producer.TOPICS.productCreated,
      validatedProduct
    );

    const response2: { body: TFormattedErrors[] } = await request(app)
      .put(`/api/test-project/products/${validatedProduct.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'addVariant',
            value: {},
          },
        ],
      })
      .expect(400);

    expect(response2.body).toHaveLength(2);
    expect(response2.body[0]?.message).toEqual('Required');
  });
});

describe('when addVariant update action is provided', () => {
  it('should add the variant', async () => {
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

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      1,
      producer.TOPICS.productCreated,
      validatedProduct
    );

    const randomSKU2 =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const updatedResponse = await request(app)
      .put(`/api/test-project/products/${validatedProduct.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'addVariant',
            value: {
              sku: randomSKU2,
              price: {
                centAmount: 12000,
                currencyCode: 'EUR',
              },
            },
          },
        ],
      })
      .expect(200);

    const validatedProduct2 = ProductResponseSchema.parse(updatedResponse.body);

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      2,
      producer.TOPICS.productUpdated,
      {
        id: validatedProduct.id,
        action: {
          type: 'addVariant',
          value: {
            sku: randomSKU2,
            price: {
              centAmount: 12000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        },
      }
    );

    expect(validatedProduct2).toEqual(
      expect.objectContaining({
        id: validatedProduct2.id,
        version: 2,
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        description: null,
        createdAt: validatedProduct2.createdAt,
        updatedAt: validatedProduct2.updatedAt,
        variants: [
          {
            id: validatedProduct2.variants[0]?.id,
            sku: randomSKU,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
          {
            id: validatedProduct2.variants[1]?.id,
            sku: randomSKU2,
            price: {
              centAmount: 12000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        ],
      })
    );
  });
});

describe('when changeVariantPrice update action is provided', () => {
  it('should update the price', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU2 =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const response = await request(app)
      .post('/api/test-project/products')
      .send({
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        variants: [
          {
            sku: randomSKU2,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
            },
          },
        ],
      })
      .expect(201);

    const validatedProduct = ProductResponseSchema.parse(response.body);

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      1,
      producer.TOPICS.productCreated,
      validatedProduct
    );

    const updatedResponse = await request(app)
      .put(`/api/test-project/products/${validatedProduct.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'changeVariantPrice',
            value: {
              sku: validatedProduct.variants[0]?.sku,
              price: {
                centAmount: 12000,
                currencyCode: 'EUR',
              },
            },
          },
        ],
      })
      .expect(200);

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      2,
      producer.TOPICS.productUpdated,
      {
        id: validatedProduct.id,
        action: {
          type: 'changeVariantPrice',
          value: {
            sku: validatedProduct.variants[0]?.sku,
            price: {
              centAmount: 12000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        },
      }
    );

    const validatedProduct2 = ProductResponseSchema.parse(updatedResponse.body);

    expect(validatedProduct2).toEqual(
      expect.objectContaining({
        id: validatedProduct2.id,
        version: 2,
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        description: null,
        createdAt: validatedProduct2.createdAt,
        updatedAt: validatedProduct2.updatedAt,
        variants: [
          {
            id: validatedProduct2.variants[0]?.id,
            sku: randomSKU2,
            price: {
              centAmount: 12000,
              currencyCode: 'EUR',
              fractionDigits: 2,
            },
          },
        ],
      })
    );
  });
});

describe('when removeVariant update action is provided', () => {
  it('should remove the variant', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU2 =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const response = await request(app)
      .post('/api/test-project/products')
      .send({
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        variants: [
          {
            sku: randomSKU2,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
            },
          },
        ],
      })
      .expect(201);

    const validatedProduct = ProductResponseSchema.parse(response.body);

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      1,
      producer.TOPICS.productCreated,
      validatedProduct
    );

    const updatedResponse = await request(app)
      .put(`/api/test-project/products/${validatedProduct.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'removeVariant',
            value: {
              sku: validatedProduct.variants[0]?.sku,
            },
          },
        ],
      })
      .expect(200);

    expect(producer.produceMessage).toHaveBeenNthCalledWith(
      2,
      producer.TOPICS.productUpdated,
      {
        id: validatedProduct.id,
        action: {
          type: 'removeVariant',
          value: {
            sku: validatedProduct.variants[0]?.sku,
          },
        },
      }
    );

    const validatedProduct2 = ProductResponseSchema.parse(updatedResponse.body);

    expect(validatedProduct2).toEqual(
      expect.objectContaining({
        id: validatedProduct.id,
        version: 2,
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        description: null,
        createdAt: validatedProduct2.createdAt,
        updatedAt: validatedProduct2.updatedAt,
        variants: [],
      })
    );
  });
});
