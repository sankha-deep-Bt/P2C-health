//package imports
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import app from "./app";

//file imports
import { PORT } from "./constants/env";
import connectToDatabase from "./config/db";

connectToDatabase()
  .then(() =>
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    })
  )
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
