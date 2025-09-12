import { Router } from "express";
import { addPatientToDoctor } from "../controllers/doctor.controller";

const router = Router();

router.post("/add-patient", addPatientToDoctor);

export default router;
