import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User";
import Role from "../src/models/Role";
import bcrypt from "bcryptjs";

describe("Access Control Tests", () => {
  let mongoServer;
  let adminRole,
    creatorRole,
    readerRole,
    adminUser,
    creatorUser,
    readerUser,
    token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    adminRole = await new Role({ name: "admin" }).save();
    creatorRole = await new Role({ name: "creator" }).save();
    readerRole = await new Role({ name: "reader" }).save();

    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    const adminPassword = await hashPassword("password123");
    adminUser = await new User({
      username: "adminUser",
      email: "admin@example.com",
      password: adminPassword,
      roles: [adminRole._id],
    }).save();

    const creatorPassword = await hashPassword("password123");
    creatorUser = await new User({
      username: "creatorUser",
      email: "creator@example.com",
      password: creatorPassword,
      roles: [creatorRole._id],
    }).save();

    const readerPassword = await hashPassword("password123");
    readerUser = await new User({
      username: "readerUser",
      email: "reader@example.com",
      password: readerPassword,
      roles: [readerRole._id],
    }).save();

    const adminLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@example.com", password: "password123" });

    token = adminLoginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should allow admin to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${readerUser._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
