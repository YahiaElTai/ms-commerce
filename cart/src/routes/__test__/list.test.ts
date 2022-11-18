import request from "supertest";
import { app } from "../../app";

jest.mock("../../pub-sub");

it("should responds with 401 status code for unauthenticated users", async () => {
  await request(app).get("/api/carts").send().expect(401);
});

it("should responds with list of carts", async () => {
  const cookie = await global.signin();

  await request(app)
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
    .get("/api/carts")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(respone.body).toHaveLength(1);
});
