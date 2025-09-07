import { Request, Response } from "express";
import { createUser, findByEmail } from "../models/user.model";
import { generateTokens } from "../utils/jwt";
import {
  createOrUpdateSession,
  deleteSessionByToken,
} from "../models/session.model";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, isDoctor, isAdmin } =
      req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser({ name, email, password, isDoctor, isAdmin });

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(), // convert ObjectId to string
      email: user.email,
      isDoctor: user.isDoctor,
      isAdmin: user.isAdmin,
    });

    // Create session
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      isDoctor: user.isDoctor,
      isAdmin: user.isAdmin,
    });

    // Create or update session
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
