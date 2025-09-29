import { Schema } from "mongoose";

const verificationCodeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" },
});
