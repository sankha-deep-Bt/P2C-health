import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../middleware/validate.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/logout", authenticate, logout);

export default router;
