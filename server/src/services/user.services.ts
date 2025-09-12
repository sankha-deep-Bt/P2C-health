import { Document, Model } from "mongoose";
import UserModel, { UserType } from "../models/user.model";
import DoctorModel, { DoctorType } from "../models/doctor.model";

/* ---------- Generic Service Functions ---------- */

// Create a new document (User/Doctor)
export const createUser = async <T extends Document>(
  model: Model<T>,
  data: Partial<UserType | DoctorType>
): Promise<T> => {
  const entity = new model(data);
  return entity.save();
};

type Role = "user" | "doctor" | "admin";

export interface FoundUser<T extends Document> {
  role: Role;
  data: T;
}

// Delete by ID
export const deleteUser = async <T extends Document>(
  id: string
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [
    ["user", UserModel],
    ["doctor", DoctorModel],
  ];

  for (const [role, model] of models) {
    const deleted = await model.findByIdAndDelete(id);
    // const deleteUser = deleted.data.omit("password");
    if (deleted) return { role, data: deleted };
  }

  return null;
};

// Find by email
export const findByEmail = async <T extends Document>(
  email: string
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [
    ["user", UserModel],
    ["doctor", DoctorModel],
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
    ["user", UserModel],
    ["doctor", DoctorModel],
  ];

  for (const [role, model] of models) {
    const user = await model.findById(id).exec();
    if (user) return { role, data: user };
  }

  return null;
};

type UpdateData = Partial<{
  name: string;
  email: string;
  password: string;
  specialization?: string;
  phone?: string;
  address?: string;
  isApproved?: boolean;
  patientList?: string[];
  refreshToken?: string;
}>;

export const updateUser = async <T extends Document>(
  id: string,
  data: UpdateData
): Promise<FoundUser<T> | null> => {
  const models: [Role, any][] = [
    ["user", UserModel],
    ["doctor", DoctorModel],
  ];

  for (const [role, model] of models) {
    const updated = await model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (updated) return { role, data: updated };
  }

  return null;
};
