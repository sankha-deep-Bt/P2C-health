import mongoose, { Document } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../utils/jwt";

/* ---------- Interfaces ---------- */
export interface UserType {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
}

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<
    UserDocument,
    "password" | "comparePassword" | "omitPassword"
  >;
  // generateAccessToken(payload: JwtPayload): string;
  // generateRefreshToken(payload: JwtPayload): Promise<string>;
}

/* ---------- Schema ---------- */
const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    refreshToken: { type: String, required: false },
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

// userSchema.methods.generateAccessToken = function (payload: JwtPayload) {
//   return generateAccessToken(payload);
// };

// userSchema.methods.generateRefreshToken = async function (payload: JwtPayload) {
//   const refreshToken = generateRefreshToken(payload);
//   this.refreshToken = refreshToken;
//   await this.save();
//   return refreshToken;
// };

/* ---------- Model ---------- */
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
