import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../constants/env";

// Payload type
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: "15m" };
  return jwt.sign(payload, JWT_SECRET, options);
};

// Generate refresh token
export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: "7d" };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

// Verify access token
// export const verifyAccessToken = (token: string): JwtPayload | null => {
//   try {
//     return jwt.verify(token, JWT_SECRET) as JwtPayload;
//   } catch {
//     return null;
//   }
// };

// // Verify refresh token
// export const verifyRefreshToken = (token: string): JwtPayload | null => {
//   try {
//     return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
//   } catch {
//     return null;
//   }
// };

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const verifyToken = (
  token: string
): (JwtPayload & { type: "access" | "refresh" }) | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return { ...payload, type: "access" };
  } catch {
    try {
      const payload = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
      return { ...payload, type: "refresh" };
    } catch {
      return null;
    }
  }
};
