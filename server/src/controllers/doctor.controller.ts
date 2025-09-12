import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { findById, updateUser, FoundUser } from "../services/user.services";
import { DoctorDocument, DoctorType } from "../models/doctor.model";

export const addPatientToDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctorId = req.user?.userId;
    const { patientId } = req.body;

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // doctor can be null → handle it
    const doctor = await findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await findById(patientId);
    if (!patient || patient.role !== "user") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // unwrap the actual Mongoose document
    const doctorDoc = doctor.data as DoctorDocument;

    if (!doctorDoc.patientList) {
      doctorDoc.patientList = []; // initialize if undefined
    }

    // Ensure patientList exists
    if (!doctorDoc.patientList.includes(patientId)) {
      doctorDoc.patientList.push(patientId);
      await doctorDoc.save();
    }

    return res.status(200).json({
      message: "Patient added to doctor successfully",
      doctor: doctorDoc, // return the actual doc instead of wrapper
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error adding patient to doctor",
      error: (error as Error).message,
    });
  }
};
