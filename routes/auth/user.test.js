const request = require("supertest");
const app = require("../../app");
const bcrypt = require("bcrypt");

describe("User Login", () => {
  test("should log in a user with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userCredentials = {
      email: "testuser@example.com",
      password: hashedPassword,
    };
    const response = await request(app)
      .post("/users/login")
      .send(userCredentials)
      .expect(200);

    console.log(response.body);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toEqual({
      email: "testuser@example.com",
    });
  }, 15000);

  it("should return 401 for invalid credentials", async () => {
    const invalidCredentials = {
      email: "testuser@example.com",
      password: "invalidpassword",
    };

    const response = await request(app)
      .post("/users/login")
      .send(invalidCredentials)
      .expect(401);
  }, 15000);

  it("should return 400 for missing email or password", async () => {
    const missingCredentials = {};

    const response = await request(app)
      .post("/users/login")
      .send(missingCredentials)
      .expect(400);
  }, 15000);

  it("should return 401 for non-existing user", async () => {
    const nonExistingUserCredentials = {
      email: "nonexistinguser@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/users/login")
      .send(nonExistingUserCredentials)
      .expect(401);
  }, 15000);

  it("should return a token with a successful login", async () => {
    const userCredentials = {
      email: "testuser@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/users/login")
      .send(userCredentials)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  }, 15000);

  it("should return 401 for an invalid password", async () => {
    const userCredentials = {
      email: "testuser@example.com",
      password: "invalidpassword",
    };

    const response = await request(app)
      .post("/users/login")
      .send(userCredentials)
      .expect(401);
  }, 15000);
});
