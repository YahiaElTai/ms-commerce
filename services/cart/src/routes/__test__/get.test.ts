import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';

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
    const response = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        lineItems: [{ quantity: 12, sku: '1234' }],
      })
      .expect(201);

    const validatedCart = CartResponseSchema.parse(response.body);

    const response2 = await request(app)
      .get(`/api/carts/${validatedCart.id}`)
      .send()
      .expect(200);

    const validatedCart2 = CartResponseSchema.parse(response2.body);

    expect(validatedCart2).toEqual(
      expect.objectContaining({
        version: 1,
        customerEmail: 'test@test.com',
        createdAt: validatedCart2.createdAt,
        updatedAt: validatedCart2.updatedAt,
        totalLineItemQuantity: 12,
        lineItems: [
          { quantity: 12, sku: '1234', id: validatedCart2.lineItems[0]?.id },
        ],
      })
    );
  });
});
