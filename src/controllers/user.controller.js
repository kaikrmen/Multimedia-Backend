import User from "../models/User.js";
import Role from "../models/Role.js";

class UserController {
  async createUser(req, res) {
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

      return res.status(200).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role.map((role) => role.name),
      });
    } catch (error) {
      res.status(500).json(error);
      console.error("Create User Error: ", error);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find().populate("role");

      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get Users Error: ", error);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ message: "Missing id" });

      const user = await User.findById(id).populate("role");

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
      console.error("Get User Error: ", error);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      if (!id || !username || !email || !role)
        return res.status(400).json({ message: "Missing fields" });

      const roleFound = await Role.find({ name: { $in: role } });

      const user = await User.findById(id, {
        username,
        email,
        role: roleFound.map((role) => role._id),
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      return res
        .status(200)
        .json({ message: "User updated successfully", user: user });
    } catch (error) {
      res.status(500).json(error);
      console.error("Update User Error: ", error);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ message: "Missing id" });

      const user = await User.findByIdAndDelete(id);

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
      console.error("Delete User Error: ", error);
    }
  }
}

export default new UserController();
