import request from 'supertest';
import { app } from '../../app';
import { CartSchema } from '../../validators';

it('should responds with 404 and error message if cart is not found', async () => {
  await request(app)
    .get('/api/carts/635d013ae716eacb0e92d422')
    .send()
    .expect(400);
});

it('should responds with correct cart', async () => {
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

  const validatedResponse2 = CartSchema.parse(response2.body);

  expect(validatedResponse2.customerEmail).toEqual('test@test.com');
});
