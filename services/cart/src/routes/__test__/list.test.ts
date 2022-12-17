import request from 'supertest';
import { app } from '../../app';

// jest.mock('../../pub-sub');

it('should responds with list of carts', async () => {
  await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test@test.com',
      lineItems: [{ quantity: 12, sku: '12345' }],
      shippingMethodId: 'shipping-method-id',
    })
    .expect(201);

  const respone = await request(app).get('/api/carts').send().expect(200);

  expect(respone.body.length).toBeGreaterThan(0);
});
