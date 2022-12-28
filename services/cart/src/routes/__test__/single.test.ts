import request from 'supertest';
import { app } from '../../app';

interface Cart {
  id: number;
  customerEmail: string;
}

it('should responds with 404 and error message if cart is not found', async () => {
  await request(app)
    .get('/api/carts/635d013ae716eacb0e92d422')
    .send()
    .expect(400);
});

it('should responds with correct cart', async () => {
  const response: { body: { cart: Cart } } = await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      currency: 'EUR',
      lineItems: [{ quantity: 12, sku: '1234' }],
      shippingMethodId: 'shipping-method-id',
    })
    .expect(201);

  const response2: { body: { cart: Cart } } = await request(app)
    .get(`/api/carts/${response.body.cart.id}`)
    .send()
    .expect(200);

  expect(response2.body.cart.customerEmail).toEqual('test@test.com');
});
