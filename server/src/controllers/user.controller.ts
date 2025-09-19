// controllers/user.controller.ts
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { deleteUser, findById, updateUser } from "../services/user.services";
import { deleteSessionById } from "../models/session.model";

export const getSelfProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { userId, role } = req.user;

    // Select model based on role
    // const model = role === "doctor" ? DoctorModel : UserModel;

    const user = await findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching profile",
      error: (error as Error).message,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
      error: (error as Error).message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = req.user;
    const updates = req.body;

    // Prevent role changes
    if (updates.role && updates.role !== role) {
      return res.status(400).json({ message: "Role change is not allowed" });
    }

    const user = await findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await updateUser(userId, updates);

    return res.status(200).json({ updatedUser });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user",
      error: (error as Error).message,
    });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    const deleted = await deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    // clear session or cookies if applicable
    await deleteSessionById(userId);

    // For mobile apps, no need to clear cookies.
    // Tokens should just be discarded client-side.

    return res.status(200).json({
      message: "User deleted successfully",
      user: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user",
      error: (error as Error).message,
    });
  }
};
