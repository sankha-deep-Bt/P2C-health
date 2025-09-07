// import { DoctorDocument, DoctorType } from "../models/doctor.model";
// import UserModel, { UserDocument, UserType } from "../models/user.model";

// export const createUser = (data: UserType): Promise<UserDocument> => {
//   const user = new UserModel(data).save();
//   return user;
// };

// export const updateUser = (
//   id: string,
//   data: Partial<UserType | DoctorType>
// ): Promise<UserDocument | DoctorDocument | null> => {
//   return UserModel.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true,
//   });
// };

// export const deleteUser = (
//   id: string
// ): Promise<UserDocument | DoctorDocument | null> => {
//   return UserModel.findByIdAndDelete(id);
// };

// export const findByEmail = (
//   email: string
// ): Promise<UserDocument | DoctorDocument | null> => {
//   return UserModel.findOne({ email }).exec();
// };

// export const findById = (
//   id: string
// ): Promise<UserDocument | DoctorDocument | null> => {
//   return UserModel.findById(id).lean();
// };

import mongoose, { Document, Model } from "mongoose";
import UserModel, { UserDocument, UserType } from "../models/user.model";
import DoctorModel, {
  DoctorDocument,
  DoctorType,
} from "../models/doctor.model";

/* ---------- Generic Service Functions ---------- */

// Create a new document (User/Doctor)
export const createUser = async <T extends Document>(
  model: Model<T>,
  data: Partial<UserType | DoctorType>
): Promise<T> => {
  const entity = new model(data);
  return entity.save();
};

// Update an entity (User/Doctor)
export const updateUser = async <T extends Document>(
  model: Model<T>,
  id: string,
  data: Partial<UserType | DoctorType>
): Promise<T | null> => {
  return model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Delete an entity (User/Doctor)
// export const deleteUser = async <T extends Document>(
//   model: Model<T>,
//   id: string
// ): Promise<T | null> => {
//   return model.findByIdAndDelete(id);
// };

// // Find by email (User/Doctor)
// export const findByEmail = async <T extends Document>(
//   model: Model<T>,
//   email: string
// ): Promise<T | null> => {
//   return model.findOne({ email }).exec();
// };

// // Find by ID (User/Doctor)
// export const findById = async <T extends Document>(
//   model: Model<T>,
//   id: string
// ): Promise<T | null> => {
//   return model.findById(id);
// };

type Role = "user" | "doctor" | "admin";

interface FoundUser<T extends Document> {
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
