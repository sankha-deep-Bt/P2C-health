//package imports
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//file imports
import { PORT } from "./constants/env";
import connectToDatabase from "./config/db";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectToDatabase();
});
