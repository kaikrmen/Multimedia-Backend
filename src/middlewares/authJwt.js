import jwt from "jsonwebtoken";
import { SECRET } from "./../../config.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const canRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleWithReadAccess = ["reader", "creator", "admin"];
    if (!roleWithReadAccess.includes(user.role.name)) {
      return res.status(403).json({ message: "Access denied: No read permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const canWrite= async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleWithWriteAccess = ["creator", "admin"];
    if (!roleWithWriteAccess.includes(user.role.name)) {
      return res.status(403).json({ message: "Access denied: No write permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const canDelete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('role');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleWithDeleteAccess = ["admin"];
    if (!roleWithDeleteAccess.includes(user.role.name)) {
      return res.status(403).json({ message: "Access denied: No delete permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
