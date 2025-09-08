import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  updateProfile,
  deleteProfile,
  getSelfProfile,
  getProfile,
} from "../controllers/user.controller";

const router = Router();

router.get("/profile", authenticate, getSelfProfile);
router.get("/:id", authenticate, getProfile);
router.put("/", authenticate, updateProfile);
router.delete("/", authenticate, deleteProfile);

export default router;
