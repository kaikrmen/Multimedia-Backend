import { Router } from "express";
import ThemeController from "../controllers/theme.controller.js";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";

const router = Router();

router.get("/", ThemeController.getThemes);

router.get("/:id", [verifyToken, mongoId, canRead], ThemeController.getTheme);

router.post(
  "/",
  [verifyToken, canWrite],
  ThemeController.createTheme
);

router.put(
  "/:id",
  [verifyToken, canWrite, mongoId],
  ThemeController.updateTheme
);

router.delete("/:id", [verifyToken, canDelete, mongoId], ThemeController.deleteTheme);

export default router;
