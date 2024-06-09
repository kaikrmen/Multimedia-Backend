import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import {
  canWrite,
  canDelete,
  canRead,
  verifyToken,
} from "../middlewares/authJwt.js";
import { checkExistingRole, checkExistingUser, validateEmail } from "../middlewares/verifySignup.js";
import { mongoId } from "../middlewares/mongoId.js";
const router = Router();

router.post(
  "/",
  [verifyToken, canWrite, checkExistingUser, checkExistingRole, validateEmail],
  UserController.createUser
);
router.get(
  "/",
  [verifyToken, canRead],
  UserController.getUsers
);
router.get(
  "/:id",
  [verifyToken, canRead, mongoId],
  UserController.getUser
);
router.put(
  "/:id",
  [verifyToken, canWrite, checkExistingUser, validateEmail, mongoId],
  UserController.updateUser
);

router.delete("/:id", [verifyToken, canDelete], UserController.deleteUser);

export default router;
