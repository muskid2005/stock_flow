import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
