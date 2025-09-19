import { Document, Model } from "mongoose";
import UserModel, { UserType } from "../models/user.model";
import DoctorModel, { DoctorType } from "../models/doctor.model";
import sendPasswordResetEmail from "../utils/nodemailer";
import { PatientModel, PatientType } from "../models/patient.model";

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

// Delete by ID
// export const deleteUser = async <T extends Document>(
//   id: string
// ): Promise<FoundUser<T>[]> => {
//   const models: [Role, any][] = [
//     ["user", UserModel],
//     ["patient", PatientModel],
//     ["doctor", DoctorModel],
//   ];

//   const deletedResults: FoundUser<T>[] = [];

//   for (const [role, model] of models) {
//     const deleted = await model.findByIdAndDelete(id);
//     if (deleted) {
//       deletedResults.push({ role, data: deleted });
//     }
//   }

//   return deletedResults;
// };

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
  const models: [Role, any][] = [
    ["base", UserModel],
    ["doctor", DoctorModel],
    ["patient", PatientModel],
  ];

  for (const [role, model] of models) {
    const user = await model.findOne({ email }).exec();
    if (user) return { role, data: user };
  }

  return null;
};

// Find by ID
export const findById = async <T extends Document>(
  id: string
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [
    ["base", UserModel],
    ["doctor", DoctorModel],
    ["patient", PatientModel],
  ];

  for (const [role, model] of models) {
    const user = await model.findById(id).exec();
    if (user) return { role, data: user };
  }

  return null;
};

// type UpdateData = Partial<{
//   name: string;
//   email: string;
//   password: string;
//   specialization?: string;
//   phone?: string;
//   address?: string;
//   isApproved?: boolean;
//   patientList?: string[];
//   refreshToken?: string;
// }>;

// export const updateUser = async <T extends Document>(
//   id: string,
//   data: Partial<UserType | DoctorType>
// ): Promise<FoundUser<T> | null> => {
//   const models: [Role, any][] = [
//     ["base", UserModel],
//     ["doctor", DoctorModel],
//     ["patient", PatientModel],
//   ];

//   const update = await UserModel.findByIdAndUpdate(id, data, { new: true });
//   const Role = update?.role;
//   if (!update) return null;

//   for (const [role, model] of models) {
//     if (role === Role) {
//       const updatedUser = await model.findByIdAndUpdate(id, data, {
//         new: true,
//       });
//       if (updatedUser) return { role, data: updatedUser };
//     }
//   }
//   return null;
// };

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

// 2. Delete related patient profile (if exists)
//   const deletedPatient = await PatientModel.findOneAndDelete({ userId: id });
//   if (deletedPatient) {
//     deletedResults.push({ role: "patient", data: deletedPatient as T });
//   }

//   // 3. Delete related doctor profile (if exists)
//   const deletedDoctor = await DoctorModel.findOneAndDelete({ userId: id });
//   if (deletedDoctor) {
//     deletedResults.push({ role: "doctor", data: deletedDoctor as T });
//   }

//   return deletedResults;
// };

// export const passwordReset = async (email: string) => {
//   // Implementation for sending password reset email
//   await sendPasswordResetEmail(email);

//   console.log(`Sending password reset email to ${email}`);
// };

// export const resetPassword = async (userId: string, newPassword: string) => {
//   // Implementation for resetting the user's password
//   // This is a placeholder function and should be implemented as per the application's requirements
//   const user = await UserModel.findById(userId);
//   if (user) {
//     user.password = newPassword;
//     await user.save();
//     console.log(`Password reset for user ID: ${userId}`);
//   } else {
//     console.log(`User with ID: ${userId} not found`);
//   }
// };
