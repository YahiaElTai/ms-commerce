import request from 'supertest';
import { app } from '../../app';
import { CartListResponseSchema, FormattedErrors } from '../../validators';

describe('when no pagination or sorting is provided', () => {
  it('should responds with list of carts with default pagination and sorting', async () => {
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

    const validatedResponse = CartListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.offset).toBe(0);
    expect(validatedResponse.limit).toBe(20);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when pagination and sorting is provided', () => {
  it('should responds with list of carts with provided pagination and sorting', async () => {
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

    const response = await request(app)
      .get(
        '/api/carts?limit=10&offset=1&sortBy=customerEmail&sortDirection=desc'
      )
      .send()
      .expect(200);

    const validatedResponse = CartListResponseSchema.parse(response.body);

    expect(validatedResponse.results.length).toBeGreaterThan(0);
    expect(validatedResponse.offset).toBe(1);
    expect(validatedResponse.limit).toBe(10);
    expect(validatedResponse.count).toBeDefined();
  });
});

describe('when incorrect pagination or sorting is provided', () => {
  it('should responds 400 and helpful error messages', async () => {
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

    const response: { body: FormattedErrors[] } = await request(app)
      .get(
        '/api/carts?limit=200000&offset=200000&sortBy=lineItemsQuantity&sortDirection=desc'
      )
      .send()
      .expect(400);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]?.message).toBe(
      'Number must be less than or equal to 500'
    );
    expect(response.body[1]?.message).toBe(
      'Number must be less than or equal to 10000'
    );
    expect(response.body[2]?.message).toBe(
      "Invalid enum value. Expected 'customerEmail' | 'lineItemCount', received 'lineItemsQuantity'"
    );
  });
});
