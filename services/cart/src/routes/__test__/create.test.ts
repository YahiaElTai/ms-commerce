import request from 'supertest';
import { app } from '../../app';
import { CartResponseSchema, FormattedErrors } from '../../validators';

describe('when cart draft object is not provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({})
      .expect(400);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]?.message).toBe('Required');
    expect(response.body[1]?.message).toBe('Required');
  });
});

describe('when only customer email is provided', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({ customerEmail: 'test@test.com' })
      .expect(400);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]?.message).toBe('Required');
  });
});

describe('when providing an invalid sku and no quantity', () => {
  it('should respond with 400', async () => {
    const response: { body: FormattedErrors[] } = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        lineItems: [{ sku: 12 }],
      })
      .expect(400);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]?.message).toBe('Required');
    expect(response.body[1]?.message).toBe('Expected string, received number');
  });
});

describe('when correct draft object is provided', () => {
  it('should respond with 201 and return the created cart', async () => {
    const response = await request(app)
      .post('/api/carts')
      .send({
        customerEmail: 'test@test.com',
        lineItems: [
          { quantity: 12, sku: '123' },
          { quantity: 10, sku: '124' },
        ],
      })
      .expect(201);

    const validatedCart = CartResponseSchema.parse(response.body);

    expect(validatedCart).toEqual(
      expect.objectContaining({
        id: validatedCart.id,
        version: 1,
        customerEmail: 'test@test.com',
        totalLineItemQuantity: 22,
        createdAt: validatedCart.createdAt,
        updatedAt: validatedCart.updatedAt,
        lineItems: [
          { quantity: 12, sku: '123', id: validatedCart.lineItems[0]?.id },
          { quantity: 10, sku: '124', id: validatedCart.lineItems[1]?.id },
        ],
      })
    );
  });
});
