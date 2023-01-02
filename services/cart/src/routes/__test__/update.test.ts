import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';
import { createProduct } from '../../utils/test-utils';

const randomSKU =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

beforeAll(async () => {
  await createProduct(randomSKU);
});

describe('when incorrect update action is provided', () => {
  it('should respond with 400 and helpful error messages', async () => {
    const response = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        currency: 'EUR',
        lineItems: [{ quantity: 12, sku: randomSKU }],
      })
      .expect(201);

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

describe('when correct update action is provided', () => {
  it('should respond with 200 and return the updated cart with correct version', async () => {
    const response = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        currency: 'EUR',
        lineItems: [{ quantity: 12, sku: randomSKU }],
      });

    const validatedCart = CartResponseSchema.parse(response.body);

    const updatedResponse = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'changeLineItemQuantity',
            value: {
              id: validatedCart.lineItems.find(
                (lineItem) => lineItem.sku === randomSKU
              )?.id,
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
        version: 2,
        totalLineItemQuantity: 5,
        totalPrice: {
          centAmount: 335000,
          currencyCode: 'EUR',
          fractionDigits: 2,
          id: validatedCart2.totalPrice.id,
        },
        createdAt: validatedCart2.createdAt,
        updatedAt: validatedCart2.updatedAt,
      })
    );
  });
});
