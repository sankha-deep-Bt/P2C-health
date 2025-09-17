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

router.get("/", getAppointments);
router.post("/book", bookAppointment);
router.patch("/:appointmentId/status", updateAppointment);
router.delete("/:appointmentId", deleteAppointment);

export default router;
