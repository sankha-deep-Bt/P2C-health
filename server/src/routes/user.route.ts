import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  updateProfile,
  deleteProfile,
  getSelfProfile,
  getProfile,
} from "../controllers/user.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.use(authenticate);

router.get("/profile", getSelfProfile);
router.get("/:id", getProfile);

router.put("/", upload.single("avatar"), updateProfile);

router.delete("/", deleteProfile);

export default router;
