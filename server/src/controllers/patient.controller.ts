import { AuthRequest } from "../middleware/auth.middleware";
import { PatientModel } from "../models/patient.model";
import { ReportModel } from "../models/report.model";
import { Response } from "express";

export const getHealthData = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.id;

    // Fetch health data from the database
    const healthData = await ReportModel.find({ patientId: patientId });

    if (!healthData) {
      return res.status(404).json({ message: "Health data not found" });
    }

    return res.status(200).json(healthData);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching health data" });
  }
};

export const updateOrCreateHealthData = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const patientId = req.params.id;
    const updateData = req.body;

    // Update existing health data or create new if not exists
    const existingHealthData = await ReportModel.find({ patientId });
    if (existingHealthData) {
      const updatedHealthData = await ReportModel.findOneAndUpdate(
        {
          userId: patientId,
        },
        updateData,
        { new: true }
      );
      return res.status(200).json(updatedHealthData);
    }
    const newHealthData = new ReportModel({
      patientId: patientId,
      ...updateData,
    });
    await newHealthData.save();
    return res.status(201).json(newHealthData);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating health data", error });
  }
};

export const getPatientInfo = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.id;
    const patientInfo = await PatientModel.findOne({ userId: patientId });
    if (!patientInfo) {
      return res.status(404).json({ message: "Patient info not found" });
    }
    return res.status(200).json(patientInfo);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching patient info" });
  }
};

export const updatePatientInfo = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.id;
    const updateData = req.body;

    if (!patientId) {
      return res.status(404).json({ message: "Patient info not found" });
    }
    const updatedPatientInfo = await PatientModel.findOneAndUpdate(
      { userId: patientId },
      updateData,
      { new: true }
    );
    return res.status(200).json({ updatedPatientInfo });
  } catch (error) {
    return res.status(500).json({ message: "Error updating patient info" });
  }
};
