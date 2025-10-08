//package imports
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import app from "./app";

//file imports
import { PORT } from "./constants/env";
import connectToDatabase from "./config/db";

const HOST = "0.0.0.0";
connectToDatabase()
  .then(() =>
    // app.listen(Number(PORT), HOST, () => {
    // console.log("Server is running on http://192.168.0.100:" + PORT);
    // console.log("Server is running on http://" + HOST + ":" + PORT);
    // })
    app.listen(PORT, () => {
      console.log("Server is running on http//localhost:" + PORT);
    })
  )
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
