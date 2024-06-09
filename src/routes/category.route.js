import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import {
  canRead,
  canWrite,
  canDelete,
  verifyToken,
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get("/", [verifyToken, canRead], CategoryController.getCategories);
router.get(
  "/:id",
  [verifyToken, canRead, mongoId],
  CategoryController.getCategory
);
router.post(
  "/",
  [verifyToken, canWrite, upload.single("file")],
  CategoryController.createCategory
);
router.put(
  "/:id",
  [verifyToken, canWrite, upload.single("file"), mongoId],
  CategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyToken, canDelete, mongoId],
  CategoryController.deleteCategory
);

export default router;
