import request from 'supertest';
import { app } from '../../app';
import { CartListResponseSchema, TFormattedErrors } from '../../validators';
import {
  createCartWithoutLineItems,
  createProduct,
} from '../../utils/test-utils';

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn(() => ({
      consumer: jest.fn(() => ({
        connect: jest.fn(),
        send: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn(),
        disconnect: jest.fn(),
      })),
    })),
  };
});

const randomSKU =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

beforeAll(async () => {
  await createProduct(randomSKU);
});

describe('when no pagination or sorting is provided', () => {
  it('should responds with list of carts with default pagination and sorting', async () => {
    await createCartWithoutLineItems();

    const response = await request(app)
      .get('/api/test-project/carts')
      .send()
      .expect(200);

    const validatedResponse = CartListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.results[0]?.currency).toBe('EUR');
    expect(validatedResponse.offset).toBe(0);
    expect(validatedResponse.limit).toBe(20);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when pagination and sorting is provided', () => {
  it('should responds with list of carts with provided pagination and sorting', async () => {
    await createCartWithoutLineItems();

    const response = await request(app)
      .get(
        '/api/test-project/carts?limit=10&offset=0&sortBy=customerEmail&sortDirection=desc'
      )
      .send()
      .expect(200);

    const validatedResponse = CartListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.results[0]?.currency).toBe('EUR');
    expect(validatedResponse.offset).toBe(0);
    expect(validatedResponse.limit).toBe(10);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when incorrect pagination or sorting is provided', () => {
  it('should responds 400 and helpful error messages', async () => {
    const response: { body: TFormattedErrors[] } = await request(app)
      .get(
        '/api/test-project/carts?limit=200000&offset=200000&sortBy=lineItemsQuantity&sortDirection=desc'
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
      "Invalid enum value. Expected 'customerEmail' | 'lineItemCount', received 'lineItemsQuantity'"
    );
  });
});
