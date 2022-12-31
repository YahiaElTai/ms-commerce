import request from 'supertest';
import { app } from '../../app';
import { CartSchema } from '../../validators';

it('should responds 400 and error message on bad request', async () => {
  const response = await request(app).post('/api/carts').send().expect(400);

  expect(response.body).toHaveLength(2);
});

it('should responds with 201 and create a cart', async () => {
  const response = await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      lineItems: [{ quantity: 12, sku: '123' }],
    })
    .expect(201);

  const validatedResponse = CartSchema.parse(response.body);

  expect(validatedResponse.customerEmail).toEqual('test@test.com');
});
