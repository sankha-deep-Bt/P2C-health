import mongoose from "mongoose";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SessionType = {
  _id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  userAgent?: string;
};

const sessionSchema = new mongoose.Schema<SessionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  sessionSchema
);

export const createOrUpdateSession = async (
  userId: string,
  accessToken: string,
  refreshToken: string,
  meta?: { userAgent?: string; ip?: string }
) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await SessionModel.deleteOne({ userId });

  return SessionModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    accessToken,
    refreshToken,
    userAgent: meta?.userAgent,
    ip: meta?.ip,
    expiresAt,
  });
};

export const deleteSessionById = async (userId: string) => {
  return SessionModel.deleteOne({
    userId: new mongoose.Types.ObjectId(userId),
  });
};
