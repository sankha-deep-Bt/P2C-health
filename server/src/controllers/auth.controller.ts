import { Request, Response } from "express";
import { generateTokens } from "../utils/jwt";
import {
  createOrUpdateSession,
  deleteSessionByToken,
} from "../models/session.model";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import { createUser, findByEmail } from "../services/user.services";
import UserModel, { UserDocument } from "../models/user.model";
import DoctorModel, { DoctorDocument } from "../models/doctor.model";
import { RegisterInput, LoginInput } from "../middleware/validate.middleware";

export type FoundUser =
  | { role: "user"; data: UserDocument }
  | { role: "doctor"; data: DoctorDocument };

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  try {
    const {
      userType,
      name,
      email,
      password,
      specialization,
      phone,
      address,
      isApproved,
    } = req.body;

    let user;
    if (userType === "doctor") {
      user = await createUser(DoctorModel, {
        name,
        email,
        password,
        specialization,
        phone,
        address,
        isApproved,
      });
    } else {
      // userType === "user" or "admin"
      user = await createUser(UserModel, {
        name,
        email,
        password,
      });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: userType,
    });

    await createOrUpdateSession(user._id.toString(), refreshToken, req);
    setAuthCookies({ res, accessToken, refreshToken });

    return res.status(201).json({
      message: "Account created successfully",
      user: user.omitPassword(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating account",
      error: (error as Error).message,
    });
  }
};

// export const register = async (req: Request, res: Response) => {

//   try {
//     const {
//       userType,
//       name,
//       email,
//       password,
//       confirmPassword,
//       specialization,
//       phone,
//       address,
//       isApproved,
//     } = req.body;

//     if (!name || !email || !password || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     let user: UserDocument | DoctorDocument;
//     let role: "user" | "doctor";

//     if (userType === "user") {
//       user = await createUser(UserModel, {
//         name,
//         email,
//         password,
//       });
//       role = "user";
//     } else if (userType === "doctor") {
//       user = await createUser(DoctorModel, {
//         name,
//         email,
//         password,
//         specialization,
//         phone,
//         address,
//         isApproved,
//       });
//       role = "doctor";
//     } else {
//       return res.status(400).json({ message: "Invalid user type" });
//     }

//     const { accessToken, refreshToken } = generateTokens({
//       userId: user._id.toString(), // convert ObjectId to string
//       email: user.email,
//       role,
//     });

//     // Create session
//     await createOrUpdateSession(user._id.toString(), refreshToken, req);
//     setAuthCookies({ res, accessToken, refreshToken });

//     return res.status(201).json({
//       message: "Account created successfully",
//       user: user.omitPassword(),
//       accessToken,
//       refreshToken,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error creating account",
//       error: (error as Error).message,
//     });
//   }
// };

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const found = (await findByEmail(email)) as FoundUser | null;
    if (!found) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { role, data: user } = found;

    // Type narrowing ensures TS knows which model is in use
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role,
    });

    await createOrUpdateSession(user._id.toString(), refreshToken, req);
    setAuthCookies({ res, accessToken, refreshToken });

    return res.status(200).json({
      message: "Login successful",
      user: user.omitPassword(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: (error as Error).message,
    });
  }
};

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "All the fields are required" });
//     }

//     // Find user across all models
//     // const found: FoundUser | null = await findByEmail(email);
//     const found = (await findByEmail(email)) as FoundUser | null;
//     if (!found) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const { role, data: user } = found;

//     // Type narrowing ensures TS knows which model is in use
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate tokens with role
//     const { accessToken, refreshToken } = generateTokens({
//       userId: user._id.toString(),
//       email: user.email,
//       role,
//     });

//     // Create or update session
//     await createOrUpdateSession(user._id.toString(), refreshToken, req);
//     setAuthCookies({ res, accessToken, refreshToken });

//     return res.status(200).json({
//       message: "Login successful",
//       user: user.omitPassword(),
//       accessToken,
//       refreshToken,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error logging in",
//       error: (error as Error).message,
//     });
//   }
// };

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Refresh token not found in cookies" });
    }

    await deleteSessionByToken(refreshToken);
    clearAuthCookies(res);

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error: (error as Error).message,
    });
  }
};
