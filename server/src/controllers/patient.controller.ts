import { AuthRequest } from "../middleware/auth.middleware";
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
    const existingHealthData = await ReportModel.findById(patientId);
    if (existingHealthData) {
      const updatedHealthData = await ReportModel.findByIdAndUpdate(
        patientId,
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
