import { Router } from "express";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
} from "../middlewares/authJwt.js";

const router = Router();

router.get("/",  ContentController.getContents);

router.get("/:id", [verifyToken, canRead], ContentController.getContent);

router.post("/", [verifyToken, canWrite], ContentController.createContent);

router.put("/:id", [verifyToken, canWrite], ContentController.updateContent);

router.delete(
  "/:id",
  [verifyToken, canDelete],
  ContentController.deleteContent
);

export default router;
