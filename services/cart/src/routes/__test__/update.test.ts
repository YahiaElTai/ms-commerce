import request from 'supertest';
import { app } from '../../app';
import { CartSchema, FormattedErrors } from '../../validators';

it('should responds 400 and error message on bad request', async () => {
  const createdCart = await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      lineItems: [{ quantity: 12, sku: 'product-sku' }],
    });

  const validatedCart = CartSchema.parse(createdCart.body);

  const response: { body: (FormattedErrors | undefined)[] } = await request(app)
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
  expect(response.body[0]?.message).toEqual('Line item quantity is required');
  expect(response.body[1]?.message).toEqual('Line item SKU is required');
});

it('should responds with 200 when correctly updating the cart', async () => {
  const createdCart = await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      lineItems: [{ quantity: 12, sku: 'sku-1' }],
    });

  const validatedCart = CartSchema.parse(createdCart.body);

  await request(app)
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
});
