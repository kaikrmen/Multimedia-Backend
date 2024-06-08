import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import {
  checkExistingUser,
  checkExistingRole,
} from "../middlewares/verifySignup.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/register",
  [checkExistingUser, checkExistingRole],
  AuthController.register
);

router.post("/login", AuthController.login);

export default router;
