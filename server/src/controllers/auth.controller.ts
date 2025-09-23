import { Request, Response } from "express";
import { generateTokens, verifyToken } from "../utils/jwt";
import {
  createOrUpdateSession,
  deleteSessionById,
  deleteSessionByRefreshToken,
} from "../models/session.model";
import {
  createUser,
  findByEmail,
  findById,
  findByPhone,
  FoundUser,
  updateUser,
} from "../services/user.services";
import UserModel, { UserDocument } from "../models/user.model";
import DoctorModel, { DoctorDocument } from "../models/doctor.model";
import { RegisterInput, LoginInput } from "../middleware/validate.middleware";
import sendPasswordResetEmail from "../utils/nodemailer";
import { PatientDocument, PatientModel } from "../models/patient.model";

// export const verifyPhone = async (req: Request, res: Response) => {
//   try {
//     const { phone } = req.body;
//     // send sms
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error verifying phone number",
//       error: (error as Error).message,
//     });
//   }
// };

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  try {
    const { userType, name, email, password } = req.body;

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const user: UserDocument = await createUser(UserModel, {
      name,
      email,
      password,
      role: userType,
    });
    // const uniqueId: user.uniqueId;

    if (userType === "doctor") {
      await createUser(DoctorModel, {
        userId: user._id,
        name,
        email,
        password,
        uniqueId: user.uniqueId,
      });
    } else {
      // userType === "user" or "admin" or "patient"
      await createUser(PatientModel, {
        userId: user._id,
        name,
        email,
        password,
        uniqueId: user.uniqueId,
      });
    }

    const { accessToken, refreshToken } = generateTokens(UserModel, {
      userId: (user as UserDocument)._id.toString(),
      role: userType,
    });

    // await updateUser(user._id.toString(), {
    //   refreshToken: refreshToken,
    // });
    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
    await createOrUpdateSession(user._id.toString(), refreshToken, meta);
    // setAuthCookies({ res, accessToken, refreshToken });

    return res.status(201).json({
      message: "Account created successfully",
      user: user.omitPassword(),
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating account",
      error: (error as Error).message,
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const found = (await findByEmail(email)) as FoundUser<UserDocument>;
    if (!found) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { role, data: user } = found;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(UserModel, {
      userId: user._id.toString(),
      role,
    });

    // const newUser = await updateUser(user._id.toString(), {
    //   refreshToken: refreshToken,
    // });
    const meta = {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
    await createOrUpdateSession(user._id.toString(), refreshToken, meta);

    return res.status(200).json({
      message: "Login successful",
      user: user.omitPassword(),
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error logging in",
      error: (error as Error).message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // const refreshToken = req.cookies?.refreshToken;
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(refreshToken || "");

    if (!payload) {
      return res.status(400).json({ message: "No refresh token provided " });
    }
    // const user = await updateUser(payload.userId, {
    //   refreshToken: "",
    // });

    const session = await deleteSessionByRefreshToken(refreshToken || "");
    if (!session) {
      return res.status(400).json({ message: "Session not found" });
    }

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error logging out",
      error: (error as Error).message,
    });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);
    if (!payload || payload.type !== "refresh") {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Clean payload (remove exp/iat)
    const { exp, iat, ...cleanPayload } = payload;

    // Generate new tokens
    const { accessToken: newAccessToken } = generateTokens(
      UserModel,
      cleanPayload
    );

    // Update refresh token in DB (single-device) or in sessions collection (multi-device)
    // await updateUser(payload.userId, { refreshToken });

    // Update session store (optional if you want session tracking)
    // await createOrUpdateSession(payload.userId, refreshToken, req);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error refreshing token",
      error: (error as Error).message,
    });
  }
};

//TODO: implement forgotPassword,resetPassword completely
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const found = (await findByEmail(email)) as FoundUser<UserDocument>;
    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }

    //TODO: Implement email service to send reset link
    await sendPasswordResetEmail(email);
    return res
      .status(200)
      .json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error processing forgot password",
      error: (error as Error).message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const found = (await findByEmail(email)) as FoundUser<UserDocument>;
    if (!found) {
      return res.status(404).json({ message: "User not found" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from old password" });
    }

    const { data: user } = found;

    user.password = newPassword;
    await updateUser(user._id.toString(), { password: newPassword });

    return res
      .status(200)
      .json({ message: "Password reset successfully. Please log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error resetting password",
      error: (error as Error).message,
    });
  }
};
