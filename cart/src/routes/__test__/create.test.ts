import request from "supertest";
import { app } from "../../app";

jest.mock("../../pub-sub");

it("should responds with 401 status code for unauthenticated users", async () => {
  await request(app).post("/api/carts").send().expect(401);
});

it("should responds 400 and error message on bad request", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/carts")
    .set("Cookie", cookie)
    .send()
    .expect(400);

  expect(response.body.errors).toHaveLength(7);
});

it("should responds with 201 and create a cart", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/carts")
    .set("Cookie", cookie)
    .send({
      customerEmail: "test@test.com",
      currency: "EUR",
      lineItems: [{}],
      shippingMethodId: "shipping-method-id",
      shippingAddress: {},
      billingAddress: {},
    })
    .expect(201);

  expect(response.body.cart.customerEmail).toEqual("test@test.com");
});
