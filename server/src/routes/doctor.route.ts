import { Router } from "express";
import {
  addPatientToDoctor,
  approveDoctor,
} from "../controllers/doctor.controller";

const router = Router();

router.post("/add-patient", addPatientToDoctor);
router.post("/doctor-approve", approveDoctor);

export default router;
