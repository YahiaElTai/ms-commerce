import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';

describe('when incorrect update action is provided', () => {
  it('should respond with 400 and helpful error messages', async () => {
    const createdCart = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        lineItems: [{ quantity: 12, sku: 'product-sku' }],
      });

    const validatedCart = CartResponseSchema.parse(createdCart.body);

    const response: { body: FormattedErrors[] } = await request(app)
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

    expect(response.body).toHaveLength(2);
    expect(response.body[0]?.message).toEqual('Required');
    expect(response.body[1]?.message).toEqual('Required');
  });
});

describe('when correct update action is provided', () => {
  it('should respond with 200 and return the updated cart with correct version', async () => {
    const createdCart = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        lineItems: [{ quantity: 12, sku: 'sku-1' }],
      });

    const validatedCart = CartResponseSchema.parse(createdCart.body);

    const updatedResponse = await request(app)
      .put(`/api/carts/${validatedCart.id}`)
      .send({
        version: 1,
        actions: [
          {
            type: 'addLineItem',
            value: {
              sku: 'sku-2',
              quantity: 5,
            },
          },
        ],
      })
      .expect(200);

    expect(updatedResponse.body).toEqual(
      expect.objectContaining({
        customerEmail: 'test@test.com',
        version: 2,
        totalLineItemQuantity: 17,
      })
    );
  });
});
