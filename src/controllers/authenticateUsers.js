// import user from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userExist = await user.findOne({ email });

//     if (!userExist) {
//       return res.status(404).json({ message: "INVALID CREDENTIALS" });
//     }

//     const isMatch = await bcrypt.compare(password, userExist.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "INVALID CREDENTIALS" });
//     }

//     const token = jwt.sign(
//       {
//         id: userExist._id,
//         role: userExist.role,
//         email: userExist.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" },
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     const userIsAdmin = (user) => user.role === "admin";
//     if (userIsAdmin(userExist)) {
//       return res.redirect("/admin/dashboard");
//     }

//     res.json({
//       message: "LOGIN SUCCESFUL",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// --- NEW REGISTRATION LOGIC ---
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (The hooks in your User model will hash the password)
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

// ... keep your existing loginUser code below this ...

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
    // console.log("User role from DB:", userExist.role);
    // Send the role back so the Frontend can decide where to redirect
    res.json({
      message: "LOGIN SUCCESSFUL",
      role: userExist.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
