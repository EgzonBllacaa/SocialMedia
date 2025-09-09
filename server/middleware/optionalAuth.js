import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {}
  }
  next();
};
