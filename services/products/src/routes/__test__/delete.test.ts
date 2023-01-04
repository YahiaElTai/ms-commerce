import request from 'supertest';
import { app } from '../../app';
import { ProductResponseSchema } from '../../validators';

describe('when product is found', () => {
  it('should delete the product and informs the user', async () => {
    const randomSKU =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const createdProductResponse = await request(app)
      .post('/api/products')
      .send({
        name: 'product-name-hm',
        productKey: 'hm-pants-key',
        variants: [
          {
            sku: randomSKU,
            price: {
              centAmount: 67000,
              currencyCode: 'EUR',
            },
          },
        ],
      })
      .expect(201);

    const validatedProduct = ProductResponseSchema.parse(
      createdProductResponse.body
    );

    const response: { body: [{ message: string }] } = await request(app)
      .delete(`/api/products/${validatedProduct.id}`)
      .send()
      .expect(200);

    expect(response.body[0].message).toBe(
      `Product with ID '${validatedProduct.id}' was successfully deleted.`
    );

    await request(app)
      .get(`/api/products/${validatedProduct.id}`)
      .send()
      .expect(404);
  });
});
