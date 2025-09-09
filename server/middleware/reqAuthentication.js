import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const requireAuthentication = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ error: "There is no token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while validating the token:" + error.message });
  }
};
