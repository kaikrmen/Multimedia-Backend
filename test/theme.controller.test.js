import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

import ThemeController from "../src/controllers/theme.controller.js";
import { verifyToken } from "../src/middlewares/authJwt.js";
import { mongoId } from "../src/middlewares/mongoId.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";
import Theme from "../src/models/Theme.js";
import bcrypt from "bcryptjs";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());

  app.use("/themes", verifyToken);
  app.get("/themes", ThemeController.getThemes);
  app.get("/themes/:id", mongoId, ThemeController.getTheme);
  app.post("/themes", ThemeController.createTheme);
  app.put("/themes/:id", mongoId, ThemeController.updateTheme);
  app.delete("/themes/:id", mongoId, ThemeController.deleteTheme);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("ThemeController - CRUD Operations", () => {
  let userToken, themeId;

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

    const theme = new Theme({
      name: "Initial Theme",
      permissions: {
        images: true,
        videos: false,
        texts: true,
      },
    });
    const savedTheme = await theme.save();
    themeId = savedTheme._id.toString();
  });

  it("should get all themes successfully", async () => {
    const response = await request(app)
      .get("/themes")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a single theme by id successfully", async () => {
    const response = await request(app)
      .get(`/themes/${themeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", themeId);
  });

  it("should create a theme successfully", async () => {
    const response = await request(app)
      .post("/themes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "New Theme",
        permissions: {
          images: true,
          videos: true,
          texts: true,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("New Theme");
  });

  it("should update a theme successfully", async () => {
    const response = await request(app)
      .put(`/themes/${themeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Updated Theme",
        permissions: {
          images: true,
          videos: true,
          texts: false,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", themeId);
  });

  it("should delete a theme successfully", async () => {
    const response = await request(app)
      .delete(`/themes/${themeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Theme deleted");
  });

  it("should return an error when trying to get a non-existent theme", async () => {
    const response = await request(app)
      .get(`/themes/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to create a theme with a duplicate name", async () => {
    const response = await request(app)
      .post("/themes")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Initial Theme",
        permissions: {
          images: true,
          videos: true,
          texts: true,
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name already exists");
  });

  it("should fail to update a theme with missing fields", async () => {
    const response = await request(app)
      .put(`/themes/${themeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Missing fields");
  });

  it("should fail to delete a non-existent theme", async () => {
    const response = await request(app)
      .delete(`/themes/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });
});
