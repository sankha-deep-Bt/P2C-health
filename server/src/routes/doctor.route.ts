import { Router } from "express";
import {
  addPatientToDoctor,
  approveDoctor,
  getDoctors,
} from "../controllers/doctor.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/get-doctors", getDoctors);

router.post("/add-patient", addPatientToDoctor);
router.post("/doctor-approve", approveDoctor);

export default router;
