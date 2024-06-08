import { Router } from "express";
import ThemeController from "../controllers/theme.controller.js";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
} from "../middlewares/authJwt.js";

const router = Router();

router.get("/", ThemeController.getThemes);

router.get("/:id", [verifyToken, canRead], ThemeController.getTheme);

router.post(
  "/",
  [verifyToken, canWrite],
  ThemeController.createTheme
);

router.put(
  "/:id",
  [verifyToken, canWrite],
  ThemeController.updateTheme
);

router.delete("/:id", [verifyToken, canDelete], ThemeController.deleteTheme);

export default router;
