import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import {
  canWrite,
  canDelete,
  canRead,
  verifyToken,
} from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";
const router = Router();

router.post(
  "/",
  [verifyToken, canWrite, checkExistingUser],
  UserController.createUser
);
router.get(
  "/",
  [verifyToken, canRead],
  UserController.getUsers
);
router.get(
  "/:id",
  [verifyToken, canRead],
  UserController.getUser
);
router.put(
  "/:id",
  [verifyToken, canWrite, checkExistingUser],
  UserController.updateUser
);

router.delete("/:id", [verifyToken, canDelete], UserController.deleteUser);

export default router;
