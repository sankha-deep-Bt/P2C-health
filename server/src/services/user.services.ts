import { Document, Model } from "mongoose";
import UserModel, { UserType } from "../models/user.model";
import DoctorModel, { DoctorType } from "../models/doctor.model";
import sendPasswordResetEmail, { sendEmail } from "../utils/nodemailer";
import { PatientModel, PatientType } from "../models/patient.model";
import { VerificationCodeModel } from "../models/verificationCode.model";

/* ---------- Generic Service Functions ---------- */

// Create a new document (User/Doctor)
export const createUser = async <T extends Document>(
  model: Model<T>,
  data: Partial<UserType | DoctorType | PatientType>
): Promise<T> => {
  const entity = new model(data);
  return entity.save();
};

type Role = "base" | "doctor" | "patient" | "admin";

export interface FoundUser<T extends Document> {
  role: Role;
  data: T;
}

export const deleteUser = async <T extends Document>(
  id: string
): Promise<FoundUser<T>[]> => {
  const deletedResults: FoundUser<T>[] = [];

  // 1. Delete the base user account
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (deletedUser) {
    deletedResults.push({ role: "base", data: deletedUser as T });
  }

  // 2. Delete related patient profile (if exists)
  const deletedPatient = await PatientModel.findOneAndDelete({ userId: id });
  if (deletedPatient) {
    deletedResults.push({ role: "patient", data: deletedPatient as T });
  }

  // 3. Delete related doctor profile (if exists)
  const deletedDoctor = await DoctorModel.findOneAndDelete({ userId: id });
  if (deletedDoctor) {
    deletedResults.push({ role: "doctor", data: deletedDoctor as T });
  }

  return deletedResults;
};
// Find by email
export const findByEmail = async <T extends Document>(
  email: string
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [["base", UserModel]];

  for (const [role, model] of models) {
    const user = await model.findOne({ email }).exec();
    if (user) return { role: user.role, data: user };
  }

  return null;
};

// Find by ID
// export const findById = async <T extends Document>(
//   id: string
// ): Promise<FoundUser<T> | null> => {
//   const models: [Role, any][] = [
//     ["base", UserModel],
//     ["doctor", DoctorModel],
//     ["patient", PatientModel],
//   ];

//   for (const [role, model] of models) {
//     const user = await model.findById(id).exec();
//     if (user) return { role: user.role, data: user };
//   }

//   return null;
// };

export const findById = async <T extends Document>(
  id: string
): Promise<FoundUser<T> | null> => {
  // Try base user first
  const baseUser = await UserModel.findById(id).exec();
  if (!baseUser) return null;

  // If user is a doctor, fetch doctor profile by userId
  if (baseUser.role === "doctor") {
    const doctor = await DoctorModel.findOne({ userId: baseUser._id }).exec();
    return { role: "doctor", data: (doctor || baseUser) as T };
  }

  // If user is a patient, fetch patient profile by userId
  if (baseUser.role === "patient") {
    const patient = await PatientModel.findOne({ userId: baseUser._id }).exec();
    return { role: "patient", data: (patient || baseUser) as T };
  }

  return { role: baseUser.role, data: baseUser as T };
};

export const findByPhone = async <T extends Document>(
  phone: string
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [["base", UserModel]];

  for (const [role, model] of models) {
    const user = await model.findOne({ phone }).exec();
    if (user) return { role, data: user };
  }

  return null;
};

export const updateUser = async <T extends Document>(
  id: string,
  data: Partial<UserType | DoctorType | PatientType>
): Promise<FoundUser<T> | null> => {
  // 1. Update the base User first
  const updatedBase = await UserModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedBase) return null;

  // 2. Depending on the role, update Doctor/Patient by userId
  if (updatedBase.role === "doctor") {
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { userId: id },
      data,
      { new: true }
    );
    return updatedDoctor
      ? { role: "doctor" as const, data: updatedDoctor as T }
      : { role: "base" as const, data: updatedBase as T };
  }

  if (updatedBase.role === "patient") {
    const updatedPatient = await PatientModel.findOneAndUpdate(
      { userId: id },
      data,
      { new: true }
    );
    return updatedPatient
      ? { role: "patient" as const, data: updatedPatient as T }
      : { role: "base" as const, data: updatedBase as T };
  }

  // 3. If admin or other roles
  return { role: "base" as const, data: updatedBase as T };
};

export const createCode = async (email: string, phone: string) => {
  const code = Math.floor(Math.random() * 1000000).toString();
  await VerificationCodeModel.create({ email, phone, code });
  await sendEmail(email, code);
};

export const verifyCode = async (code: string) => {
  const existingCode = await VerificationCodeModel.findOne({ code });

  if (!existingCode) {
    return false;
  }

  return true;
};
