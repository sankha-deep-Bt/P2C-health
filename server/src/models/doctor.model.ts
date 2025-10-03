import mongoose, { Document } from "mongoose";

export interface DoctorType {
  userId: mongoose.Types.ObjectId;
  uniqueId: string;
  name: string;
  email: string;
  specialization?: string;
  profilePic?: string;
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
}

export interface DoctorDocument extends Document {
  userId: mongoose.Types.ObjectId;
  uniqueId: string;
  name: string;
  email: string;
  specialization?: string;
  profilePic?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new mongoose.Schema<DoctorDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uniqueId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    specialization: { type: String, required: false },
    profilePic: { type: String, required: false },
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
  },
  { timestamps: true }
);

const DoctorModel = mongoose.model<DoctorDocument>("Doctor", doctorSchema);

export default DoctorModel;
