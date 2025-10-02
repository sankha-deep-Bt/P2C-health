import { Router } from "express";
import {
  addPatientToDoctor,
  approveDoctor,
} from "../controllers/doctor.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// router.get("/get-doctors", getDoctors);

router.post("/add-patient", addPatientToDoctor);
router.post("/doctor-approve", approveDoctor);

export default router;
