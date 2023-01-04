import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';
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
      .delete('/api/carts/283794734')
      .send()
      .expect(404);

    expect(response.body[0]?.message).toBe(
      "Cart with ID '283794734' could not be found"
    );
  });
});

describe('when cart is found', () => {
  it('should deletes the cart and informs the user', async () => {
    const cartResponse = await createCart(randomSKU);

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
