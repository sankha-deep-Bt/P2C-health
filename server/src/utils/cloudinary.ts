import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../constants/env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default cloudinary;
