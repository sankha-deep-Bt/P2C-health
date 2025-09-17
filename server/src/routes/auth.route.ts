import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshHandler,
  forgotPassword,
} from "../controllers/auth.controller";

import {
  loginSchema,
  registerSchema,
  validate,
} from "../middleware/validate.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.get("/refresh", refreshHandler);

//TODO: password functions
router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", () => {});

export default router;
