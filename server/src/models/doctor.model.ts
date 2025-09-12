import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../utils/jwt";

export interface DoctorType {
  name: string;
  email: string;
  password: string;
  specialization: string;
  phone?: string;
  address?: string;
  isApproved: boolean;
  patientList?: string[];
  refreshToken?: string;
}

export interface DoctorDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  specialization: string;
  phone?: string;
  address?: string;
  isApproved: boolean;
  patientList?: string[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<
    DoctorDocument,
    "password" | "comparePassword" | "omitPassword"
  >;
  // generateAccessToken(payload: JwtPayload): string;
  // generateRefreshToken(payload: JwtPayload): Promise<string>;
}

const doctorSchema = new mongoose.Schema<DoctorDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    specialization: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    isApproved: { type: Boolean, default: false },
    patientList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashValue(this.password);
  next();
});

/* ---------- Instance Methods ---------- */
doctorSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

doctorSchema.methods.omitPassword = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

// doctorSchema.methods.generateAccessToken = function (payload: JwtPayload) {
//   return generateAccessToken(payload);
// };

// doctorSchema.methods.generateRefreshToken = async function (
//   payload: JwtPayload
// ) {
//   const refreshToken = generateRefreshToken(payload);
//   this.refreshToken = refreshToken;
//   await this.save();
//   return refreshToken;
// };

const DoctorModel = mongoose.model<DoctorDocument>("Doctor", doctorSchema);

export default DoctorModel;
