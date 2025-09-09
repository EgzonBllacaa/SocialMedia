import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/Route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: allow both local dev and frontend Vercel
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://social-media-sigma-two.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
