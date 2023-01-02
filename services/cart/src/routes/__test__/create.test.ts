import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';
import { createProduct, createCart } from '../../utils/test-utils';

const randomSKU =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

beforeAll(async () => {
  await createProduct(randomSKU);
});

describe('when cart draft object is not provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({})
      .expect(400);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]?.message).toBe('Required');
  });
});

describe('when only customer email is provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({ customerEmail: 'test@test.com' })
      .expect(400);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]?.message).toBe('Required');
  });
});

describe('when providing an invalid sku and no quantity', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        currency: 'EUR',
        lineItems: [{ sku: 12 }],
      })
      .expect(400);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]?.message).toBe('Expected string, received number');
  });
});

describe('when correct draft object is provided', () => {
  it('should respond with 201 and return the created cart', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    expect(validatedCart).toEqual(
      expect.objectContaining({
        id: validatedCart.id,
        version: 1,
        customerEmail: 'test@test.com',
        currency: 'EUR',
        totalLineItemQuantity: 12,
        createdAt: validatedCart.createdAt,
        updatedAt: validatedCart.updatedAt,
        totalPrice: {
          centAmount: 804000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
      })
    );
  });
});
