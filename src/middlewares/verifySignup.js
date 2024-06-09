import User from "../models/User.js";
import Role from "../models/Role.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(400).json({ message: "The email already exists" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingRole = async (req, res, next) => {
  try {
    if (!req.body.roles || !Array.isArray(req.body.roles) || req.body.roles.length === 0) {
      return res.status(400).json({ message: "No roles provided" });
    }

    const roles = req.body.roles;
    const roleFound = await Role.find({ name: { $in: roles } });

    if (roleFound.length !== roles.length) {
      return res.status(400).json({ message: "One or more roles not found" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};