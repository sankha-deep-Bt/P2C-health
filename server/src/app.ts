import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

//route imports
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import messageRoutes from "./routes/message.route";
import chatRoutes from "./routes/chat.route";
import patientRoutes from "./routes/patient.route";
import doctorRoutes from "./routes/doctor.route";
import appointmentRoutes from "./routes/appointment.route";

const app = express();

// app.use(cookieParser());
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "health ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

export default app;
