import User from "../models/User.js";
import { role } from "../models/Role.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res.status(400).json({ message: "The user already exists" });

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ message: "The email already exists" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingRole = (req, res, next) => {
  req.body.role.find();

  if (!req.body.role) return res.status(400).json({ message: "No role" });

  const roleFound = role.find((role) => role === req.body.role); 

  if (!roleFound)
    return res.status(400).json({ message: "Role not found" });

  
  next();
};