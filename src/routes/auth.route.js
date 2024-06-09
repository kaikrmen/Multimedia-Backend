import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import {
  checkExistingUser,
  checkExistingRole,
  validateEmail
} from "../middlewares/verifySignup.js";

const router = Router();

router.post(
  "/register",
  [checkExistingUser, checkExistingRole, validateEmail],
  AuthController.register
);

router.post("/login", [validateEmail], AuthController.login);

export default router;
