import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

import CategoryController from "../src/controllers/category.controller.js";
import { verifyToken } from "../src/middlewares/authJwt.js";
import upload from "../src/middlewares/upload.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";
import bcrypt from "bcryptjs";
import Category from "../src/models/Category.js";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());

  app.use("/categories", verifyToken);
  app.get("/categories", CategoryController.getCategories);
  app.get("/categories/:id", CategoryController.getCategory);
  app.post("/categories", upload.single("file"), CategoryController.createCategory);
  app.put("/categories/:id", upload.single("file"), CategoryController.updateCategory);
  app.delete("/categories/:id", CategoryController.deleteCategory);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("CategoryController - CRUD Operations", () => {
  let userToken, categoryId;

  beforeEach(async () => {
    const adminRole = await new Role({ name: "admin" }).save();

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

    const category = new Category({
      name: "Initial Category",
      coverImageUrl: '../test/fixtures/test-image.png'
    });
    const savedCategory = await category.save();
    categoryId = savedCategory._id.toString();
  });

  it("should get all categories successfully", async () => {
    const response = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a single category by id successfully", async () => {
    const response = await request(app)
      .get(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", categoryId);
  });

  it("should delete a category successfully", async () => {
    const response = await request(app)
      .delete(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Category deleted successfully");
  });

  it("should fail to update a category with missing fields", async () => {
    const response = await request(app)
      .put(`/categories/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Incomplete Update" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Missing fields");
  });

});
