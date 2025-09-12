import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  bookAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller";

const router = Router();

router.use(authenticate);

router.post("/appointments", bookAppointment);
router.get("/appointments", getAppointments);
router.patch("/appointments/:appointmentId/status", updateAppointment);
router.delete("/appointments/:appointmentId", deleteAppointment);

export default router;
