import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import categoryRoutes from "./category.route.js";
import contentRoutes from "./content.route.js";
import express from "express";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/contents", contentRoutes);
router.use("users", userRoutes);
export default router;
