import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDatabase = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }
  mongoose.connection.on("connected", () => {
    console.log("Successfully connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Database disconnected");
  });
  try {
    await mongoose.connect(MONGO_URI);
    // console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Could not connect to DB", (error as Error).message);
    process.exit(1);
  }
};
export default connectToDatabase;
