import request from 'supertest';
import { z } from 'zod';
import { app } from '../../app';
import { CartSchema } from '../../validators';

it('should responds with list of carts', async () => {
  await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test12@test.com',
      lineItems: [{ quantity: 12, sku: '12345' }],
    })
    .expect(201);

  await request(app)
    .post('/api/carts')
    .send({
      customerEmail: 'test12@test.com',
      lineItems: [{ quantity: 12, sku: '12345' }],
    })
    .expect(201);

  const response = await request(app).get('/api/carts').send().expect(200);

  const validatedResponse = z.array(CartSchema).parse(response.body);

  expect(validatedResponse.length).toBeGreaterThan(0);
});
