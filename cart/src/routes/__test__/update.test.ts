import request from "supertest";
import { app } from "../../app";

it("should responds with 401 status code for unauthenticated users", async () => {
  await request(app)
    .put("/api/carts/635d013ae716eacb0e92d422")
    .send()
    .expect(401);
});

it("should responds 400 and error message on bad request", async () => {
  const cookie = await global.signin();

  const createdCart = await request(app)
    .post("/api/carts")
    .set("Cookie", cookie)
    .send({
      customerEmail: "test@test.com",
      currency: "EUR",
      lineItems: [{}],
      shippingMethodId: "shipping-method-id",
      shippingAddress: {},
      billingAddress: {},
    });

  const response = await request(app)
    .put(`/api/carts/${createdCart.body.id}`)
    .set("Cookie", cookie)
    .send({
      version: 1,
      action: {
        type: "addLineItem",
        value: {
          sku: "sku-1",
        },
      },
    })
    .expect(400);

  expect(response.body.errors).toHaveLength(1);
  expect(response.body.errors[0].message).toEqual(
    "You must provide a valid quantity"
  );
});

it("should responds with 200 update the correct cart", async () => {
  const cookie = await global.signin();

  const createdCart = await request(app)
    .post("/api/carts")
    .set("Cookie", cookie)
    .send({
      customerEmail: "test@test.com",
      currency: "EUR",
      lineItems: [{}],
      shippingMethodId: "shipping-method-id",
      shippingAddress: {},
      billingAddress: {},
    });

  await request(app)
    .put(`/api/carts/${createdCart.body.id}`)
    .set("Cookie", cookie)
    .send({
      version: 1,
      action: {
        type: "addLineItem",
        value: {
          sku: "sku-1",
          quantity: 5,
        },
      },
    })
    .expect(200);
});
