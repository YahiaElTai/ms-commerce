import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';
import { createCart, createProduct } from '../../utils/test-utils';

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

describe('when incorrect update action is provided', () => {
  const randomSKU =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  beforeEach(async () => {
    await createProduct(randomSKU);
  });

  it('should respond with 400 and helpful error messages', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    const response2: { body: FormattedErrors[] } = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'addLineItem',
            value: {},
          },
        ],
      })
      .expect(400);

    expect(response2.body).toHaveLength(1);
    expect(response2.body[0]?.message).toEqual('Required');
  });
});

describe('when addLineItem update action is provided', () => {
  const randomSKU =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const randomSKU2 =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  beforeEach(async () => {
    await createProduct(randomSKU);
    await createProduct(randomSKU2);
  });

  it('should add the line item and recalculate the cart', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    const updatedResponse = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'addLineItem',
            value: {
              sku: randomSKU2,
              quantity: 6,
            },
          },
        ],
      })
      .expect(200);

    const validatedCart2 = CartResponseSchema.parse(updatedResponse.body);

    expect(validatedCart2).toEqual(
      expect.objectContaining({
        id: validatedCart2.id,
        version: 2,
        customerEmail: 'test@test.com',
        currency: 'EUR',
        createdAt: validatedCart2.createdAt,
        updatedAt: validatedCart2.updatedAt,
        totalLineItemQuantity: 18,
        totalPrice: {
          id: 1,
          centAmount: 1206000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
      })
    );
  });
});

describe('when changeLineItemQuantity update action is provided', () => {
  const randomSKU =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  beforeEach(async () => {
    await createProduct(randomSKU);
  });

  it('should update the quantity and recalculate the cart', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    const updatedResponse = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'changeLineItemQuantity',
            value: {
              id: validatedCart.lineItems[0]?.id,
              quantity: 5,
            },
          },
        ],
      })
      .expect(200);

    const validatedCart2 = CartResponseSchema.parse(updatedResponse.body);

    expect(validatedCart2).toEqual(
      expect.objectContaining({
        id: validatedCart2.id,
        customerEmail: 'test@test.com',
        currency: 'EUR',
        createdAt: validatedCart2.createdAt,
        updatedAt: validatedCart2.updatedAt,
        version: 2,
        totalLineItemQuantity: 5,
        totalPrice: {
          id: 1,
          centAmount: 335000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
      })
    );
  });
});

describe('when removeLineItem update action is provided', () => {
  const randomSKU =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  beforeEach(async () => {
    await createProduct(randomSKU);
  });

  it('should remove the item and recalculate the cart', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    const updatedResponse = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'removeLineItem',
            value: {
              id: validatedCart.lineItems[0]?.id,
            },
          },
        ],
      });

    const validatedCart2 = CartResponseSchema.parse(updatedResponse.body);
    expect(validatedCart2).toEqual(
      expect.objectContaining({
        id: validatedCart2.id,
        customerEmail: 'test@test.com',
        currency: 'EUR',
        createdAt: validatedCart2.createdAt,
        updatedAt: validatedCart2.updatedAt,
        version: 2,
        totalLineItemQuantity: 0,
        lineItems: [],
        totalPrice: {
          id: 1,
          centAmount: 0,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
      })
    );
  });
});
