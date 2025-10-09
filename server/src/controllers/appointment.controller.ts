import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createAppointment,
  findAppointmentUsingFilter,
  removeAppointment,
  updateAppointmentStatus,
} from "../services/appointment.services";
import { findById } from "../services/user.services";
import DoctorModel from "../models/doctor.model";

// Patient books an appointment
export const bookAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.userId as string;
    const { doctorId, doctorName, patientName, date, reason } = req.body;

    if (!patientId) return res.status(401).json({ message: "Unauthorized" });
    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and Date are required" });
    }

    const appointment = await createAppointment(
      doctorId,
      doctorName,
      patientId,
      patientName,
      date,
      reason
    );

    return res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating appointment",
      error: (error as Error).message,
    });
  }
};

// Get all appointments for logged-in user
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role; // "doctor" or "patient"

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Use findById to get profile info
    const doctorProfile = await DoctorModel.findOne({ userId: userId });
    if (!doctorProfile)
      return res.status(404).json({ message: "Doctor profile not found" });

    const filter: any = {};
    if (role === "doctor") filter.doctorId = doctorProfile._id;
    else filter.patientId = userId;

    const appointments = await findAppointmentUsingFilter(filter);

    if (!appointments || appointments.length === 0)
      return res.status(404).json({ message: "Appointments not found" });

    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching appointments",
      error: (error as Error).message,
    });
  }
};

// Doctor confirms/cancels appointment
export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await updateAppointmentStatus(appointmentId, status);

    if (!updated)
      return res.status(404).json({ message: "Appointment not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating appointment",
      error: (error as Error).message,
    });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await findAppointmentUsingFilter({
      _id: appointmentId,
    });

    if (!appointment || appointment.length === 0)
      return res.status(404).json({ message: "Appointment not found" });

    await removeAppointment(appointmentId);

    return res
      .status(200)
      .json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Error cancelling appointment",
      error: (error as Error).message,
    });
  }
};
