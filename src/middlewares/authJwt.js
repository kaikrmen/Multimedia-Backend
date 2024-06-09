import jwt from "jsonwebtoken";
import { SECRET } from "./../../config.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
    const user = await User.findById(req.userId).populate('roles');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.roles.map((role) => role.name);
    const roleWithReadAccess = ["reader", "creator", "admin"];
    if (!roles.some((role) => roleWithReadAccess.includes(role))) {
      return res.status(403).json({ message: "Access denied: Read permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const canWrite = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.roles.map((role) => role.name);
    const roleWithWriteAccess = ["creator", "admin"];
    if (!roles.some((role) => roleWithWriteAccess.includes(role))) {
      return res.status(403).json({ message: "Access denied: No write permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const canDelete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('roles');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.roles.map((role) => role.name);
    const roleWithDeleteAccess = ["admin"];
    if (!roles.some((role) => roleWithDeleteAccess.includes(role))) {
      return res.status(403).json({ message: "Access denied: No delete permission" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
