import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";

import User from "../src/models/User.js";
import Role from "../src/models/Role.js";
import AuthController from "../src/controllers/auth.controller.js";

let mongoServer;
let app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.post("/register", AuthController.register);
    app.post("/login", AuthController.login);
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("AuthController - Register", () => {
    it("should register a user successfully", async () => {
        const role = new Role({ name: "admin" });
        await role.save();

        const response = await request(app)
            .post("/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "Test1234",
                roles: [role.name]
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("should return an error if required fields are missing", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                email: "test@example.com",
                password: "Test1234"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Missing fields");
    });
});

describe("AuthController - Login", () => {
    it("should login the user successfully", async () => {
        const role = new Role({ name: "admin" });
        await role.save();
        const hashedPassword = await mongoose.model('User').encryptPassword("Test1234");
        const user = new User({
            username: "testuser",
            email: "test@example.com",
            password: hashedPassword,
            roles: [role._id]
        });
        await user.save();

        const response = await request(app)
            .post("/login")
            .send({
                email: "test@example.com",
                password: "Test1234"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("should fail if the password is incorrect", async () => {
        const role = new Role({ name: "admin" });
        await role.save();
        const hashedPassword = await mongoose.model('User').encryptPassword("Test1234");
        const user = new User({
            username: "testuser",
            email: "test@example.com",
            password: hashedPassword,
            roles: [role._id]
        });
        await user.save();

        const response = await request(app)
            .post("/login")
            .send({
                email: "test@example.com",
                password: "WrongPassword"
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toContain("Invalid Password");
    });
});
