import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import {
    canRead,
    canWrite,
    canDelete,
  verifyToken,
} from "../middlewares/authJwt.js";
import { checkDuplicateCategory } from "../middlewares/verifyReapetingFields.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get(
  "/",
  [verifyToken, canRead],
  CategoryController.getCategories
);
router.get(
  "/:id",
  [verifyToken, canRead],
  CategoryController.getCategory
);
router.post(
  "/",
  [verifyToken, canWrite, checkDuplicateCategory, upload.single('coverImage')],
  CategoryController.createCategory
);
router.put(
  "/:id",
  [verifyToken, canWrite, checkDuplicateCategory, upload.single('coverImage')],
  CategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyToken, canDelete],
  CategoryController.deleteCategory
);

export default router;
