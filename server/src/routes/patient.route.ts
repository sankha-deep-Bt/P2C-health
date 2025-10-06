import { Router } from "express";

const router = Router();
import { authenticate } from "../middleware/auth.middleware";
import {
  getHealthData,
  getPatientInfo,
  updatePatientInfo,
  getReports,
} from "../controllers/patient.controller";
import { updateOrCreateHealthData } from "../controllers/patient.controller";
import { upload } from "../middleware/multer.middleware";

router.use(authenticate);

router.get("/:id/health", getHealthData);
router.post("/:id/health", updateOrCreateHealthData);

router.get("/:id/reports", getReports);

router.get("/:id/patient-info", getPatientInfo);
router.put("/:id/patient-info", upload.single("avatar"), updatePatientInfo);

export default router;
