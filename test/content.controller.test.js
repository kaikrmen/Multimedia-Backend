import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import ContentController from "../src/controllers/content.controller.js";
import { verifyToken } from "../src/middlewares/authJwt.js";
import { mongoId } from "../src/middlewares/mongoId.js";
import User from "../src/models/User.js";
import Role from "../src/models/Role.js";
import Theme from "../src/models/Theme.js";
import Content from "../src/models/Content.js";
import bcrypt from "bcryptjs";
import multer from "multer";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  app.use("/contents", verifyToken);
  app.get("/contents", ContentController.getContents);
  app.get("/contents/:id", mongoId, ContentController.getContent);
  app.post("/contents", upload.single("file"), ContentController.createContent);
  app.put(
    "/contents/:id",
    mongoId,
    upload.single("file"),
    ContentController.updateContent
  );
  app.delete("/contents/:id", mongoId, ContentController.deleteContent);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("ContentController - CRUD Operations", () => {
  let userToken, themeId, contentId;

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
        videos: true,
        texts: true,
      },
    });
    const savedTheme = await theme.save();
    themeId = savedTheme._id.toString();

    const content = new Content({
      title: "Initial Content",
      type: "text",
      text: "Some initial text content",
      theme: themeId,
      user: user._id,
    });
    const savedContent = await content.save();
    contentId = savedContent._id.toString();
  });

  it("should get all contents successfully", async () => {
    const response = await request(app)
      .get("/contents")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a single content by id successfully", async () => {
    const response = await request(app)
      .get(`/contents/${contentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", contentId);
  });

  it("should create content successfully", async () => {
    const response = await request(app)
      .post("/contents")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "New Content",
        type: "text",
        text: "Some new text content",
        theme: themeId,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toEqual("New Content");
  });

  it("should update content successfully", async () => {
    const response = await request(app)
      .put(`/contents/${contentId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Updated Content",
        type: "text",
        text: "Some updated text content",
        theme: themeId,
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toEqual("Updated Content");
  });

  it("should delete content successfully", async () => {
    const response = await request(app)
      .delete(`/contents/${contentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Content deleted successfully"
    );
  });

  it("should return an error when trying to get a non-existent content", async () => {
    const response = await request(app)
      .get(`/contents/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to create content with invalid theme id", async () => {
    const response = await request(app)
      .post("/contents")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "New Content",
        type: "text",
        text: "Some new text content",
        theme: "invalidThemeId",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to create content with missing required fields", async () => {
    const response = await request(app)
      .post("/contents")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "",
        type: "text",
        text: "Some new text content",
        theme: themeId,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing fields");
  });

  it("should fail to update content with non-existent id", async () => {
    const response = await request(app)
      .put(`/contents/invalidId`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Updated Content",
        type: "text",
        text: "Some updated text content",
        theme: themeId,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });

  it("should fail to delete a non-existent content", async () => {
    const response = await request(app)
      .delete(`/contents/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format");
  });
});
