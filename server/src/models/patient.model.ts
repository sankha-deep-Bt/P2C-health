import mongoose, { Document } from "mongoose";

export interface PatientType {
  userId: mongoose.Types.ObjectId;
  uniqueId?: string;
  name?: string;
  age?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
  height?: string;
  weight?: string;
  avatar?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  deliveryType?: string;
  deliveryTime?: string;
  occupation?: string;
  maritalStatus?: string;
  dateOfVisit?: string;
  referredBy?: string;
}

export interface PatientDocument extends Document {
  userId: mongoose.Types.ObjectId;
  uniqueId?: string;
  name?: string;
  age?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
  height?: string;
  weight?: string;
  avatar?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  deliveryType?: string;
  deliveryTime?: string;
  occupation?: string;
  maritalStatus?: string;
  dateOfVisit?: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new mongoose.Schema<PatientDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uniqueId: { type: String, unique: true, sparse: true, ref: "User" },
  name: String,
  age: String,
  gender: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    district: String,
    state: String,
    postalCode: String,
  },
  height: String,
  weight: String,
  avatar: String,
  dob: String,
  birthTime: String,
  birthPlace: String,
  deliveryType: String,
  deliveryTime: String,
  occupation: String,
  maritalStatus: String,
  dateOfVisit: String,
  referredBy: String,
});

export const PatientModel = mongoose.model<PatientDocument>(
  "Patient",
  PatientSchema
);
