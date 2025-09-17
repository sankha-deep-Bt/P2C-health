import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface DoctorType {
  name: string;
  email: string;
  password: string;
  specialization?: string;
  experience?: number;
  qualification?: string;
  bio?: string;
  clinicName?: string;
  phone?: string;
  address?: string;
  isApproved: boolean;
  patientList?: string[];
  availability?: {
    day: string; // e.g. "Monday"
    startTime: string; // e.g. "09:00"
    endTime: string; // e.g. "17:00"
  }[];
  refreshToken?: string;
}

export interface DoctorDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  specialization?: string;
  experience?: number;
  qualification?: string;
  bio?: string;
  clinicName?: string;
  phone?: string;
  address?: string;
  isApproved: boolean;
  patientList?: string[];
  availability: {
    day: string; // e.g. "Monday"
    startTime: string; // e.g. "09:00"
    endTime: string; // e.g. "17:00"
  }[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<
    DoctorDocument,
    "password" | "comparePassword" | "omitPassword"
  >;
}

const doctorSchema = new mongoose.Schema<DoctorDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    specialization: { type: String, required: false },
    experience: { type: Number, required: false },
    qualification: { type: String, required: false },
    bio: { type: String, required: false },
    clinicName: { type: String, required: false },
    availability: [
      {
        day: { type: String, required: false },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
      },
    ],
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

const DoctorModel = mongoose.model<DoctorDocument>("Doctor", doctorSchema);

export default DoctorModel;
