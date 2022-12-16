import request from 'supertest';
import { app } from '../../app';

// jest.mock('../../pub-sub');

it('should responds with 401 status code for unauthenticated users', async () => {
  await request(app)
    .get('/api/carts/635d013ae716eacb0e92d422')
    .send()
    .expect(401);
});

it('should responds with 404 and error message if cart is not found', async () => {
  const cookie = await global.signin();

  const respone = await request(app)
    .get('/api/carts/635d013ae716eacb0e92d422')
    .set('Cookie', cookie)
    .send()
    .expect(400);
  expect(respone.body.errors[0].message).toEqual(
    'Cart with given ID could not be found'
  );
});

it('should responds with correct cart', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post('/api/carts')
    .set('Cookie', cookie)
    .send({
      customerEmail: 'test@test.com',
      currency: 'EUR',
      lineItems: [{ quantity: 12, sku: '1234' }],
      shippingMethodId: 'shipping-method-id',
    })
    .expect(201);

  const response2 = await request(app)
    .get(`/api/carts/${response.body.cart.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response2.body.customerEmail).toEqual('test@test.com');
});
