import { Router } from "express";
import {
  verifyToken,
  canWrite,
  canRead,
  canDelete,
  mongoId
} from "../middlewares/authJwt.js";
import { mongoId } from "../middlewares/mongoId.js";

const router = Router();

router.get("/",  ContentController.getContents);

router.get("/:id", [verifyToken, mongoId, canRead], ContentController.getContent);

router.post("/", [verifyToken, canWrite], ContentController.createContent);

router.put("/:id", [verifyToken, mongoId, canWrite], ContentController.updateContent);

router.delete(
  "/:id",
  [verifyToken, canDelete],
  ContentController.deleteContent
);

export default router;
