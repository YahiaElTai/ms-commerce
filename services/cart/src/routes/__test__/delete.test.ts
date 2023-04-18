import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';
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

describe('when cart is found', () => {
  it('should delete the cart and informs the user', async () => {
    const cartResponse = await createCartWithoutLineItems();

    const validatedCart = CartResponseSchema.parse(cartResponse.body);

    const response: { body: FormattedErrors[] } = await request(app)
      .delete(`/api/carts/${validatedCart.id}`)
      .send()
      .expect(200);

    expect(response.body[0]?.message).toBe(
      `Cart with ID '${validatedCart.id}' was successfully deleted.`
    );

    await request(app).get(`/api/carts/${validatedCart.id}`).send().expect(404);
  });
});
