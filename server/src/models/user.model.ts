import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import crypto from "crypto";

/* ---------- Interfaces ---------- */
export interface UserType {
  name: string;
  uniqueId?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profilePic?: string;
  role?: "patient" | "doctor" | "admin" | "base";
  // refreshToken?: string;
}

export interface UserDocument extends Document, UserType {
  _id: mongoose.Types.ObjectId;
  uniqueId?: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profilePic?: string;
  role: "patient" | "doctor" | "admin";
  // refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<
    UserDocument,
    "password" | "comparePassword" | "omitPassword"
  >;
}

function generateUniqueId(role: string): string {
  let prefix: string;
  if (role === "doctor") {
    prefix = "DOC";
  } else if (role === "patient") {
    prefix = "PAT";
  } else {
    prefix = "ADM";
  }
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. A1B2C3
  const timestampPart = Date.now().toString(36).toUpperCase(); // compact timestamp
  return `${prefix}-${timestampPart}-${randomPart}`;
}

/* ---------- Patient Schema ---------- */

/* ---------- User Schema ---------- */
export const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    uniqueId: { type: String, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String },
    role: { type: String, enum: ["patient", "doctor", "admin"] },
  },
  { timestamps: true }
);

/* ---------- Middleware ---------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashValue(this.password);
  next();
});

userSchema.pre("save", async function (next, role) {
  if (!this.uniqueId) {
    this.uniqueId = generateUniqueId(this.role);
  }
  next();
});

/* ---------- Methods ---------- */
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

/* ---------- Model ---------- */
const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
