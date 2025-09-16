import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

//route imports
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import messageRoutes from "./routes/message.route";
import chatRoutes from "./routes/chat.route";
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

export default app;
