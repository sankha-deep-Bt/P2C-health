//package imports
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//file imports
import { PORT } from "./constants/env";
import connectToDatabase from "./config/db";

//route imports
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "health ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectToDatabase();
});
