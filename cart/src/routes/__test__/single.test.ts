import request from "supertest";
import { app } from "../../app";

it("should responds with 401 status code for unauthenticated users", async () => {
  await request(app)
    .get("/api/carts/635d013ae716eacb0e92d422")
    .send()
    .expect(401);
});

it("should responds with 404 and error message if cart is not found", async () => {
  const cookie = await global.signin();

  const respone = await request(app)
    .get("/api/carts/635d013ae716eacb0e92d422")
    .set("Cookie", cookie)
    .send()
    .expect(400);
  expect(respone.body.errors[0].message).toEqual(
    "Cart with given ID could not be found"
  );
});

it("should responds with correct cart", async () => {
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

  const respone = await request(app)
    .get(`/api/carts/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(respone.body.customerEmail).toEqual("test@test.com");
});
