import express from "express";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "YOU HAVE AN ACCOUNT WITH US" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });

    if (!userExist) {
      return res.status(404).json({ message: "INVALID CREDENTIALS" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "INVALID CREDENTIALS" });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
        email: userExist.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userIsAdmin = (user) => user.role === "admin";
    if (userIsAdmin(userExist)) {
      return res.redirect("/admin/dashboard");
    }

    res.json({
      message: "LOGIN SUCCESFUL",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
