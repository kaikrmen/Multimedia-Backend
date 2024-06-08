import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../../config.js";

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password || !role)
        return res.status(400).json({ message: "Missing fields" });

      const roleFound = await Role.find({ name: { $in: role } });

      const user = new User({
        username,
        email,
        password,
        role: roleFound.map((role) => role._id),
      });

      user.password = await User.encryptPassword(user.password);

      const savedUser = await user.save();

      // Create a token
      const token = jwt.sign(
        {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role.map((role) => role.name),
        },
        SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json(error);
      console.error("Create User Error: ", error);
    }
  }

  async login(req, res) {
    try {
      const userFound = await User.findOne({ email: req.body.email }).populate(
        "role"
      );

      if (!userFound)
        return res.status(400).json({ message: "User Not Found" });

      const matchPassword = await User.comparePassword(
        req.body.password,
        userFound.password
      );

      if (!matchPassword)
        return res
          .status(401)
          .json({ token: null, message: "Invalid Password" });

      // Create a token
      const token = jwt.sign(
        {
          id: userFound._id,
          username: userFound.username,
          email: userFound.email,
          role: userFound.role.map((role) => role.name),
        },
        SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json(error);
      console.error("Login Error: ", error);
    }
  }
}

export default new AuthController();
