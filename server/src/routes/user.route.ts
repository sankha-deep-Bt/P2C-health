import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  updateProfile,
  deleteProfile,
  getSelfProfile,
  getProfile,
} from "../controllers/user.controller";

const router = Router();

router.use(authenticate);

router.get("/profile", getSelfProfile);
router.get("/:id", getProfile);

router.put("/", updateProfile);

router.delete("/", deleteProfile);

export default router;
