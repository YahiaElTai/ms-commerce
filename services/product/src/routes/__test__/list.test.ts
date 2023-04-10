import request from 'supertest';
import { app } from '../../app';
import { ProductListResponseSchema, FormattedErrors } from '../../validators';

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

describe('when no pagination or sorting is provided', () => {
  it('should responds with list of products with default pagination and sorting', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await request(app)
      .post('/api/products')
      .send({
        name: 'product-name-hm-1',
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

    const response = await request(app).get('/api/products').send().expect(200);

    const validatedResponse = ProductListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.offset).toBe(0);
    expect(validatedResponse.limit).toBe(20);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when pagination and sorting is provided', () => {
  it('should responds with list of products with provided pagination and sorting', async () => {
    const produceMessageMock = jest.spyOn(producer, 'produceMessage');
    produceMessageMock.mockImplementation(() => Promise.resolve());

    const randomSKU =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await request(app)
      .post('/api/products')
      .send({
        name: 'product-name-hm-1',
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

    const response = await request(app)
      .get('/api/products?limit=10&offset=0&sortBy=name&sortDirection=desc')
      .send()
      .expect(200);

    const validatedResponse = ProductListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.results[0]?.name).toBe('product-name-hm-1');
    expect(validatedResponse.offset).toBe(0);
    expect(validatedResponse.limit).toBe(10);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when incorrect pagination or sorting is provided', () => {
  it('should responds 400 and helpful error messages', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .get(
        '/api/products?limit=200000&offset=200000&sortBy=productDescription&sortDirection=desc'
      )
      .send()
      .expect(400);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]?.message).toBe(
      'Number must be less than or equal to 500'
    );
    expect(response.body[1]?.message).toBe(
      'Number must be less than or equal to 10000'
    );
    expect(response.body[2]?.message).toBe(
      "Invalid enum value. Expected 'name' | 'productKey' | 'variantsCount', received 'productDescription'"
    );
  });
});
