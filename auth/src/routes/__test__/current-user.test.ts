import request from "supertest";
import { app } from "../../app";

it("responds with details about current user", async () => {
  const cookie = await global.signin();

  const respone = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(respone.body.currentUser.email).toEqual("test@test.com");
});

it("responds with 401 if not authenticated", async () => {
  await request(app).get("/api/users/currentuser").send().expect(401);
});
