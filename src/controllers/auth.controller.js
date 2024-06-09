import User from "../models/User.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../../config.js";
import bcrypt from "bcryptjs";

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, roles } = req.body;

      if (!username || !email || !password || !roles) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const roleFound = await Role.find({ name: { $in: roles } });

      if (roleFound.length === 0) {
        return res.status(400).json({ message: "One or more roles not found" });
      }

      const user = new User({
        username,
        email,
        password: await User.encryptPassword(password),
        roles: roleFound.map((role) => role._id),
      });

      const savedUser = await user.save();

      const token = jwt.sign({ 
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        roles: roleFound.map((role) => role.name),
      }, SECRET, {
        expiresIn: "24h",
      });

      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error("Create User Error: ", error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Invalid password format" });
      }

      const userFound = await User.findOne({ email }).populate("roles");

      if (!userFound) {
        return res.status(400).json({ message: "User Not Found" });
      }

      const matchPassword = await bcrypt.compare(password, userFound.password);

      if (!matchPassword) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      const token = jwt.sign(
        {
          id: userFound._id,
          username: userFound.username,
          email: userFound.email,
          roles: userFound.roles.map((role) => role.name),
        },
        SECRET,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error("Login Error: ", error);
    }
  }
}

export default new AuthController();
