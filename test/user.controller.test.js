import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

import UserController from "../src/controllers/user.controller.js";
import { verifyToken } from "../src/middlewares/authJwt.js";
import { mongoId } from "../src/middlewares/mongoId.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";
import bcrypt from "bcryptjs";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());

  app.use("/users", verifyToken);
  app.get("/users", UserController.getUsers);
  app.get("/users/:id", mongoId, UserController.getUser);
  app.post("/users", UserController.createUser);
  app.put("/users/:id", mongoId, UserController.updateUser);
  app.delete("/users/:id", mongoId, UserController.deleteUser);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UserController - CRUD Operations", () => {
  let userToken, userId, roleId;

  beforeEach(async () => {
    const adminRole = await new Role({ name: "admin" }).save();
    roleId = adminRole._id.toString();

    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    const adminPassword = await hashPassword("password123");
    const user = await new User({
      username: "adminUser",
      email: "admin@example.com",
      password: adminPassword,
      roles: [adminRole._id],
    }).save();

    userToken = jwt.sign({ id: user._id }, SECRET, { expiresIn: "24h" });
    userId = user._id.toString();
  });

  it("should get all users successfully", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a single user by id successfully", async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
  });

  it("should create a user successfully", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "newUser",
        email: "newuser@example.com",
        password: "password123",
        roles: ["admin"],
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toEqual("newUser");
  });

  it("should update a user successfully", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "updatedUser",
        email: "updateduser@example.com",
        roles: ["admin"],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
  });

  it("should delete a user successfully", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
  });

  it("should return an error when trying to get a non-existent user", async () => {
    const response = await request(app)
      .get(`/users/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to create a user with missing required fields", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "",
        email: "newuser@example.com",
        password: "password123",
        roles: ["admin"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing fields");
  });

  it("should fail to update a user with non-existent id", async () => {
    const response = await request(app)
      .put(`/users/invalidId`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        username: "updatedUser",
        email: "updateduser@example.com",
        roles: ["admin"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to delete a non-existent user", async () => {
    const response = await request(app)
      .delete(`/users/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });
});
