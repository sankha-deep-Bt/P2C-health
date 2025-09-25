import { Router } from "express";

const router = Router();
import { authenticate } from "../middleware/auth.middleware";
import {
  getHealthData,
  getPatientInfo,
  updatePatientInfo,
} from "../controllers/patient.controller";
import { updateOrCreateHealthData } from "../controllers/patient.controller";

router.use(authenticate);

router.get("/:id/health", getHealthData);
router.post("/:id/health", updateOrCreateHealthData);

router.get("/:id/patient-info", getPatientInfo);
router.post("/:id/patient-info", updatePatientInfo);

export default router;
