import { AuthRequest } from "../middleware/auth.middleware";
import { PatientModel } from "../models/patient.model";
import { ReportModel } from "../models/report.model";
import { Response } from "express";
import { findById, updateUser } from "../services/user.services";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";

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
    console.error(error);
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
    const patientInfo = await findById(patientId);
    if (!patientInfo) {
      return res.status(404).json({ message: "Patient info not found" });
    }
    return res.status(200).json(patientInfo);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching patient info" });
  }
};

// export const updatePatientInfo = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { userId, role } = req.user;
//     const updates = req.body;
//     delete updates._id;

//     // Prevent role changes
//     if (updates.role && updates.role !== role) {
//       return res.status(400).json({ message: "Role change is not allowed" });
//     }

//     const user = await findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const updatedUser = await updateUser(userId, updates);

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error updating user",
//       error: (error as Error).message,
//     });
//   }
// };

export const updatePatientInfo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = req.user;
    const updates = { ...req.body };
    delete updates._id;

    // Prevent role tampering
    if (updates.role && updates.role !== role) {
      return res.status(400).json({ message: "Role change is not allowed" });
    }

    // Check if user exists
    const user = await findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If a file (like profile photo or report) is uploaded
    if (req.file && req.file.path) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (uploadResult?.secure_url) {
        updates.avatar = uploadResult.secure_url; // save URL under 'avatar' field
      }
    }

    // Update user record
    const updatedUser = await updateUser(userId, updates);

    return res.status(200).json({
      message: "Patient info updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating patient info:", error);
    return res.status(500).json({
      message: "Error updating patient info",
      error: (error as Error).message,
    });
  } finally {
    // Always clean up temp file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.id;
    const reports = await ReportModel.find({ patientId: patientId });
    if (!reports) {
      return res.status(404).json({ message: "Reports not found" });
    }
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reports" });
  }
};
