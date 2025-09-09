import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/Route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-sigma-two.vercel.app",
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api", router);
app.listen(PORT, console.log(`Port number: ${PORT}`));
