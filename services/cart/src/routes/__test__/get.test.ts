import request from 'supertest';
import { app } from '../../app';
import { CartSchema, FormattedErrors } from '../../validators';

describe('when cart is not found', () => {
  it('should respond with 404 ', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .get('/api/carts/635')
      .send()
      .expect(404);

    expect(response.body[0]?.message).toBe(
      "Cart with ID '635' could not be found"
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

    const validatedResponse = CartSchema.parse(response.body);

    const response2 = await request(app)
      .get(`/api/carts/${validatedResponse.id}`)
      .send()
      .expect(200);

    const validatedCart = CartSchema.parse(response2.body);

    expect(validatedCart).toEqual(
      expect.objectContaining({
        version: 1,
        customerEmail: 'test@test.com',
        lineItems: [{ quantity: 12, sku: '1234' }],
      })
    );
  });
});
