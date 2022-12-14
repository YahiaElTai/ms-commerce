import request from 'supertest';
import { app } from '../../app';
import {
  CartResponseSchema,
  FormattedErrors,
  LineItemResponseSchema,
} from '../../validators';
import { createCart, createProduct } from '../../utils/test-utils';

const randomSKU =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

beforeAll(async () => {
  await createProduct(randomSKU);
});

describe('when cart is not found', () => {
  it('should respond with 404 ', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .get('/api/carts/283794734')
      .send()
      .expect(404);

    expect(response.body[0]?.message).toBe(
      "Cart with ID '283794734' could not be found"
    );
  });
});

describe('when cart is found', () => {
  it('should respond with the found cart', async () => {
    const response = await createCart(randomSKU);

    const validatedCart = CartResponseSchema.parse(response.body);

    const validatedLineItem = LineItemResponseSchema.parse(
      validatedCart.lineItems[0]
    );

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
          id: 1,
          centAmount: 804000,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        lineItems: [
          {
            id: validatedLineItem.id,
            quantity: validatedLineItem.quantity,
            price: {
              ...validatedLineItem.price,
            },
            totalPrice: {
              ...validatedLineItem.totalPrice,
            },
            variant: { ...validatedLineItem.variant },
            productName: validatedLineItem.productName,
            productKey: validatedLineItem.productKey,
          },
        ],
      })
    );
  });
});
