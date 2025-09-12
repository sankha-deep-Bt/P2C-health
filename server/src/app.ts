import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

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

export default app;
