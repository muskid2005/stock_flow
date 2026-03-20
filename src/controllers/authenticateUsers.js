import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: "USER REGISTERED SUCCESSFULLY",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (!userExist) {
      return res.status(404).json({ message: "INVALID CREDENTIALS" });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "INVALID CREDENTIALS" });
    }

    const token = jwt.sign(
      { id: userExist.id, role: userExist.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      id: userExist.id,
      message: "LOGIN SUCCESSFUL",
      role: userExist.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
