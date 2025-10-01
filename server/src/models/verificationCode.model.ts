import mongoose, { Schema } from "mongoose";

const verificationCodeSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" },
});

export const VerificationCodeModel = mongoose.model(
  "VerificationCode",
  verificationCodeSchema
);
