import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

/* ---------- Interfaces ---------- */
export interface UserType {
  name: string;
  email: string;
  password: string;
  isDoctor?: boolean;
  isAdmin?: boolean;
}

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isDoctor?: boolean;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<
    UserDocument,
    "password" | "comparePassword" | "omitPassword"
  >;
}

/* ---------- Schema ---------- */
const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    isDoctor: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ---------- Middleware ---------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashValue(this.password);
  next();
});

/* ---------- Instance Methods ---------- */
userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

/* ---------- Model ---------- */
const UserModel = mongoose.model<UserDocument>("User", userSchema);

/* ---------- CRUD Helpers ---------- */
export const createUser = (data: UserType): Promise<UserDocument> => {
  const user = new UserModel(data).save();
  return user;
};

export const updateUser = (
  id: string,
  data: Partial<UserType>
): Promise<UserDocument | null> => {
  return UserModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = (id: string): Promise<UserDocument | null> => {
  return UserModel.findByIdAndDelete(id);
};

export const findByEmail = (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email }).exec();
};

export const findById = (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id).lean();
};

export default UserModel;
