import request from "supertest";
import { app } from "../../app";

it("returns a 201 successful signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@gmail.com",
      password: "123456789",
    })
    .expect(201);
});

it("returns a 400 as email is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "fgnjkxfdngj",
      password: "35413564drgy",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@gmail.com",
      password: "123456789",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@gmail.com",
      password: "123456789",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@gmail.com",
      password: "123456789",
    })
    .expect(201);

  expect(response.headers["set-cookie"]).toBeDefined();
  expect(response.headers["set-cookie"][0]).toMatch(/jwt=.+;/);
});
