import { Router } from "express";

const router = Router();
import { authenticate } from "../middleware/auth.middleware";
import { getHealthData } from "../controllers/patient.controller";
import { updateOrCreateHealthData } from "../controllers/patient.controller";

router.use(authenticate);

router.get("/:id/health", getHealthData);
router.post("/:id/health", updateOrCreateHealthData);

export default router;
