import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Information required are not filled" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role?.toUpperCase() || "USER",
      },
    });
    console.log(newUser);
    console.log("here");

    const jwt_token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _, ...UserWithoutPassword } = newUser;

    res.cookie("token", jwt_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res
      .status(201)
      .json({ token: jwt_token, user: UserWithoutPassword });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Email or Username has already been used" });
    }
    return res.status(500).json({ error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (!existingUser)
      return res.status(400).json(`This email is not yet registered `);

    // check if the password that is being passed is correct
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!comparePassword)
      return res.status(400).json(`The password is not the right one sorry!`);

    // Generate a token
    const newToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res
      .status(200)
      .json({ token: newToken, error: `User is successfully logged-in` });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: `Logged out successfully` });
};
export const userInfoUpdated = async (req, res) => {
  try {
    const { firstName, lastName, location, birthDate, education, skills } =
      req.body;

    const validSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const existingUser = await prisma.users.findUnique({
      where: { id: req.user.id },
    });

    const updatedInfo = await prisma.information.upsert({
      where: { userId: req.user.id },
      update: {
        firstName,
        lastName,
        location,
        birthDate: birthDate ? new Date(birthDate) : null,
        education,
        skills: {
          deleteMany: {},
          create: validSkills.map((name) => ({ name })),
        },
      },
      create: {
        userId: req.user.id,
        firstName,
        lastName,
        location,
        birthDate: birthDate ? new Date(birthDate) : null,
        education,
        skills: {
          create: validSkills.map((name) => ({ name })),
        },
      },
      include: { skills: true },
    });

    res.status(200).json(updatedInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const getAllDataOfUser = await prisma.information.findUnique({
      where: { userId },
      include: { skills: true },
    });

    res.status(200).json(getAllDataOfUser);
  } catch (error) {
    res.status(500).json({ error: "Server error " + error });
  }
};
