import mongoose, { Document } from "mongoose";

export interface AppointmentDocument extends Document {
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  date: Date;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new mongoose.Schema<AppointmentDocument>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorName: { type: String, required: true },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String, required: true },
    date: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model<AppointmentDocument>(
  "Appointment",
  appointmentSchema
);

export default AppointmentModel;
