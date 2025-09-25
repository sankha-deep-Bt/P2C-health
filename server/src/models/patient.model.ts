import mongoose, { Date, Document } from "mongoose";

export interface PatientType {
  userId: mongoose.Types.ObjectId;
  uniqueId?: string;
  name?: string;
  age?: string;
  gender?: "male" | "female" | "other";
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    state?: string;
  };
  height?: string;
  weight?: string;
  avatar?: string;
  dob?: Date;
  birthTime?: string;
  birthPlace?: string;
  deliveryType?: string;
  deliveryTime?: string;
  occupation?: string;
  maritalStatus?: string;
  dateOfVisit?: Date;
  referredBy?: string;
}

export interface PatientDocument extends Document {
  userId: mongoose.Types.ObjectId;
  uniqueId?: string;
  name?: string;
  age?: string;
  gender?: "male" | "female" | "other";
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    state?: string;
  };
  height?: string;
  weight?: string;
  avatar?: string;
  dob?: Date;
  birthTime?: string;
  birthPlace?: string;
  deliveryType?: string;
  deliveryTime?: string;
  occupation?: string;
  maritalStatus?: string;
  dateOfVisit?: Date;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new mongoose.Schema<PatientDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uniqueId: { type: String, unique: true, sparse: true, ref: "User" },
  age: String,
  gender: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    district: String,
    postalCode: String,
    state: String,
  },
  height: String,
  weight: String,
  avatar: String,
  dob: Date,
  birthTime: String,
  birthPlace: String,
  deliveryType: String,
  deliveryTime: String,
  occupation: String,
  maritalStatus: String,
  dateOfVisit: Date,
  referredBy: String,
});

export const PatientModel = mongoose.model<PatientDocument>(
  "Patient",
  PatientSchema
);
